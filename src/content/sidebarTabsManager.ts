import {
  ISidebarTab,
  ISidebarResponseArrayObject,
  debug,
  LUMOS_APP_BASE_URL,
  ISuggestedAugmentationObject,
  SPECIAL_URL_JUNK_STRING,
} from 'lumos-shared-js';
import { extractHostnameFromUrl, postAPI } from './helpers';

const APP_SUBTAB_TITLE = 'Insight';
const PINNED_TABS_KEY = 'pinnedTabs';
const VISITED_TABS_KEY = 'visitedTabs';
const VISITED_TABS_LIMIT = 1000 * 60 * 60 * 24 * 180;
const MAX_PINNED_TABS = 1;
const CUSTOM_SEARCH_ENGINES =
  'https://raw.githubusercontent.com/insightbrowser/augmentations/main/serp_query_selectors.json';

const getCustomSearchEngine = async (url: string) => {
  let storedValue: Record<string, CustomSearchEngine>;
  const { hostname, params } = extractHostnameFromUrl(url);
  if (!hostname) return null;
  const storageKey = hostname.replace(/\./g, '_'); // Be safe using `_` instead dots
  storedValue = await new Promise((resolve) => chrome.storage.sync.get(storageKey, resolve));
  if (!storedValue) {
    const result: CustomSearchEngine = Object.create({});
    const customSearchEngines = await fetch(CUSTOM_SEARCH_ENGINES);
    const results: Record<string, CustomSearchEngine> = await customSearchEngines.json();
    Object.values(results).forEach((customSearchEngine) => {
      const hasAllMatchinParams = !customSearchEngine.search_engine_json.required_params.filter(
        (i) => !params.includes(i),
      ).length;
      const hasRequiredPrefix = !!url.match(customSearchEngine.search_engine_json.required_prefix)
        ?.length;
      if (hasAllMatchinParams && hasRequiredPrefix)
        Object.assign(result, { ...customSearchEngine });
    });
    await new Promise((resolve) =>
      chrome.storage.sync.set({ [storageKey]: result }, () => resolve('Stored successfully')),
    );
    storedValue = {
      storageKey: result,
    };
  }
  return storedValue[storageKey];
};

const handleSubtabApiResponse = async (
  url: URL,
  document: Document,
  response_json: Record<
    string,
    Array<ISidebarResponseArrayObject> | Array<ISuggestedAugmentationObject>
  >,
) => {
  if (!(url && document && response_json)) {
    debug(
      'handleSubtabApiResponse - ERROR\nDEBUG `url` : %s\nDEBUG `document` : %s\n DEBUG `response_json` : %s',
      url,
      document,
      response_json,
    );
    return null;
  }

  debug('function call - handleSubtabApiResponse', url, response_json);

  const sidebarTabs: SidebarTab[] = [];
  const suggestedAugmentationResponse = response_json.suggested_augmentations as Array<ISuggestedAugmentationObject>;
  const customSearchEngine = await getCustomSearchEngine(url.href);
  if (!customSearchEngine?.querySelector) return null;
  const serpDomains = Array.from(
    document.querySelectorAll(customSearchEngine.querySelector.desktop),
  ).map((e) => extractHostnameFromUrl(e.textContent.split(' ')[0]).hostname);

  suggestedAugmentationResponse.forEach((augmentation: ISuggestedAugmentationObject) => {
    if (augmentation.id.startsWith('cse-')) {
      const domainsToLookFor = augmentation.conditions.condition_list.map(
        (e) => e.value[0],
      ) as Array<string>;
      if (serpDomains.filter((value) => domainsToLookFor.includes(value)).length > 0) {
        if (augmentation.actions.action_list?.[0].key == 'search_domains') {
          const domainsToSearch = augmentation.actions.action_list?.[0]?.value as Array<string>;
          const query = new URLSearchParams(document.location.search).get('q');
          const appendage: string =
            '(' + domainsToSearch.map((x) => 'site:' + x).join(' OR ') + ')';
          const customSearchUrl = new URL(
            `https://${customSearchEngine.search_engine_json.required_prefix}`,
          );
          customSearchUrl.searchParams.append('q', query + ' ' + appendage);
          customSearchUrl.searchParams.append(SPECIAL_URL_JUNK_STRING, SPECIAL_URL_JUNK_STRING);
          sidebarTabs.push({
            title: augmentation.name,
            url: customSearchUrl,
            default: !sidebarTabs.length,
          });
        }
      }
    }
  });
  return sidebarTabs;
};

const pinnedTabWithURL = (url: string) => ({
  title: 'Pinned',
  url: new URL(url),
  default: true,
  isPinnedTab: true,
});

const syncPinnedTabs = (storage: chrome.storage.StorageArea, tabs: string[]) => {
  storage.set({ [PINNED_TABS_KEY]: tabs });
};

const syncVisitedTabs = (storage: chrome.storage.StorageArea, tabs: Object) => {
  storage.set({ [VISITED_TABS_KEY]: tabs });
};

export default class SidebarTabsManager {
  currentPinnedTabs: string[];
  visitedTabs: Object;
  storage: chrome.storage.StorageArea;
  customSearchEngine: CustomSearchEngine;

  constructor() {
    this.storage = chrome.storage.sync;
    this.storage.get([PINNED_TABS_KEY, VISITED_TABS_KEY], (result) => {
      const pinnedTabs = result[PINNED_TABS_KEY] ?? [];
      this.currentPinnedTabs = Array.isArray(pinnedTabs) ? pinnedTabs : [pinnedTabs];
      this.visitedTabs = result[VISITED_TABS_KEY] ?? {};
    });
  }

  async fetchSubtabs(url: URL) {
    debug('function call - fetchSubtabs', url);
    const response_json = await postAPI('subtabs', { url: url.href }, { client: 'desktop' });
    const tabs = await handleSubtabApiResponse(url, document, response_json);
    return tabs;
  }

  async loginSubtabs(url: URL) {
    const tabs: Array<ISidebarResponseArrayObject> = [
      {
        url: url.href,
        preview_url: null,
        default: false,
        title: null,
        readable_content: null,
      },
      {
        url: LUMOS_APP_BASE_URL,
        preview_url: null,
        default: false,
        title: APP_SUBTAB_TITLE,
        readable_content: null,
      },
    ];
    return await handleSubtabApiResponse(url, document, { subtabs: tabs });
  }

  hasMaxPinnedTabs() {
    return this.currentPinnedTabs.length === MAX_PINNED_TABS;
  }

  updatedPinnedTabUrl(url: string, index: number) {
    this.currentPinnedTabs[index] = url;
    syncPinnedTabs(this.storage, this.currentPinnedTabs);
  }

  pinSidebarTab(url: string) {
    if (this.currentPinnedTabs.length >= MAX_PINNED_TABS) {
      return;
    }

    this.currentPinnedTabs.unshift(url);
    syncPinnedTabs(this.storage, this.currentPinnedTabs);

    if (url) {
      return pinnedTabWithURL(url);
    }
  }

  unpinSidebarTab(index: number) {
    if (this.currentPinnedTabs.length < index) {
      return;
    }

    this.currentPinnedTabs.splice(index, 1);
    syncPinnedTabs(this.storage, this.currentPinnedTabs);
  }

  getPinnedTabs(): ISidebarTab[] {
    const pinnedTabUrl = this.currentPinnedTabs;
    if (pinnedTabUrl?.length > 0) {
      return this.currentPinnedTabs.map((url) => pinnedTabWithURL(url));
    }
    return [];
  }

  isTabRecentlyVisited(url: string): boolean {
    const lastVisit = this.visitedTabs[url];

    if (!lastVisit) {
      return false;
    }

    return VISITED_TABS_LIMIT - (Date.now() - lastVisit) > 0;
  }

  tabVisited(url: string) {
    this.visitedTabs[url] = Date.now();
    syncVisitedTabs(this.storage, this.visitedTabs);
  }
}

import {
  ISidebarTab,
  ISidebarResponseArrayObject,
  debug,
  LUMOS_APP_BASE_URL,
} from 'lumos-shared-js';
import { postAPI } from './helpers';

const APP_SUBTAB_TITLE = 'Insight';
const PINNED_TABS_KEY = 'pinnedTabs';
const VISITED_TABS_KEY = 'visitedTabs';
const VISITED_TABS_LIMIT = 1000 * 60 * 60 * 24 * 180;
const MAX_PINNED_TABS = 1;

const handleSubtabResponse = (
  url: URL,
  document: Document,
  response_json: Array<ISidebarResponseArrayObject>,
  hasInitialSubtabs: boolean,
) => {
  if (!(url && document && response_json)) {
    return;
  }
  debug('function call - handleSubtabResponse', url);

  // setup as many tabs as in response
  if (!(response_json && response_json.length > 1)) {
    debug('handleSubtabResponse - response json is invalid');
    return;
  }

  const sidebarTabs: Array<ISidebarTab> = [];

  response_json.forEach(function (responseTab: ISidebarResponseArrayObject) {
    if (
      responseTab.url === document.location.href ||
      responseTab.url === document.location.origin ||
      responseTab.url === document.location.origin + '/' ||
      responseTab.url === null
    ) {
      return;
    }
  
    const sidebarTab: ISidebarTab = {
      title: responseTab.title,
      url: new URL(responseTab.url),
      default: !hasInitialSubtabs && responseTab.default,
    };
    sidebarTabs.push(sidebarTab);
  });

  return sidebarTabs;
}

const pinnedTabWithURL = (url: string) => ({
  title: 'Pinned',
  url: new URL(url),
  default: true,
  isPinnedTab: true,
});

const syncPinnedTabs = (storage: chrome.storage.StorageArea, tabs: string[]) => {
  storage.set({[PINNED_TABS_KEY]: tabs});
};

const syncVisitedTabs = (storage: chrome.storage.StorageArea, tabs: Object) => {
  storage.set({[VISITED_TABS_KEY]: tabs});
};

export default class SidebarTabsManager {
  currentPinnedTabs: string[];
  visitedTabs: Object;
  storage: chrome.storage.StorageArea;

  constructor() {
    this.storage = chrome.storage.sync;
    this.storage.get([PINNED_TABS_KEY, VISITED_TABS_KEY], (result) => {
      const pinnedTabs = result[PINNED_TABS_KEY] ?? [];
      this.currentPinnedTabs = Array.isArray(pinnedTabs) ? pinnedTabs : [pinnedTabs];
      this.visitedTabs = result[VISITED_TABS_KEY] ?? {};
    })
  }

  async fetchSubtabs(user: any, url: URL, hasInitialSubtabs: boolean) {
    const networkIDs = user?.memberships?.items?.map((userMembership) => userMembership.network.id) ?? [];
    const response_json = await postAPI('subtabs', { url: url.href }, { networks: networkIDs, client: 'desktop' });
    return handleSubtabResponse(url, document, response_json, hasInitialSubtabs);
  }

  loginSubtabs(url: URL) {
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
      }
    ];
  
    return handleSubtabResponse(url, document, tabs, false)
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
      return this.currentPinnedTabs.map(url => pinnedTabWithURL(url));
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
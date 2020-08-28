import {
  ISidebarTab,
  ISidebarResponseArrayObject,
  debug,
  LUMOS_APP_BASE_URL,
} from 'lumos-shared-js';
import { postAPI } from './helpers';

const APP_SUBTAB_TITLE = 'Insight';
const PINNED_TABS_KEY = 'pinnedTabs';
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

const syncPinnedTabs = (tabs: string[]) => {
  chrome.storage.sync.set({[PINNED_TABS_KEY]: tabs})
};

export default class SidebarTabsManager {
  currentPinnedTabs: string[];

  constructor() {
    chrome.storage.sync.get([PINNED_TABS_KEY], (result) => {
      const pinnedTabs = result[PINNED_TABS_KEY] ?? [];
      this.currentPinnedTabs = Array.isArray(pinnedTabs) ? pinnedTabs : [pinnedTabs];
    })
  }

  async fetchSubtabs(user: any, url: URL, hasInitialSubtabs: boolean) {
    const networkIDs = user?.memberships?.items?.map((userMembership) => userMembership.network.id);
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
    syncPinnedTabs(this.currentPinnedTabs);
  }

  pinSidebarTab(url: string) {
    if (this.currentPinnedTabs.length >= MAX_PINNED_TABS) {
      return;
    }

    this.currentPinnedTabs.unshift(url);
    syncPinnedTabs(this.currentPinnedTabs);

    if (url) {
      return pinnedTabWithURL(url);
    }
  }

  unpinSidebarTab(index: number) {
    if (this.currentPinnedTabs.length < index) {
      return;
    }

    this.currentPinnedTabs.splice(index, 1);
    syncPinnedTabs(this.currentPinnedTabs);
  }

  getPinnedTabs(): ISidebarTab[] {
    const pinnedTabUrl = this.currentPinnedTabs;
    if (pinnedTabUrl?.length > 0) {
      return this.currentPinnedTabs.map(url => pinnedTabWithURL(url));
    }
    return [];
  }
}
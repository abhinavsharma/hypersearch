import { debug } from 'lumos-shared-js';
import { postAPI } from 'utils/helpers';

const PINNED_TABS_KEY = 'pinnedTabs';
const VISITED_TABS_KEY = 'visitedTabs';
const VISITED_TABS_LIMIT = 1000 * 60 * 60 * 24 * 180;
const MAX_PINNED_TABS = 1;

class SidebarTabsManager {
  currentPinnedTabs: string[];
  visitedTabs: SidebarTab[];
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

  private pinnedTabWithURL(url: string) {
    return {
      title: 'Pinned',
      url: new URL(url),
      default: true,
      isPinnedTab: true,
    };
  }

  private syncPinnedTabs(storage: chrome.storage.StorageArea, tabs: string[]) {
    storage.set({ [PINNED_TABS_KEY]: tabs });
  }

  private syncVisitedTabs(storage: chrome.storage.StorageArea, tabs: SidebarTab[]) {
    storage.set({ [VISITED_TABS_KEY]: tabs });
  }

  public async fetchSubtabs(url: URL) {
    debug('function call - fetchSubtabs', url.href);
    const response_json = await postAPI('subtabs', { url: url.href }, { client: 'desktop' });
    return response_json as SubtabsResponse;
  }

  public updatedPinnedTabUrl(url: string, index: number) {
    this.currentPinnedTabs[index] = url;
    this.syncPinnedTabs(this.storage, this.currentPinnedTabs);
  }

  public pinSidebarTab(url: string) {
    if (this.currentPinnedTabs.length >= MAX_PINNED_TABS) return;
    this.currentPinnedTabs.unshift(url);
    this.syncPinnedTabs(this.storage, this.currentPinnedTabs);
    if (url) return this.pinnedTabWithURL(url);
  }

  public unpinSidebarTab(index: number) {
    if (this.currentPinnedTabs.length < index) return;
    this.currentPinnedTabs.splice(index, 1);
    this.syncPinnedTabs(this.storage, this.currentPinnedTabs);
  }

  public getPinnedTabs(): SidebarTab[] {
    const pinnedTabUrl = this.currentPinnedTabs;
    return pinnedTabUrl?.length > 0
      ? this.currentPinnedTabs.map((url) => this.pinnedTabWithURL(url))
      : [];
  }

  public isTabRecentlyVisited(url: string): boolean {
    const lastVisit = this.visitedTabs[url];
    return !lastVisit ? false : VISITED_TABS_LIMIT - (Date.now() - lastVisit) > 0;
  }

  public tabVisited(url: string) {
    this.visitedTabs[url] = Date.now();
    this.syncVisitedTabs(this.storage, this.visitedTabs);
  }
}

export { SidebarTabsManager };

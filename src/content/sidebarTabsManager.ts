import {
  ISidebarTab,
  ISidebarResponseArrayObject,
  debug,
  LUMOS_APP_BASE_URL,
  ISuggestedAugmentationObject,
  serpDocumentToLinks,
  SPECIAL_URL_JUNK_STRING,
} from 'lumos-shared-js';
import { postAPI } from './helpers';

const APP_SUBTAB_TITLE = 'Insight';
const PINNED_TABS_KEY = 'pinnedTabs';
const VISITED_TABS_KEY = 'visitedTabs';
const VISITED_TABS_LIMIT = 1000 * 60 * 60 * 24 * 180;
const MAX_PINNED_TABS = 1;

const handleSubtabApiResponse = (
  url: URL,
  document: Document,
  response_json: Record<string, Array<ISidebarResponseArrayObject> | Array<ISuggestedAugmentationObject>>,
  hasInitialSubtabs: boolean,
) => {
  if (!(url && document && response_json)) {
    return;
  }
  debug('function call - handleSubtabApiResponse', url, response_json);

  // setup as many tabs as in response
  if (!(response_json && response_json.subtabs)) {
    debug('handleSubtabApiResponse - response json is invalid');
    return;
  }

  const sidebarTabs: Array<ISidebarTab> = [];
  const subtabsResponse = response_json.subtabs as Array<ISidebarResponseArrayObject>;
  const suggestedAugmentationResponse = response_json.suggested_augmentations as Array<ISuggestedAugmentationObject>;


  function removeWww(s : string) : string {
    if (s.startsWith('www.')) { 
        return s.slice(4) 
    }
    return s
  }

  const serpDomains = Array.from(document.querySelectorAll('.g a cite')).map((e) => removeWww(e.textContent.split(' ')[0]))

  var isFirst = true;
  suggestedAugmentationResponse.forEach(function(augmentation: ISuggestedAugmentationObject) {
    if (augmentation.id.startsWith("cse-")) {
      const domainsToLookFor = augmentation.conditions.condition_list.map(e => e.value[0]) as Array<string>;
      console.log(serpDomains)
      if (serpDomains.filter(value => domainsToLookFor.includes(value)).length > 0) {
        if (augmentation.actions.action_list?.[0].key == "search_domains") {
          const domainsToSearch = augmentation.actions.action_list?.[0]?.value as Array<string>
          const query = new URLSearchParams(document.location.search).get('q')
          const appendage: string = '(' + domainsToSearch.map((x) => "site:" + x).join(' OR ') + ')'
          var customSearchUrl = new URL("https://www.google.com/search")
          customSearchUrl.searchParams.append('q', query + ' ' + appendage)
          customSearchUrl.searchParams.append(SPECIAL_URL_JUNK_STRING, SPECIAL_URL_JUNK_STRING)
          sidebarTabs.push({
            title: augmentation.name,
            url: customSearchUrl,
            default: isFirst
          })
          isFirst = false;
        }

        
      }

      // if (augmentation.id === 'cse-frontenddev') {
      //   debugger
      // }
      
    }

    
  })


  // subtabsResponse.forEach(function (responseTab: ISidebarResponseArrayObject) {
  //   if (
  //     responseTab.url === document.location.href ||
  //     responseTab.url === document.location.origin ||
  //     responseTab.url === document.location.origin + '/' ||
  //     responseTab.url === null
  //   ) {
  //     return;
  //   }
  
  //   const sidebarTab: ISidebarTab = {
  //     title: responseTab.title,
  //     url: new URL(responseTab.url),
  //     default: !hasInitialSubtabs && responseTab.default,
  //   };
  //   sidebarTabs.push(sidebarTab);
  // });

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
    debug('function call - fetchSubtabs', user, url, hasInitialSubtabs);
    const networkIDs = user?.memberships?.items?.map((userMembership) => userMembership.network.id) ?? [];
    const response_json = await postAPI('subtabs', { url: url.href }, { networks: networkIDs, client: 'desktop' });
    return handleSubtabApiResponse(url, document, response_json, hasInitialSubtabs);
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
  
    return handleSubtabApiResponse(url, document, {"subtabs": tabs}, false)
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
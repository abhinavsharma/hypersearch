/**
 * @module SidebarLoader
 * @author Matyas Angyal<matyas@laso.ai>
 * @license (C) Insight
 * @version 1.0.0
 */
import React, { ReactElement } from 'react';
import { render } from 'react-dom';
import { debug, SPECIAL_URL_JUNK_STRING } from 'lumos-shared-js';
import { Sidebar } from 'modules/sidebar';
import { extractHostnameFromUrl, postAPI, runFunctionWhenDocumentReady } from 'utils/helpers';
import {
  CUSTOM_SEARCH_ENGINES,
  EXTENSION_SERP_LOADED,
  SEND_LOG_MESSAGE,
  URL_UPDATED_MESSAGE,
} from 'utils/constants';

class SidebarLoader {
  /**
   * The current location URL.
   *
   * @public
   * @property
   * @memberof SidebarLoader
   */
  public url: URL;

  /**
   * The current SERP query.
   *
   * @public
   * @property
   * @memberof SidebarLoader
   */
  public query: string;

  /**
   * True if the current page is a SERP.
   *
   * @public
   * @property
   * @memberof SidebarLoader
   */
  public isSerp: boolean;

  /**
   * The list of current SERP result domains.
   *
   * @public
   * @property
   * @memberof SidebarLoader
   */
  public domains: string[];

  /**
   * The list of result URLs for all tabs, including the main SERP. Record keys
   * are the loaded tab IDs, values are full URLs. Main SERP is stored as `original`.
   *
   * @public
   * @property
   * @memberof SidebarLoader
   */
  public tabDomains: Record<string, string[]>;

  /**
   * The current document object.
   *
   * @public
   * @property
   * @memberof SidebarLoader
   */
  public document: Document;

  /**
   * The list of available sidebar tabs.
   *
   * @public
   * @property
   * @memberof SidebarLoader
   */
  public sidebarTabs: SidebarTab[];

  /**
   * The list of augmentation actions. Stored as a dictionary, where the key is
   * the augmentation ID.
   *
   * @public
   * @property
   * @memberof SidebarLoader
   */
  public domainsToSearch: Record<string, string[]>;

  /**
   * The matching custom search engine object.
   *
   * @public
   * @property
   * @memberof SidebarLoader
   */
  public customSearchEngine: CustomSearchEngine;

  /**
   * The list of locally installed augmentations.
   *
   * @public
   * @property
   * @memberof SidebarLoader
   */
  public installedAugmentations: AugmentationObject[];

  /**
   * The list of matching suggested augmentations from Subtabs API.
   *
   * @public
   * @property
   * @memberof SidebarLoader
   */
  public suggestedAugmentations: AugmentationObject[];

  /**
   * The list of ignored augmentations.
   *
   * @public
   * @property
   * @memberof SidebarLoader
   */
  public ignoredAugmentations: AugmentationObject[];

  /**
   * The list of locally installed but disabled augmentations.
   *
   * @public
   * @property
   * @memberof SidebarLoader
   */
  public matchingDisabledInstalledAugmentations: AugmentationObject[];

  /**
   * The merged stylesheet to inject into the sidebar. Initially this element
   * will be injected in the parent document, then moved to the sidebar and
   * removed from parent document to prevent style pollution.
   *
   * @private
   * @property
   * @memberof SidebarLoader
   */
  private styleEl: HTMLStyleElement;

  constructor() {
    debug('SidebarLoader - initialize\n---\n\tSingleton Instance', this, '\n---');
    this.styleEl = document.getElementsByTagName('style')[0];
    this.tabDomains = Object.create(null);
    this.sidebarTabs = [];
    this.domainsToSearch = Object.create(null);
    this.customSearchEngine = Object.create(null);
    this.installedAugmentations = [];
    this.suggestedAugmentations = [];
    this.ignoredAugmentations = [];
    this.matchingDisabledInstalledAugmentations = [];
  }

  /**
   * Get domain names from the list of SERP results in the passed document.
   * Values extracted using the matching custom search engine selector.
   *
   * @param document - The document object
   * @param platform - Select platform specific selector
   * @param full - Toggle to get the full URL instead domain name
   * @public
   * @method
   * @memberof SidebarLoader
   */
  public getDomains(document: Document, platform = 'desktop', full?: boolean) {
    const els = Array.from(
      document.querySelectorAll(this.customSearchEngine?.querySelector?.[platform]),
    );
    return full
      ? els.map((i) => i.getAttribute('href'))
      : els.map((e) => extractHostnameFromUrl(e.textContent.split(' ')[0]).hostname);
  }

  /**
   * Generate sidebar tabs and suggested augmentations from a provided list of augmentations.
   * When called without arguments, it is using the current installed and suggested values.
   * The method also creates a list of disabled but installed augmentations.
   *
   * @param augmentations -The list of augmentations
   * @public
   * @method
   * @memberof SidebarLoader
   */
  public getTabsAndAugmentations(
    augmentations: AugmentationObject[] = this.suggestedAugmentations.concat(
      this.installedAugmentations,
    ),
  ) {
    debug('getTabsAndAugmentations - call');
    this.sidebarTabs = [];
    const newTabs: SidebarTab[] = [];
    augmentations.forEach((augmentation: AugmentationObject) => {
      if (
        this.customSearchEngine &&
        augmentation.id.startsWith('cse-') &&
        !this.ignoredAugmentations.find((i) => i.id === augmentation.id)
      ) {
        const domainsToLookFor = augmentation.conditions?.condition_list.map((e) => e.value[0]);
        const matchingDomains = this.domains.filter((value) => domainsToLookFor?.includes(value));
        if (matchingDomains.length > 0) {
          if (augmentation.actions.action_list?.[0].key == 'search_domains') {
            /*  const isSafari = () => {
              const hasVersion = /Version\/(\d{2})/;
              const hasSafari = /Safari\/(\d{3})/;
              const hasChrome = /Chrome\/(\d{3})/;
              const ua = window.navigator.userAgent;
              return (
                ua.match(hasVersion) !== null &&
                ua.match(hasSafari) !== null &&
                ua.match(hasChrome) === null
              );
            }; */
            this.domainsToSearch[augmentation.id] = augmentation.actions.action_list?.[0]?.value;
            const customSearchUrl = new URL('https://duckduckgo.com/');
            /* const customSearchUrl = new URL(
              isSafari()
                ? 'https://www.ecosia.org/search'
                : `https://${this.customSearchEngine.search_engine_json.required_prefix}`,
            ); */
            this.query = new URLSearchParams(this.document.location.search).get('q');
            const append = `(${this.domainsToSearch[augmentation.id]
              .map((x) => `site:${x}`)
              .join(' OR ')})`;
            customSearchUrl.searchParams.append('q', this.query + ' ' + append);
            customSearchUrl.searchParams.append(SPECIAL_URL_JUNK_STRING, SPECIAL_URL_JUNK_STRING);
            if (
              !this.suggestedAugmentations.find((i) => i.id === augmentation.id) &&
              !augmentation.id.startsWith('cse-custom')
            ) {
              this.suggestedAugmentations.push(augmentation);
            }
            (augmentation.enabled || !augmentation.hasOwnProperty('enabled')) &&
              newTabs.unshift({
                matchingDomains,
                id: augmentation.id,
                title: augmentation.name,
                url: customSearchUrl,
                default: !newTabs.length,
                isSuggested: !augmentation.hasOwnProperty('enabled'),
                isCse: true,
              });
            augmentation.hasOwnProperty('enabled') &&
              !augmentation.enabled &&
              this.matchingDisabledInstalledAugmentations.push(augmentation);
          }
        }
      }
    });

    const compareTabs = (a: SidebarTab, b: SidebarTab) => {
      const tabRatings = Object.create(null);
      const aLowest = { name: '', rate: Infinity, domains: a.matchingDomains };
      const bLowest = { name: '', rate: Infinity, domains: b.matchingDomains };
      Array.from(new Set(this.domains)).forEach((i, index) => (tabRatings[i] = index));
      const compareDomainList = (domainsA, domainsB) => {
        domainsA.forEach((i) => {
          if (tabRatings[i] < aLowest.rate) {
            aLowest.name = i;
            aLowest.rate = tabRatings[i];
          }
        });
        domainsB.forEach((i) => {
          if (tabRatings[i] < bLowest.rate) {
            bLowest.name = i;
            bLowest.rate = tabRatings[i];
          }
        });
      };
      compareDomainList(aLowest.domains, bLowest.domains);
      if (aLowest.rate === bLowest.rate) {
        compareDomainList(
          aLowest.domains.filter((i) => i !== aLowest.name),
          bLowest.domains.filter((i) => i !== bLowest.name),
        );
      }
      return aLowest.rate > bLowest.rate ? 1 : -1;
    };

    this.sidebarTabs = newTabs.sort((a, b) => {
      if (a.isSuggested && !b.isSuggested) return 1;
      if (!a.isSuggested && b.isSuggested) return -1;
      return compareTabs(a, b);
    });

    this.isSerp = !!(
      this.customSearchEngine?.search_engine_json?.required_prefix +
      this.customSearchEngine?.search_engine_json?.required_params
    );

    debug(
      'getTabsAndAugmentations - processed',
      '\n---\n\tSidebar Tabs ',
      this.sidebarTabs,
      '\n\tSuggested Augmentations',
      this.suggestedAugmentations,
      '\n\tIs SERP',
      this.isSerp,
      '\n---',
    );
  }

  /**
   * Initialize augmentations and create the sidebar when necessary. The method
   * will fetch the Subtabs API for matching augmentations according to the URL.
   *
   * @param document - The document object
   * @param url - The current location
   * @public
   * @method
   * @memberof SidebarLoader
   */
  public async loadOrUpdateSidebar(document: Document, url: URL | null) {
    debug('loadOrUpdateSidebar - call\n');
    await this.getLocalAugmentations();
    this.document = document;
    this.url = url;
    const firstChild = this.document.documentElement.firstChild;
    if (this.styleEl === firstChild) this.document.documentElement.removeChild(this.styleEl);
    this.fetchSubtabs().then((response) => {
      if (!response) return;
      runFunctionWhenDocumentReady(this.document, async () => {
        await this.handleSubtabApiResponse(response);
        this.isSerp &&
          chrome.runtime.sendMessage({
            type: SEND_LOG_MESSAGE,
            event: EXTENSION_SERP_LOADED,
            properties: {
              query: this.query,
              url: this.url,
            },
          });
        if (
          this.isSerp ||
          this.sidebarTabs.length ||
          this.matchingDisabledInstalledAugmentations.length
        ) {
          await this.createSidebar();
        }
      });
    });
  }

  /**
   * Inject and initialize a React Element into the HTML Element. This process
   * will create an IFrame to separate the context form the parent document.
   *
   * @param el - The HTML Element
   * @param reactEl - The React Element
   * @param frameId - The ID of the injected IFrame
   * @public
   * @method
   * @memberof SidebarLoader
   */
  public reactInjector(el: HTMLElement, reactEl: ReactElement, frameId: string) {
    debug('reactInjector - call');
    const iframe = document.createElement('iframe');
    iframe.id = frameId;
    el.appendChild(iframe);
    const injector = () => {
      const doc = iframe.contentWindow.document;
      // Webpack merges all SCSS files into a single <style> element. We initialize
      // the IFrame document object with this merged stylesheet.
      doc.getElementsByTagName('head')[0].appendChild(this.styleEl);
      doc.getElementsByTagName('html')[0].setAttribute('style', 'overflow: hidden;');
      const div = document.createElement('div');
      const root = doc.body.appendChild(div);
      render(reactEl, root);
      debug('reactInjector - processed\n---\n\tInjected Element', root, '\n---');
    };
    // Firefox is a special case, we need to set IFrame source to make it work.
    // Here we add an empty HTML file as source, so the browser won't complain.
    if (navigator.userAgent.search('Firefox') > -1) {
      iframe.src = chrome.runtime.getURL('index.html');
      iframe.onload = () => injector();
    } else {
      injector();
    }
  }

  /**
   * Check the local storage for a stored custom search engine object. If it is not found,
   * the method will fetch avaliable CSEs from remote host and store the matching value.
   *
   * @private
   * @method
   * @memberof SidebarLoader
   */
  private async getCustomSearchEngine() {
    debug('getCustomSearchEngine - call\n');
    let storedValue: Record<string, CustomSearchEngine>;
    const { hostname, params } = extractHostnameFromUrl(this.url.href);
    if (!hostname) return null;
    const storageKey = hostname.replace(/\./g, '_');
    storedValue = await new Promise((resolve) => chrome.storage.sync.get(storageKey, resolve));
    if (!storedValue?.[storageKey]) {
      debug('getCustomSearchEngine - fetch from remote\n');
      const result: CustomSearchEngine = Object.create({});
      const customSearchEngines = await fetch(CUSTOM_SEARCH_ENGINES);
      const results: Record<string, CustomSearchEngine> = await customSearchEngines.json();
      Object.values(results).forEach((customSearchEngine) => {
        const hasAllMatchinParams = !customSearchEngine.search_engine_json.required_params.filter(
          (i) => !params.includes(i),
        ).length;
        const hasRequiredPrefix = !!this.url.href.match(
          customSearchEngine.search_engine_json.required_prefix,
        )?.length;
        if (hasAllMatchinParams && hasRequiredPrefix)
          Object.assign(result, { ...customSearchEngine });
      });
      chrome.storage.sync.set({ [storageKey]: result });
      storedValue = { [storageKey]: result };
    }
    this.customSearchEngine = storedValue[storageKey] ?? Object.create(null);
    debug(
      'getCustomSearchEngine - processed\n---\n\tCustom Search Engine JSON',
      this.customSearchEngine,
      '\n---',
    );
  }

  /**
   * Get installed and ignored augmentations from the local storage.
   *
   * @private
   * @method
   * @memberof SidebarLoader
   */
  private async getLocalAugmentations() {
    const locals = await new Promise((resolve) => chrome.storage.local.get(resolve));
    this.ignoredAugmentations =
      Object.entries(locals).reduce((a, [key, value]) => {
        key.startsWith('ignored-') && a.push(value);
        return a;
      }, []) ?? [];
    this.installedAugmentations =
      Object.entries(locals).reduce((a, [key, value]) => {
        !key.startsWith('ignored-') && a.push(value);
        return a;
      }, []) ?? [];
    debug(
      'getLocalAugmentations - call\n---\n\tInstalled Augmentations',
      this.installedAugmentations,
      '\n\tIgnored Augmentations',
      this.ignoredAugmentations,
      '\n---',
    );
  }

  /**
   * Process the results from Subtabs API, by filtering out the matching
   * augmentations then append sidebar tabs with matching subtabs. Subtabs
   * could be custom augmentations or readable contents.
   *
   * @param response - The Subtabs API response object
   * @private
   * @method
   * @memberof SidebarLoader
   */
  private async handleSubtabApiResponse(response: SubtabsResponse) {
    debug('handleSubtabApiResponse - call');
    if (!(this.url && response)) return null;
    await this.getCustomSearchEngine();
    this.domains = this.getDomains(document);
    this.tabDomains['original'] = this.getDomains(
      document,
      !!window.location.href.match(/google\.com/g)?.length ? 'pad' : 'desktop',
      true,
    );
    this.getTabsAndAugmentations([
      ...response.suggested_augmentations,
      ...this.installedAugmentations,
    ]);
    const subtabs: SidebarTab[] = response.subtabs
      .slice(1, response.subtabs.length)
      .map((subtab, i, a) => ({
        id: subtab.title,
        title: subtab.title ?? 'Readable Content',
        url: subtab.url && new URL(subtab.url),
        readable: subtab.readable_content,
        default: !this.sidebarTabs.length && i === 0 && !a[i + 1],
        isCse: false,
      }));
    this.sidebarTabs = [...this.sidebarTabs, ...subtabs];
    debug('handleSubtabApiResponse - processed', '\n---\n\tMatched Subtabs', subtabs, '\n---');
  }

  /**
   * Fetch the Subtabs API according to the current location.
   *
   * @returns - The result from Subtabs API
   * @private
   * @method
   * @memberof SidebarLoader
   */
  private async fetchSubtabs() {
    debug('fetchSubtabs - call\n');
    const response = await postAPI('subtabs', { url: this.url.href }, { client: 'desktop' });
    debug('fetchSubtabs - success\n---\n\tSubtabs Response', response, '\n---');
    return response as SubtabsResponse;
  }

  /**
   * Creates the sidebar layout and inject global stylesheet. Also this method
   * will add a listener to reload whenever the location URL changes.
   *
   * @private
   * @method
   * @memberof SidebarLoader
   */
  private async createSidebar() {
    debug('createSidebar - call\n');
    const link = this.document.createElement('link');
    link.rel = 'stylesheet';
    link.href = chrome.extension.getURL('./index.css');
    link.type = 'text/css';
    this.document.head.appendChild(link);
    const wrapper = this.document.createElement('div');
    wrapper.id = 'sidebar-root';
    wrapper.style.display = 'none';
    this.document.body.appendChild(wrapper);
    const nonCseTabs = this.sidebarTabs.filter((tab) => !tab.isCse);
    this.sidebarTabs.concat(nonCseTabs);
    debug('createSidebar - processed\n---\n\tNon CSE Tabs', nonCseTabs, '\n---');
    const sidebarInit = React.createElement(Sidebar);
    this.reactInjector(wrapper, sidebarInit, 'sidebar-root-iframe');
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.type === URL_UPDATED_MESSAGE) {
        this.loadOrUpdateSidebar(document, new URL(msg.url));
      }
    });
  }
}

/**
 * Static instance of the sidebar manager.
 */
const instance = new SidebarLoader();

export default instance;

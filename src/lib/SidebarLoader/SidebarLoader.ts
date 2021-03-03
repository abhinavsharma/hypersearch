import React, { ReactElement } from 'react';
import { debug, SPECIAL_URL_JUNK_STRING } from 'lumos-shared-js';
import { extractHostnameFromUrl, postAPI, runFunctionWhenDocumentReady } from 'utils/helpers';
import { CUSTOM_SEARCH_ENGINES, URL_UPDATED_MESSAGE } from 'utils/constants';
import { Sidebar } from 'modules/sidebar';
import { render } from 'react-dom';

class SidebarLoader {
  public url: URL;
  public isSerp: boolean;
  public document: Document;
  public sidebarTabs: SidebarTab[];
  public installedAugmentations: AugmentationObject[];
  public suggestedAugmentations: AugmentationObject[];
  private domains: string[];
  private styleEl: HTMLStyleElement;
  private customSearchEngine: CustomSearchEngine;

  constructor() {
    debug('initialize singleton - SidebarLoader', this);
    this.styleEl = document.getElementsByTagName('style')[0];
    this.sidebarTabs = [];
    this.customSearchEngine = Object.create(null);
    this.installedAugmentations = [];
    this.suggestedAugmentations = [];
  }

  public setInstalledAugmentations(newAugmentations: AugmentationObject[]) {
    debug('function call - setInstalledAugmentations', newAugmentations);
    this.installedAugmentations = newAugmentations;
  }

  private async getCustomSearchEngine() {
    debug('function call - getCustomSearchEngine', this.url);
    let storedValue: Record<string, CustomSearchEngine>;
    const { hostname, params } = extractHostnameFromUrl(this.url.href);
    if (!hostname) return null;
    const storageKey = hostname.replace(/\./g, '_');
    storedValue = await new Promise((resolve) => chrome.storage.sync.get(storageKey, resolve));
    if (!storedValue?.[storageKey]) {
      debug('getCustomSearchEngine - Value not found in local storage, fetching from remote');
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
    debug('getCustomSearchEngine - processed', this.customSearchEngine);
  }

  public getTabsAndAugmentations(
    augmentations: AugmentationObject[] = this.installedAugmentations,
  ) {
    debug('function call - getTabsAndAugmentations - augmentation objects', augmentations);
    this.sidebarTabs = [];
    augmentations.forEach((augmentation: AugmentationObject) => {
      if (this.customSearchEngine && augmentation.id.startsWith('cse-')) {
        const domainsToLookFor = augmentation.conditions?.condition_list.map((e) => e.value[0]);
        if (this.domains.filter((value) => domainsToLookFor?.includes(value)).length > 0) {
          if (augmentation.actions.action_list?.[0].key == 'search_domains') {
            const domainsToSearch = augmentation.actions.action_list?.[0]?.value;
            const customSearchUrl = new URL(
              `https://${this.customSearchEngine.search_engine_json.required_prefix}`,
            );
            const query = new URLSearchParams(this.document.location.search).get('q');
            const appendage =
              '(' +
              (Array.isArray(domainsToSearch) ? domainsToSearch : domainsToSearch.split(','))
                .map((x) => 'site:' + x)
                .join(' OR ') +
              ')';
            customSearchUrl.searchParams.append('q', query + ' ' + appendage);
            customSearchUrl.searchParams.append(SPECIAL_URL_JUNK_STRING, SPECIAL_URL_JUNK_STRING);
            if (!this.suggestedAugmentations.find((i) => i.id === augmentation.id))
              this.suggestedAugmentations.push(augmentation);
            augmentation.enabled &&
              this.sidebarTabs.push({
                id: augmentation.id,
                title: augmentation.name,
                url: customSearchUrl,
                default: !this.sidebarTabs.length,
                isCse: true,
              });
          }
        }
      }
    });
    const isSerp = !!(
      this.customSearchEngine?.search_engine_json?.required_prefix +
      this.customSearchEngine?.search_engine_json?.required_params
    );
    debug(
      'getTabsAndAugmentations - processed',
      this.sidebarTabs,
      this.installedAugmentations,
      this.suggestedAugmentations,
      isSerp,
    );
  }

  private async getLocalAugmentations() {
    const locals = await new Promise((resolve) => chrome.storage.local.get(resolve));
    this.installedAugmentations = Object.values(locals) ?? [];
  }

  private async handleSubtabApiResponse(response: SubtabsResponse) {
    debug('function call - handleSubtabApiResponse', response);
    if (!(this.url && response)) return null;
    await this.getCustomSearchEngine();
    this.domains = Array.from(
      document.querySelectorAll(this.customSearchEngine?.querySelector?.desktop),
    )?.map((e) => extractHostnameFromUrl(e.textContent.split(' ')[0]).hostname);
    await this.getLocalAugmentations();
    this.getTabsAndAugmentations([
      ...response.suggested_augmentations.filter(
        (suggested) => !this.installedAugmentations.find((i) => suggested.id === i.id),
      ),
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
    debug(
      'handleSubtabApiResponse - matched results',
      this.sidebarTabs,
      this.suggestedAugmentations,
      subtabs,
    );
  }

  private reactInjector(
    el: HTMLElement,
    reactEl: ReactElement,
    frameId: string,
    styleEl?: HTMLStyleElement,
  ) {
    // Create an isolated iframe, preventing all external style modifications.
    const iframe = document.createElement('iframe');
    iframe.id = frameId;
    el.appendChild(iframe);
    const injector = () => {
      // This is the actual document element of the iframe, we can manipulate its content
      // by using the `contentWindow.document` property.
      const doc = iframe.contentWindow.document;
      // Append the style tag to the iframe's head, so styles will be applied.
      doc.getElementsByTagName('head')[0].appendChild(styleEl);
      // Render the react app into the body element.
      doc.getElementsByTagName('html')[0].setAttribute('style', 'overflow: hidden;');
      const div = document.createElement('div');
      const root = doc.body.appendChild(div);
      render(reactEl, root);
    };
    if (navigator.userAgent.search('Firefox') > -1) {
      iframe.src = chrome.runtime.getURL('index.html');
      iframe.onload = () => injector();
    } else {
      injector();
    }
  }

  private async fetchSubtabs() {
    debug('function call - fetchSubtabs', this.url.href);
    const response_json = await postAPI('subtabs', { url: this.url.href }, { client: 'desktop' });
    return response_json as SubtabsResponse;
  }

  private async createSidebar() {
    debug('function call - createSidebar', this.document);
    this.loadSidebarCss();
    const wrapper = this.document.createElement('div');
    wrapper.id = 'sidebar-root';
    wrapper.style.display = 'none';
    this.document.body.appendChild(wrapper);
    await this.getLocalAugmentations();
    const nonCseTabs = this.sidebarTabs.filter((tab) => !tab.isCse);
    this.getTabsAndAugmentations(this.installedAugmentations.filter((i) => i.enabled));
    this.sidebarTabs.concat(nonCseTabs);
    debug('createSidebar - tabs', this.sidebarTabs);
    const sidebarInit = React.createElement(Sidebar);
    this.reactInjector(wrapper, sidebarInit, 'sidebar-root-iframe', this.styleEl);
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.type === URL_UPDATED_MESSAGE) {
        this.loadOrUpdateSidebar(document, new URL(msg.url));
      }
    });
  }

  public async loadOrUpdateSidebar(document: Document, url: URL | null) {
    debug('function call - loadOrUpdateSidebar', document);
    this.document = document;
    this.url = url;
    const firstChild = this.document.documentElement.firstChild;
    if (this.styleEl === firstChild) this.document.documentElement.removeChild(this.styleEl);
    this.fetchSubtabs().then((response) => {
      if (!response) return;
      runFunctionWhenDocumentReady(this.document, async () => {
        await this.handleSubtabApiResponse(response);
        if (!!this.sidebarTabs.length || !!this.suggestedAugmentations.length || this.isSerp) {
          await this.createSidebar();
        }
      });
    });
  }

  private loadSidebarCss() {
    const link = this.document.createElement('link');
    link.rel = 'stylesheet';
    link.href = chrome.extension.getURL('./index.css');
    link.type = 'text/css';
    this.document.head.appendChild(link);
  }
}

const instance = new SidebarLoader();

export default instance;

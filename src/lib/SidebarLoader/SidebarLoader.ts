/**
 * @module SidebarLoader
 * @author Matyas Angyal<matyas@laso.ai>
 * @license (C) Insight
 * @version 1.0.0
 */
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
  public ignoredAugmentations: AugmentationObject[];
  public matchingDisabledInstalledAugmentations: AugmentationObject[];
  private domains: string[];
  private styleEl: HTMLStyleElement;
  private customSearchEngine: CustomSearchEngine;

  constructor() {
    debug('SidebarLoader - initialize\n---\n\tSingleton Instance', this, '\n---');
    this.styleEl = document.getElementsByTagName('style')[0];
    this.sidebarTabs = [];
    this.customSearchEngine = Object.create(null);
    this.installedAugmentations = [];
    this.suggestedAugmentations = [];
    this.ignoredAugmentations = [];
    this.matchingDisabledInstalledAugmentations = [];
  }

  public getTabsAndAugmentations(
    augmentations: AugmentationObject[] = this.suggestedAugmentations.concat(
      this.installedAugmentations,
    ),
  ) {
    debug('getTabsAndAugmentations - call');
    this.sidebarTabs = [];
    augmentations
      .sort((a, b) => (a.hasOwnProperty('enabled') && b.hasOwnProperty('enabled') ? 1 : -1))
      .forEach((augmentation: AugmentationObject) => {
        if (
          this.customSearchEngine &&
          augmentation.id.startsWith('cse-') &&
          !this.ignoredAugmentations.find((i) => i.id === augmentation.id)
        ) {
          const domainsToLookFor = augmentation.conditions?.condition_list.map((e) => e.value[0]);
          if (this.domains.filter((value) => domainsToLookFor?.includes(value)).length > 0) {
            if (augmentation.actions.action_list?.[0].key == 'search_domains') {
              const isSafari = () => {
                const hasVersion = /Version\/(\d{2})/;
                const hasSafari = /Safari\/(\d{3})/;
                const hasChrome = /Chrome\/(\d{3})/;
                const ua = window.navigator.userAgent;
                return (
                  ua.match(hasVersion) !== null &&
                  ua.match(hasSafari) !== null &&
                  ua.match(hasChrome) === null
                );
              };
              const actions = augmentation.actions.action_list?.[0]?.value;
              const customSearchUrl = new URL(
                isSafari()
                  ? 'https://www.ecosia.org/search'
                  : `https://${this.customSearchEngine.search_engine_json.required_prefix}`,
              );
              const query = new URLSearchParams(this.document.location.search).get('q');
              const append = `(${actions.map((x) => `site:${x}`).join(' OR ')})`;
              customSearchUrl.searchParams.append('q', query + ' ' + append);
              customSearchUrl.searchParams.append(SPECIAL_URL_JUNK_STRING, SPECIAL_URL_JUNK_STRING);
              if (
                !this.suggestedAugmentations.find((i) => i.id === augmentation.id) &&
                !augmentation.id.startsWith('cse-custom')
              ) {
                this.suggestedAugmentations.push(augmentation);
              }
              (augmentation.enabled || !augmentation.hasOwnProperty('enabled')) &&
                this.sidebarTabs.push({
                  id: augmentation.id,
                  title: augmentation.name,
                  url: customSearchUrl,
                  default: !this.sidebarTabs.length,
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
    const isSerp = !!(
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
      isSerp,
      '\n---',
    );
  }

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

  private reactInjector(
    el: HTMLElement,
    reactEl: ReactElement,
    frameId: string,
    styleEl?: HTMLStyleElement,
  ) {
    debug('reactInjector - call');
    const iframe = document.createElement('iframe');
    iframe.id = frameId;
    el.appendChild(iframe);
    const injector = () => {
      const doc = iframe.contentWindow.document;
      doc.getElementsByTagName('head')[0].appendChild(styleEl);
      doc.getElementsByTagName('html')[0].setAttribute('style', 'overflow: hidden;');
      const div = document.createElement('div');
      const root = doc.body.appendChild(div);
      render(reactEl, root);
      debug('reactInjector - processed\n---\n\tInjected Element', root, '\n---');
    };
    if (navigator.userAgent.search('Firefox') > -1) {
      iframe.src = chrome.runtime.getURL('index.html');
      iframe.onload = () => injector();
    } else {
      injector();
    }
  }

  private loadSidebarCss() {
    const link = this.document.createElement('link');
    link.rel = 'stylesheet';
    link.href = chrome.extension.getURL('./index.css');
    link.type = 'text/css';
    this.document.head.appendChild(link);
  }

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

  private async handleSubtabApiResponse(response: SubtabsResponse) {
    debug('handleSubtabApiResponse - call');
    if (!(this.url && response)) return null;
    await this.getCustomSearchEngine();
    this.domains = Array.from(
      document.querySelectorAll(this.customSearchEngine?.querySelector?.desktop),
    )?.map((e) => extractHostnameFromUrl(e.textContent.split(' ')[0]).hostname);
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

  private async fetchSubtabs() {
    debug('fetchSubtabs - call\n');
    const response = await postAPI('subtabs', { url: this.url.href }, { client: 'desktop' });
    debug('fetchSubtabs - success\n---\n\tSubtabs Response', response, '\n---');
    return response as SubtabsResponse;
  }

  private async createSidebar() {
    debug('createSidebar - call\n');
    this.loadSidebarCss();
    const wrapper = this.document.createElement('div');
    wrapper.id = 'sidebar-root';
    wrapper.style.display = 'none';
    this.document.body.appendChild(wrapper);
    const nonCseTabs = this.sidebarTabs.filter((tab) => !tab.isCse);
    this.sidebarTabs.concat(nonCseTabs);
    debug('createSidebar - processed\n---\n\tNon CSE Tabs', nonCseTabs, '\n---');
    const sidebarInit = React.createElement(Sidebar);
    this.reactInjector(wrapper, sidebarInit, 'sidebar-root-iframe', this.styleEl);
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.type === URL_UPDATED_MESSAGE) {
        this.loadOrUpdateSidebar(document, new URL(msg.url));
      }
    });
  }
}

const instance = new SidebarLoader();

export default instance;

/**
 * @module SidebarLoader
 * @author Matyas Angyal<matyas@laso.ai>
 * @license (C) Insight
 * @version 1.0.0
 */
import React, { ReactElement } from 'react';
import { render } from 'react-dom';
import { SPECIAL_URL_JUNK_STRING } from 'lumos-shared-js';
import { Sidebar } from 'modules/sidebar';
import {
  extractUrlProperties,
  postAPI,
  runFunctionWhenDocumentReady,
  debug,
  removeProtocol,
  isSafari,
  compareTabs,
  CUSTOM_SEARCH_ENGINES,
  ENABLED_AUGMENTATION_TYPES,
  EXTENSION_SERP_LOADED,
  NUM_DOMAINS_TO_CONSIDER,
  NUM_DOMAINS_TO_EXCLUDE,
  SEND_LOG_MESSAGE,
  URL_UPDATED_MESSAGE,
  IN_DEBUG_MODE,
  DUMMY_SUBTABS_URL,
  SUBTABS_CACHE_EXPIRE_MIN,
  BANNED_DOMAINS,
  SEARCH_DOMAINS_ACTION,
  SEARCH_QUERY_CONTAINS_CONDITION,
} from 'utils';

/**
 * ! In order of priority
 * TODO: Lower complexity of getTabsAndAugmentations method
 * TODO: Decouple custom search engine handler
 * TODO: Decouple Subtabs functionality
 */

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
   * The list of augmentations which not matching to the current url by condition
   *
   * @public
   * @property
   * @memberof SidebarLoader
   */
  public otherAugmentations: AugmentationObject[];

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

  /**
   * When user enables strong privacy mode, logging are disabled and subtabs response
   * is cached for a specified time (not firing on all query). Also in the Insight case
   * subtabs does not work  outside of search result pages.
   */
  public strongPrivacy: boolean;

  constructor() {
    debug('SidebarLoader - initialize\n---\n\tSingleton Instance', this, '\n---');
    this.styleEl = window.top.document.documentElement.getElementsByTagName('style')[0];
    this.tabDomains = Object.create(null);
    this.sidebarTabs = [];
    this.domainsToSearch = Object.create(null);
    this.customSearchEngine = Object.create(null);
    this.installedAugmentations = [];
    this.suggestedAugmentations = [];
    this.otherAugmentations = [];
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
  public getDomains(document: Document) {
    let els = [];
    const isGoogle = location.href.search(/google\.com/gi) > -1;
    // !dev const isDdg = location.href.search(/duckduckgo\.com/gi) > -1;
    const isBing = location.href.search(/bing\.com/gi) > -1;
    this.customSearchEngine?.querySelector?.featured?.forEach(
      (c) => (els = els.concat(Array.from(document.querySelectorAll(c)))),
    );
    els = els.concat(
      Array.from(
        document.querySelectorAll(
          this.customSearchEngine?.querySelector?.[isGoogle ? 'pad' : 'desktop'],
        ),
      ),
    );
    return els
      .map((i) => extractUrlProperties(isBing ? i.textContent : i.getAttribute('href')).full)
      .filter((domain) => !BANNED_DOMAINS.includes(domain))
      .slice(0, NUM_DOMAINS_TO_CONSIDER);
  }

  /**
   * Takes an augmentation and generates meta data from its actions. Meta data
   * is a list of URL-Title pairs for each tab to open.
   *
   * @param augmentation
   * @returns The list of meta objects for the current augmentation
   * @private
   * @method
   * @memberof SidebarLoader
   */
  private getTabUrls(augmentation: AugmentationObject) {
    const customSearchUrl = new URL(
      isSafari()
        ? 'https://www.ecosia.org/search'
        : `https://${this.customSearchEngine.search_engine_json.required_prefix}`,
    );
    const urls: URL[] = [];

    const createSingleDomainUrl = (actionValue: string[]) => {
      actionValue.forEach((val) => {
        const url = new URL(`https://${removeProtocol(val).replace('%s', this.query)}`);
        url.searchParams.append(SPECIAL_URL_JUNK_STRING, SPECIAL_URL_JUNK_STRING);
        urls.push(url);
      });
    };

    const createMultipleDomainUrl = (actionValue: string[]) => {
      const tabAppendages = actionValue;
      this.tabDomains[augmentation.id] = this.tabDomains[augmentation.id].concat(
        actionValue.map((value) => removeProtocol(value)),
      );
      const append =
        tabAppendages.length === 1
          ? `site:${tabAppendages[0]}`
          : `(${tabAppendages.map((x) => `site:${x}`).join(' OR ')})`;
      customSearchUrl.searchParams.append(
        'q',
        `${this.query} ${!!actionValue.length ? append : ''}`,
      );
      customSearchUrl.searchParams.append(SPECIAL_URL_JUNK_STRING, SPECIAL_URL_JUNK_STRING);
    };

    // An augmentation can have multiple actions, despite their type. We
    // assume this case and process the whole `action_list`. In the prev
    // versions, we only checked the first value, when key was `open_url`.
    // ! Note: Multiple values in `open_url` is currently not allowed!
    augmentation.actions.action_list.forEach((action) => {
      switch (action.key) {
        case 'hide_domain':
          createMultipleDomainUrl(
            augmentation.actions.action_list.find(({ key }) => key === 'search_domains')?.value ??
              [],
          );
          break;
        case 'open_url':
          createSingleDomainUrl(action.value);
          break;
        case 'search_domains':
          if (!augmentation.actions.action_list.find(({ key }) => key === 'hide_domain')) {
            createMultipleDomainUrl(action.value);
          }
          break;
        default:
          debug(`\n---\n\tIncompatible action in ${augmentation.name}`, action, '\n---');
      }
    });

    !!customSearchUrl.searchParams.get('q') &&
      !!customSearchUrl.searchParams.get('q').length &&
      urls.push(customSearchUrl);
    return urls;
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
    augmentations: AugmentationObject[] = [
      ...this.installedAugmentations,
      ...this.suggestedAugmentations,
    ],
  ) {
    debug(
      'getTabsAndAugmentations - call\n---\n\tDomains on the current page (in preserved order)\n',
      ...this.domains.map((domain, index) => `\n\t${index + 1}.) ${domain}\n`),
      '\n---',
    );
    this.sidebarTabs = [];
    const newTabs: SidebarTab[] = [];
    const logirrelevant: any[] = [];
    const logProcessed: any[] = [];
    const logSuggested: any[] = [];
    const logTabs: any[] = [];
    augmentations.forEach((augmentation: AugmentationObject) => {
      if (
        this.customSearchEngine &&
        augmentation.id.startsWith('cse-') &&
        !this.ignoredAugmentations.find((i) => i.id === augmentation.id)
      ) {
        let isRelevant = false;
        const domainsToLookCondition = augmentation.conditions?.condition_list.map(
          (e) => e.value[0],
        );
        const domainsToLookAction = augmentation.actions?.action_list?.find(
          (action) => action.key === SEARCH_DOMAINS_ACTION,
        )?.value;
        const matchingDomainsCondition = this.domains.filter((value) =>
          domainsToLookCondition?.find((i) => value.search(new RegExp(`^${i}`, 'gi')) > -1),
        );
        const matchingDomainsAction = this.domains.filter((value) =>
          domainsToLookAction?.find((i) => value.search(new RegExp(`^${i}`, 'gi')) > -1),
        );
        const checkForQuery =
          augmentation.conditions.condition_list.find(
            ({ key }) => key === SEARCH_QUERY_CONTAINS_CONDITION,
          )?.value[0] ?? null;
        const matchingQueryCondition = checkForQuery && this.query.search(checkForQuery) > -1;
        IN_DEBUG_MODE &&
          logProcessed.push(
            '\n\t',
            {
              [augmentation.id]: {
                'Domains to look for': domainsToLookAction,
                'Matching domains to condition': matchingDomainsCondition,
                'Matching domains to action': matchingDomainsAction,
                ...augmentation,
              },
            },
            '\n',
          );

        if (
          matchingDomainsCondition.length > 0 &&
          augmentation.conditions.condition_list
            .map((condition) => ENABLED_AUGMENTATION_TYPES.includes(condition.key))
            .indexOf(false) === -1
        ) {
          this.tabDomains[augmentation.id] = [];
          this.domainsToSearch[augmentation.id] = augmentation.actions.action_list?.[0]?.value;
          this.query = new URLSearchParams(this.document.location.search).get('q');
          // When an augmentation overlaps with the SERP result in more than NUM_DOMAINS_TO_EXCLUDE
          // cases, we care that augmentation as ignored and do not list in the sidebar. Both actions
          // and conditions are taken in concern.
          isRelevant =
            matchingQueryCondition ||
            (matchingDomainsCondition
              .map(
                (domain) =>
                  !!this.domains.find((e) => e.search(new RegExp(`^${domain}`, 'gi')) > -1),
              )
              .filter((isMatch) => !!isMatch).length > 0 &&
              matchingDomainsAction
                .map(
                  (domain) =>
                    !!this.domains.find((e) => e.search(new RegExp(`^${domain}`, 'gi')) > -1),
                )
                .filter((isMatch) => !!isMatch).length < NUM_DOMAINS_TO_EXCLUDE);

          IN_DEBUG_MODE &&
            !isRelevant &&
            logirrelevant.push(
              '\n\t',
              {
                [augmentation.id]: {
                  'Domains to look for': domainsToLookAction,
                  'Matching domains for condition': matchingDomainsCondition,
                  'Matching domains for action': matchingDomainsAction,
                  ...augmentation,
                },
              },
              '\n',
            );
          if (
            !this.suggestedAugmentations.find((i) => i.id === augmentation.id) &&
            !augmentation.id.startsWith('cse-custom') &&
            isRelevant
          ) {
            this.suggestedAugmentations.push(augmentation);
          }
          if (augmentation.enabled || (!augmentation.hasOwnProperty('enabled') && isRelevant)) {
            this.getTabUrls(augmentation).forEach((url) => {
              // TODO: pass the whole augmentation object to sidebar tab!
              const tab = {
                url,
                matchingDomainsAction,
                matchingDomainsCondition,
                id: augmentation.id,
                isCse: true,
                isSuggested: !augmentation.hasOwnProperty('enabled'),
                default: !newTabs.length,
                title: augmentation.name,
                description: augmentation.description,
                actionTypes: Array.from(
                  new Set(augmentation.actions.action_list.map(({ key }) => key)),
                ),
                conditionTypes: Array.from(
                  new Set(augmentation.conditions.condition_list.map(({ key }) => key)),
                ),
                hideDomains:
                  augmentation.actions.action_list.find(({ key }) => key === 'hide_domain')
                    ?.value ?? [],
              };
              newTabs.unshift(tab);
              IN_DEBUG_MODE && logTabs.unshift('\n\t', { [tab.title]: tab }, '\n');
            });
          } else {
            this.matchingDisabledInstalledAugmentations.push(augmentation);
          }
        }

        if (augmentation.installed && !isRelevant) {
          this.otherAugmentations.push(augmentation);
        }

        if (
          !this.suggestedAugmentations.find((i) => i.id === augmentation.id) &&
          !augmentation.id.startsWith('cse-custom') &&
          !augmentation.id.startsWith('ignored')
        ) {
          this.otherAugmentations.push(augmentation);
        }

        augmentation.hasOwnProperty('enabled') &&
          !augmentation.enabled &&
          this.matchingDisabledInstalledAugmentations.push(augmentation);
      }
    });

    this.sidebarTabs = newTabs.sort((a, b) => compareTabs(a, b, this.domains));

    const checkRequiredParams = () =>
      this.customSearchEngine?.search_engine_json?.required_params
        .map((param) => window.location.search.search(`${param}=`) === -1)
        .indexOf(true) === -1;

    const checkRequiredPrefix = () =>
      window.location.href.search(this.customSearchEngine?.search_engine_json?.required_prefix) >
      -1;

    this.isSerp = checkRequiredPrefix() && checkRequiredParams();

    IN_DEBUG_MODE &&
      debug(
        'getTabsAndAugmentations - processed',
        '\n---\n\tSidebar Tabs (installed + suggested)\n---',
        ...logTabs,
        '\n---\n\tSuggested Augmentations (at least one matching domain)\n---',
        ...logSuggested,
        '\n---\n\tExcluded Augmentations (at least NUM_DOMAINS_TO_EXCLUDE matching domains at top NUM_DOMAINS_TO_CONSIDER SERP position)\n---',
        ...logirrelevant,
        '\n---\n\tIs this page a search engine? --- ',
        this.isSerp ? 'Yes' : 'No',
        '\n---\n\tProcessed Augmentations (response from subtabs API)\n---',
        ...logProcessed,
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
    this.document = document;
    this.url = url;
    const firstChild = this.document.documentElement.getElementsByTagName('style')[0];
    if (this.styleEl === firstChild) this.document.documentElement.removeChild(firstChild);
    this.strongPrivacy = await new Promise((resolve) =>
      chrome.storage.local.get('anonymousQueries', resolve),
    ).then(({ anonymousQueries }) => anonymousQueries);
    this.fetchSubtabs().then((response) => {
      if (!response) return;
      runFunctionWhenDocumentReady(this.document, async () => {
        await this.handleSubtabApiResponse(response);
        this.isSerp &&
          this.sendLogMessage(EXTENSION_SERP_LOADED, {
            query: this.query,
            url: this.url,
          });
        if (
          this.isSerp ||
          this.sidebarTabs.length ||
          this.matchingDisabledInstalledAugmentations.length
        ) {
          if (process.env.PROJECT === 'is' || this.isSerp) {
            this.createSidebar();
          } else {
            return null;
          }
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
   * @private
   * @method
   * @memberof SidebarLoader
   */
  private reactInjector(
    el: HTMLElement,
    reactEl: ReactElement,
    frameId: string,
    link: HTMLLinkElement,
  ) {
    debug('reactInjector - call');
    const iframe = document.createElement('iframe');
    iframe.id = frameId;
    el.appendChild(iframe);
    const injector = () => {
      const doc = iframe.contentWindow.document.documentElement;
      // Webpack merges all SCSS files into a single <style> element. We initialize
      // the IFrame document object with this merged stylesheet.
      doc.getElementsByTagName('head')[0].appendChild(link);
      doc.getElementsByTagName('head')[0].appendChild(this.styleEl);
      doc.setAttribute('style', 'overflow: hidden;');
      const div = document.createElement('div');
      const root = doc.getElementsByTagName('body')[0].appendChild(div);
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
    const { hostname, params } = extractUrlProperties(this.url.href);
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
    const locals: Record<string, AugmentationObject> = await new Promise((resolve) =>
      chrome.storage.local.get(resolve),
    );
    this.ignoredAugmentations =
      Object.entries(locals).reduce((a, [key, value]) => {
        key.startsWith('ignored-') && a.push(value);
        return a;
      }, []) ?? [];
    this.installedAugmentations =
      Object.entries(locals).reduce((a, [key, augmentation]) => {
        if (
          !key.startsWith('ignored-') &&
          !key.match(/(cachedSubtabs|anonymousQueries|licenseActivated)/gi)
        ) {
          const domainsToLookCondition = augmentation.conditions?.condition_list.map(
            (e) => e.value[0],
          );
          const matchingDomainsCondition = this.domains.filter((value) =>
            domainsToLookCondition?.find((i) => value.search(new RegExp(`^${i}`, 'gi')) > -1),
          );
          if (
            matchingDomainsCondition.length > 0 &&
            augmentation.conditions.condition_list
              .map((condition) => ENABLED_AUGMENTATION_TYPES.includes(condition.key))
              .indexOf(false) === -1
          ) {
            a.push(augmentation);
          } else {
            this.otherAugmentations.push(augmentation);
          }
        }
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
    await this.getLocalAugmentations();
    this.tabDomains['original'] = this.getDomains(document);
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
    const getSubtabs = async (url = this.url.href) => {
      debug('\n---\n\tRequest API', url, '\n---');
      return (await postAPI('subtabs', { url }, { client: 'desktop' })) as SubtabsResponse;
    };
    let response: SubtabsResponse = Object.create(null);
    debug('\n---\n\tIs strong privacy enabled --- ', this.strongPrivacy ? 'Yes' : 'No', '\n---');
    if (this.strongPrivacy) {
      const cache = await new Promise((resolve) =>
        chrome.storage.local.get('cachedSubtabs', resolve),
      ).then(({ cachedSubtabs }) => cachedSubtabs);
      if (cache && cache.expire > Date.now()) {
        debug(
          '\n---\n\tValid cache data found',
          cache.data,
          '\n\tExpires',
          new Date(cache.expire).toLocaleString(),
          '\n---',
        );
        response = cache.data;
      } else {
        debug('\n---\n\tCache not found or expired...\n---');
        response = await getSubtabs(DUMMY_SUBTABS_URL);
        await new Promise((resolve) =>
          chrome.storage.local.set(
            {
              cachedSubtabs: {
                data: response,
                expire: Date.now() + SUBTABS_CACHE_EXPIRE_MIN * 60 * 1000,
              },
            },
            () => resolve('Stored'),
          ),
        );
      }
    } else {
      response = await getSubtabs();
    }
    debug('fetchSubtabs - success\n---\n\tSubtabs Response', response, '\n---');
    return response;
  }

  /**
   * Creates the sidebar layout and inject global stylesheet. Also this method
   * will add a listener to reload whenever the location URL changes.
   *
   * @private
   * @method
   * @memberof SidebarLoader
   */
  private createSidebar() {
    debug('createSidebar - call\n');
    const existing = this.document.getElementById('sidebar-root');
    const link = this.document.createElement('link');
    link.rel = 'stylesheet';
    link.href = chrome.extension.getURL('./index.css');
    link.type = 'text/css';
    this.document.head.appendChild(link);
    const wrapper = this.document.createElement('div');
    wrapper.id = 'sidebar-root';
    wrapper.style.display = 'none';
    if (existing) {
      this.document.body.replaceChild(wrapper, existing);
    } else {
      this.document.body.appendChild(wrapper);
    }
    const nonCseTabs = this.sidebarTabs.filter((tab) => !tab.isCse);
    this.sidebarTabs.concat(nonCseTabs);
    debug('createSidebar - processed\n---\n\tNon CSE Tabs', nonCseTabs, '\n---');
    const sidebarInit = React.createElement(Sidebar);
    this.reactInjector(wrapper, sidebarInit, 'sidebar-root-iframe', link);
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.type === URL_UPDATED_MESSAGE) {
        this.loadOrUpdateSidebar(document, new URL(msg.url));
      }
    });
  }

  /**
   * Send a trigger to background page, to send Freshpaint logging.
   *
   * @param event - The name of the log event
   * @param properties - The properties to send along with the event
   * @public
   * @method
   * @memberof SidebarLoader
   */
  public sendLogMessage(event: string, properties: Record<string, any>) {
    debug(
      'sendLogMessage - call\n---\n\tEvent',
      event,
      '\n\tProperties',
      properties,
      '\n\tStrong pricvacy',
      this.strongPrivacy ? 'Yes' : 'No',
      '\n---',
    );
    !this.strongPrivacy &&
      !IN_DEBUG_MODE &&
      chrome.runtime.sendMessage({
        event,
        properties,
        type: SEND_LOG_MESSAGE,
      });
  }
}

/**
 * Static instance of the sidebar manager.
 */
const instance = new SidebarLoader();

export default instance;

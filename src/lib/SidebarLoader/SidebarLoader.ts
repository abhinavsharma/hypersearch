/**
 * @module SidebarLoader
 * @author Matyas Angyal<matyas@laso.ai>
 * @license (C) Insight
 * @version 1.0.0
 */
import React, { ReactElement } from 'react';
import md5 from 'md5';
import { render } from 'react-dom';
import SearchEngineManager from 'lib/SearchEngineManager/SearchEngineManager';
import AugmentationManager from 'lib/AugmentationManager/AugmentationManager';
import { Sidebar } from 'modules/sidebar';
import {
  extractUrlProperties,
  postAPI,
  runFunctionWhenDocumentReady,
  debug,
  removeProtocol,
  isSafari,
  compareTabs,
  EXTENSION_SERP_LOADED,
  NUM_DOMAINS_TO_CONSIDER,
  SEND_LOG_MESSAGE,
  IN_DEBUG_MODE,
  DUMMY_SUBTABS_URL,
  SUBTABS_CACHE_EXPIRE_MIN,
  BANNED_DOMAINS,
  SIDEBAR_TAB_FAKE_URL,
  keyboardHandler,
  IGNORED_PREFIX,
  CSE_PREFIX,
  PINNED_PREFIX,
  keyUpHandler,
  USE_COUNT_PREFIX,
  GOOGLE_SERP_RESULT_DOMAIN_SELECTOR_FULL,
  BANNED_EXTENSION_IDS,
  INSTALLED_PREFIX,
  DUMMY_AMAZON_SUBTABS_URL,
  MY_TRUSTLIST_ID,
  MY_TRUSTLIST_TEMPLATE,
  triggerSerpProcessing,
  MY_BLOCKLIST_ID,
  MY_BLOCKLIST_TEMPLATE,
  SPECIAL_URL_JUNK_STRING,
  SAFARI_FALLBACK_URL,
  ACTION_KEYS,
  DEFAULT_FALLBACK_SEARCH_ENGINE_PREFIX,
  FORCE_FALLBACK_CSE,
  URL_PARAM_TAB_TITLE_KEY,
  URL_PARAM_NO_COOKIE_KEY,
  CACHED_SUBTABS_KEY,
  CONDITION_KEYS,
  DEDICATED_SERP_REGEX,
  URL_PARAM_POSSIBLE_SERP_RESULT,
} from 'utils';
import UserManager from 'lib/UserManager';

/**
 * ! In order of priority
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
  public url!: URL;

  /**
   * The current SERP query.
   *
   * @public
   * @property
   * @memberof SidebarLoader
   */
  public query!: string;

  /**
   * True if the current page is a SERP.
   *
   * @public
   * @property
   * @memberof SidebarLoader
   */
  public isSerp!: boolean;

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
  public publicationSlices: Record<string, Record<string, string[]>> & Record<'original', string[]>;

  /**
   * The current document object.
   *
   * @public
   * @property
   * @memberof SidebarLoader
   */
  public document!: Document;

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
   * The list of pinned augmentations.
   *
   * @public
   * @property
   * @memberof SidebarLoader
   */
  public pinnedAugmentations: AugmentationObject[];

  /**
   * The list of locally installed but disabled augmentations.
   *
   * @public
   * @property
   * @memberof SidebarLoader
   */
  public matchingDisabledInstalledAugmentations: AugmentationObject[];

  /**
   * True when the sidebar is in the expanded state.
   * TODO: extract to LayoutManager
   *
   * @public
   * @property
   * @memberof SidebarLoader
   */
  public isExpanded!: boolean;

  /**
   * True when the sidebar is in preview state.
   * TODO: extract to LayoutManager
   *
   * @public
   * @property
   * @memberof SidebarLoader
   */
  public isPreview!: boolean;

  /**
   * The index of the currently visible sidebar tab.
   *
   * @public
   * @property
   * @memberof SidebarLoader
   */
  public currentTab!: string;

  /**
   * If true, prevent the sidebar from auto-expanding, even when
   * other expand conditions are true.
   * TODO: extract to LayoutManager
   *
   * @public
   * @property
   * @memberof SidebarLoader
   */
  public preventAutoExpand: boolean;

  /**
   * Maps the corresponding usage statistics for an augmentation.
   *
   * @public
   * @property
   * @memberof SidebarLoader
   */
  public augmentationStats: Record<string, number>;

  public enabledOtherAugmentations: AugmentationObject[];

  public featureDomains: string[];
  public hideDomains: string[];

  public tourStep!: string;

  constructor() {
    debug('SidebarLoader - initialize\n---\n\tSingleton Instance', this, '\n---');
    this.augmentationStats = Object.create(null);
    this.preventAutoExpand = false;
    this.domains = [];
    this.publicationSlices = Object.create(null);
    this.sidebarTabs = [];
    this.domainsToSearch = Object.create(null);
    this.customSearchEngine = Object.create(null);
    this.installedAugmentations = [];
    this.suggestedAugmentations = [];
    this.pinnedAugmentations = [];
    this.otherAugmentations = [];
    this.enabledOtherAugmentations = [];
    this.ignoredAugmentations = [];
    this.featureDomains = [];
    this.hideDomains = [];
    this.matchingDisabledInstalledAugmentations = [];
  }

  public get maxAvailableSpace() {
    const resultWidth = (this.document
      ?.querySelector(this.customSearchEngine.querySelector?.desktop)
      ?.closest(this.customSearchEngine.querySelector?.result_container_selector) as HTMLElement)
      ?.offsetWidth;

    const maxWidth = window.innerWidth - 300;

    if (resultWidth < maxWidth) {
      return maxWidth - resultWidth;
    }

    return -Infinity;
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
  public getDomains(document: Document, getAllFromPage?: boolean) {
    if (!this.customSearchEngine?.querySelector) return [];
    let els: HTMLElement[] = [];
    // On Google, we have to use the `pad` selector, since the desktop referencing to the
    // `<cite>` tag, however the process needs the actual link's `href` attribute.
    // !dev const isGoogle = location.href.search(/google\.com/gi) > -1;
    // !dev const isDdg = location.href.search(/duckduckgo\.com/gi) > -1;
    const isBing = location.href.search(/bing\.com/gi) > -1;
    if (!this.customSearchEngine?.querySelector?.desktop) {
      this.customSearchEngine.querySelector.desktop = GOOGLE_SERP_RESULT_DOMAIN_SELECTOR_FULL;
    }
    this.customSearchEngine?.querySelector?.featured?.forEach(
      (c) => (els = els.concat(Array.from(document.querySelectorAll(c)))),
    );
    els = els.concat(
      Array.from(document.querySelectorAll(this.customSearchEngine?.querySelector?.['desktop'])),
    );
    const result = els
      .map((i) =>
        removeProtocol(
          isBing
            ? i.textContent ?? ''
            : i instanceof HTMLLinkElement
            ? i.getAttribute('href') ?? ''
            : i?.closest('a')?.getAttribute('href') ?? '',
        ),
      )
      .filter((domain) => !BANNED_DOMAINS.includes(extractUrlProperties(domain).full));
    return getAllFromPage ? result : result.slice(0, NUM_DOMAINS_TO_CONSIDER);
  }

  /**
   * Takes an augmentation and returns the corresponding URLs that the sidebar tabs are generated form.
   *
   * @param augmentation
   * @returns The list URLs generated from the augmentation's actions.
   * @private
   * @method
   * @memberof SidebarLoader
   */
  private getTabUrls(augmentation: AugmentationObject) {
    const urls: URL[] = [];
    const defaultUrl =
      this.customSearchEngine.search_engine_json.required_prefix.search(FORCE_FALLBACK_CSE) === -1
        ? this.customSearchEngine.search_engine_json?.required_prefix ||
          DEFAULT_FALLBACK_SEARCH_ENGINE_PREFIX
        : DEFAULT_FALLBACK_SEARCH_ENGINE_PREFIX;

    const emptyUrl = () => new URL(isSafari() ? SAFARI_FALLBACK_URL : `https://${defaultUrl}`);
    let fakeTab = false;
    augmentation.actions.action_list.forEach((action) => {
      if (
        !fakeTab &&
        (action.key === ACTION_KEYS.SEARCH_HIDE_DOMAIN || action.key === ACTION_KEYS.SEARCH_FEATURE)
      ) {
        const fakeUrl = emptyUrl();
        fakeUrl.href = SIDEBAR_TAB_FAKE_URL;
        urls.push(fakeUrl);
        fakeTab = true;
      }
      const customSearchUrl = emptyUrl();
      switch (action.key) {
        // We don't create tabs for SEARCH_HIDE_DOMAIN_ACTION, instead if the augmentation also have
        // SEARCH_DOMAINS_ACTION(s), we process them and create the sidebar URL using their values.
        case ACTION_KEYS.SEARCH_HIDE_DOMAIN:
          this.hideDomains.push(action.value[0]);
          break;
        case ACTION_KEYS.SEARCH_FEATURE:
          this.featureDomains.push(action.value[0]);
          break;
        // OPEN_URL_ACTION will open a custom URL as sidebar tab and interpolates the matchers (%s, %u...etc).
        case ACTION_KEYS.NO_COOKIE:
        case ACTION_KEYS.OPEN_URL:
          action.value.forEach((value) => {
            const regexGroups = augmentation.conditions.condition_list.reduce(
              (groups, condition) => {
                if (
                  condition.unique_key === CONDITION_KEYS.DOMAIN_MATCHES ||
                  condition.unique_key === CONDITION_KEYS.URL_MATCHES
                ) {
                  const matches = new RegExp(condition.value[0]).exec(this.url.href) ?? [];
                  return groups.concat(matches.slice(1));
                }
                return groups;
              },
              [] as string[],
            );
            const url = AugmentationManager.processOpenPageActionString(value, regexGroups);
            if (url.hostname === 'undefined') return;
            url.searchParams.append(URL_PARAM_POSSIBLE_SERP_RESULT, URL_PARAM_POSSIBLE_SERP_RESULT);
            url.searchParams.append(SPECIAL_URL_JUNK_STRING, SPECIAL_URL_JUNK_STRING);
            if (augmentation.actions.action_list.length > 1) {
              url.searchParams.append(
                URL_PARAM_TAB_TITLE_KEY,
                extractUrlProperties(url.href)?.hostname,
              );
            }
            if (action.key === ACTION_KEYS.NO_COOKIE) {
              url.searchParams.append(URL_PARAM_NO_COOKIE_KEY, 'true');
            }
            urls.unshift(url);
          });
          break;
        // A new sidebar tab url will be composed by each SEARCH_DOMAINS_ACTION values, by appending
        // the current search query with *(site: <domain_'> OR <domain_2> ... )* to filter results. The
        // hostname and query parameters are coming from the local/remote search engine data.
        case ACTION_KEYS.SEARCH_DOMAINS:
          {
            const tabAppendages = action.value;
            if (!tabAppendages.length) {
              customSearchUrl.href = SIDEBAR_TAB_FAKE_URL;
            }
            const append =
              tabAppendages.length === 1
                ? `site:${tabAppendages[0]}`
                : `(${tabAppendages.map((x) => `site:${x}`).join(' OR ')})`;
            customSearchUrl.searchParams.append('q', `${this.query} ${append}`);
          }
          break;
        case ACTION_KEYS.SEARCH_APPEND:
          customSearchUrl.searchParams.append('q', `${this.query} ${action.value[0]}`);
          break;
        case ACTION_KEYS.SEARCH_ALSO:
          {
            const url = AugmentationManager.processSearchAlsoActionString(
              (action.value[0] as unknown) as CustomSearchEngine['search_engine_json'],
            );
            url.searchParams.append(SPECIAL_URL_JUNK_STRING, SPECIAL_URL_JUNK_STRING);
            urls.unshift(url);
          }
          break;
        case ACTION_KEYS.OPEN_LINK_CSS:
          {
            try {
              const elements = this.document.querySelectorAll(action.value[0]);
              elements.forEach((element) => {
                try {
                  const url = new URL(element.getAttribute('href') ?? '');
                  url.searchParams.append(SPECIAL_URL_JUNK_STRING, SPECIAL_URL_JUNK_STRING);
                  url.searchParams.append(
                    URL_PARAM_TAB_TITLE_KEY,
                    extractUrlProperties(url.href)?.hostname,
                  );
                  urls.unshift(url);
                } catch (e) {
                  debug('getTabUrls - error', e);
                }
              });
            } catch (e) {
              debug('getTabUrls - error\n---\n\tFailed to create URL', e, '\n---');
            }
          }

          break;
        default:
          debug(`\n---\n\tIncompatible action in ${augmentation.name}`, action, '\n---');
          break;
      }

      switch (action.key) {
        case ACTION_KEYS.SEARCH_DOMAINS:
          customSearchUrl.searchParams.append(SPECIAL_URL_JUNK_STRING, SPECIAL_URL_JUNK_STRING);
          this.publicationSlices[augmentation.id][
            customSearchUrl.href
          ] = action.value.map((value) => removeProtocol(value));
          urls.push(customSearchUrl);
          break;
        case ACTION_KEYS.SEARCH_APPEND:
          customSearchUrl.searchParams.append(SPECIAL_URL_JUNK_STRING, SPECIAL_URL_JUNK_STRING);
          urls.push(customSearchUrl);
          break;
        default:
          break;
      }
    });
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
      ...this.enabledOtherAugmentations,
      ...this.suggestedAugmentations,
    ],
  ) {
    debug(
      'getTabsAndAugmentations - call\n---\n\tTop Results\n',
      ...this.domains.map((domain, index) => `\n\t${index + 1}.) ${domain}\n`),
      '\n---',
      '\n\tPublication Slices\n',
      ...this.publicationSlices['original'].map(
        (domain, index) => `\n\t${index + 1}.) ${domain}\n`,
      ),
      '\n---',
    );
    this.sidebarTabs = [];
    const newTabs: SidebarTab[] = [];
    const logIrrelevant: any[] = [];
    const logSuggested: any[] = [];
    const logTabs: any[] = [];

    augmentations.forEach((augmentation: AugmentationObject) => {
      augmentation.stats = this.augmentationStats[augmentation.id];

      const hasInjectJs = !!augmentation.actions.action_list.find(
        ({ key }) => key === ACTION_KEYS.INJECT_JS,
      );

      if (
        !this.ignoredAugmentations.find((i) => i.id === augmentation.id) &&
        !hasInjectJs &&
        !BANNED_EXTENSION_IDS.includes(augmentation.id)
      ) {
        const {
          isRelevant,
          matchingIntent,
          matchingDomainsAction,
          matchingDomainsCondition,
          domainsToLookAction,
          hasPreventAutoexpand,
        } = AugmentationManager.getAugmentationRelevancy(augmentation);

        if (hasPreventAutoexpand) this.preventAutoExpand = hasPreventAutoexpand;

        /** DEV START **/
        if (IN_DEBUG_MODE) {
          !isRelevant &&
            (matchingDomainsAction.length || matchingDomainsCondition.length) &&
            logIrrelevant.push(
              '\n\t',
              {
                [augmentation.name]: {
                  'Domains to look for': domainsToLookAction,
                  'Matching domains for condition': matchingDomainsCondition,
                  'Matching domains for action': matchingDomainsAction,
                  ...augmentation,
                },
              },
              '\n',
            );
        }
        /** DEV END  **/

        if (isRelevant && AugmentationManager.isAugmentationEnabled(augmentation)) {
          this.publicationSlices[augmentation.id] = Object.create(null);
          this.domainsToSearch[augmentation.id] = augmentation.actions.action_list.reduce(
            (a, { key, value }) => {
              if (key === ACTION_KEYS.SEARCH_DOMAINS) a = a.concat(value);
              return a;
            },
            [] as string[],
          );

          if (augmentation.installed) {
            !augmentation.enabled && this.matchingDisabledInstalledAugmentations.push(augmentation);
          } else if (
            !this.suggestedAugmentations.find(({ id }) => id === augmentation.id) &&
            !this.pinnedAugmentations.find(({ id }) => id === augmentation.id)
          ) {
            /** DEV START **/
            IN_DEBUG_MODE &&
              logSuggested.push(
                '\n\t',
                {
                  [augmentation.name]: {
                    'Domains to look for': domainsToLookAction,
                    'Matching domains for condition': matchingDomainsCondition,
                    'Matching domains for action': matchingDomainsAction,
                    ...augmentation,
                  },
                },
                '\n',
              );
            /** DEV END **/
            this.suggestedAugmentations.push(augmentation);
          }

          this.getTabUrls(augmentation).forEach((url) => {
            const tab: SidebarTab = {
              url,
              augmentation,
              matchingIntent,
              matchingDomainsAction,
              matchingDomainsCondition,
              id: augmentation.id,
              isCse: true,
              title: augmentation.name,
              description: augmentation.description,
            };
            newTabs.unshift(tab);

            /** DEV START **/
            IN_DEBUG_MODE && logTabs.push('\n\t', { [tab.title]: tab }, '\n');
            /** DEV END **/
          });
        } else {
          if (!this.otherAugmentations.find(({ id }) => id === augmentation.id)) {
            /** DEV START **/
            IN_DEBUG_MODE &&
              logIrrelevant.push('\n\t', { [augmentation.name]: augmentation }, '\n');
            /** DEV END **/
            this.otherAugmentations.push(augmentation);
          }
        }
      }
    });

    this.sidebarTabs = newTabs.sort((a, b) => compareTabs(a, b, this.domains));

    /** DEV START **/
    IN_DEBUG_MODE &&
      debug(
        'getTabsAndAugmentations - processed',
        '\n---\n\tIs this page a search engine? --- ',
        this.isSerp ? 'Yes' : 'No',
        '\n---\n\tSidebar Tabs\n---',
        ...logTabs,
        '\n---\n\tSuggested Augmentations\n---',
        ...logSuggested,
        '\n---\n\tOther Augmentations\n---',
        ...logIrrelevant,
      );
    /** DEV END **/

    return this.sidebarTabs;
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
  public async loadOrUpdateSidebar(document: Document, url: URL) {
    debug('loadOrUpdateSidebar - call\n');
    UserManager.initialize();
    this.document = document;
    this.url = url;
    if (
      this.url.href.search(/amazon\.com/gi) > -1 ||
      // TBM will be added to the Google search URL and have a certain value when you select
      // any of the “special” searches, like image search or video search.
      this.url.searchParams.get('tbm') ||
      this.url.searchParams.get('ia') === 'images' ||
      this.url.searchParams.get('iax') === 'images'
    ) {
      this.preventAutoExpand = true;
    }
    const existing = this.document.getElementById('sidebar-root');
    existing && this.document.body.removeChild(existing);
    // When the user applies strong privacy, we load the (existing) cached results of subtabs.
    const response = await this.fetchSubtabs();
    this.customSearchEngine = await SearchEngineManager.getCustomSearchEngine(this.url.href);
    this.query =
      new URLSearchParams(this.document.location.search).get(
        this.customSearchEngine.search_engine_json?.required_params[0],
      ) ?? '';
    this.tourStep = new URLSearchParams(this.document.location.href).get('insight-tour') ?? '';
    const prepareDocument = async () => {
      this.document.documentElement.style.setProperty('color-scheme', 'none');
      this.domains = this.getDomains(document) ?? [];
      this.publicationSlices['original'] = this.getDomains(document, true);
      const checkRequiredParams = () =>
        !!this.customSearchEngine?.search_engine_json?.required_params.length &&
        this.customSearchEngine?.search_engine_json?.required_params
          .map((param) => window.location.search.search(`${param}=`) === -1)
          .indexOf(true) === -1;

      const hostname =
        window.location.href.search(/google\.[\w]*/) > -1
          ? window.location.href.replace(/google\.[\w.]*/, 'google.com')
          : window.location.href;

      const checkRequiredPrefix = () =>
        !!this.customSearchEngine?.search_engine_json?.required_prefix &&
        hostname.search(this.customSearchEngine?.search_engine_json?.required_prefix) > -1;

      this.isSerp =
        checkRequiredPrefix() &&
        checkRequiredParams() &&
        !!this.url.href.match(DEDICATED_SERP_REGEX)?.length;
      this.preventAutoExpand = this.preventAutoExpand || !this.isSerp;
      if (this.isSerp) {
        this.sendLogMessage(EXTENSION_SERP_LOADED, {
          query: this.query,
          url: this.url,
          license_keys: [this.userData.license],
        });
      }
      await this.handleSubtabApiResponse(response);
      this.createSidebar();

      const openCssLinks = this.sidebarTabs
        .reduce((selectors, tab) => {
          tab.augmentation.actions.action_list
            .filter(({ key }) => key === ACTION_KEYS.OPEN_LINK_CSS)
            .forEach(({ value }) => selectors.push(value[0]));
          return selectors;
        }, [] as string[])
        .join(', ');
      triggerSerpProcessing(this, false, openCssLinks);
    };
    response && runFunctionWhenDocumentReady(this.document, prepareDocument);
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
  private reactInjector(el: HTMLElement, reactEl: ReactElement, frameId: string) {
    debug('reactInjector - call');
    const iframe = document.createElement('iframe');
    iframe.id = frameId;
    el.appendChild(iframe);
    const handleKeyDown = (event: KeyboardEvent) => keyboardHandler(event, this);
    const handleKeyUp = (event: KeyboardEvent) => keyUpHandler(event);
    el.addEventListener('keydown', handleKeyDown, true);
    el.addEventListener('keyup', handleKeyUp);
    iframe.contentWindow?.document.addEventListener('keydown', handleKeyDown, true);
    iframe.contentWindow?.document.addEventListener('keyup', handleKeyUp, true);
    const injector = () => {
      const doc = iframe.contentWindow?.document;
      if (!doc) {
        debug('reactInjector - error - Frame document unaccessible');
        return null;
      }
      const link = doc.createElement('link');
      link.setAttribute('type', 'text/css');
      link.setAttribute('rel', 'stylesheet');
      link.setAttribute('href', chrome.runtime.getURL('bundle.css'));
      doc.head.appendChild(link);
      doc.body.id = 'insight-sidebar';
      doc.documentElement.setAttribute('style', 'overflow: hidden;');
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
   * Get installed and ignored augmentations from the local storage.
   *
   * @private
   * @method
   * @memberof SidebarLoader
   */
  private async getLocalAugmentations() {
    debug('getLocalAugmentations - call');
    const logInstalled: any[] = [];
    const logOther: any[] = [];
    const logIgnored: any[] = [];
    const logPinned: any[] = [];
    const locals: Record<string, AugmentationObject & number> =
      (await new Promise((resolve) => chrome.storage.local.get(resolve))) ?? Object.create(null);
    const syncs: Record<string, AugmentationObject & number> =
      (await new Promise((resolve) => chrome.storage.sync.get(resolve))) ?? Object.create(null);
    [...Object.entries(locals), ...Object.entries(syncs)].forEach(([key, value]) => {
      const { isRelevant, isHidden } = AugmentationManager.getAugmentationRelevancy(value);
      const flag = key.split('-')[0];
      switch (flag) {
        case IGNORED_PREFIX:
          if (!this.ignoredAugmentations.find(({ id }) => id === value.id)) {
            /** DEV START **/
            if (IN_DEBUG_MODE) {
              logIgnored.push('\n\t', { [value.name]: { ...(value as AugmentationObject) } }, '\n');
            }
            /** DEV END  **/
            this.ignoredAugmentations.push(value);
          }
          break;
        case PINNED_PREFIX:
          if (!this.pinnedAugmentations.find(({ id }) => id === value.id)) {
            /** DEV START **/
            if (IN_DEBUG_MODE) {
              logPinned.push('\n\t', { [value.name]: { ...(value as AugmentationObject) } }, '\n');
            }
            /** DEV END  **/
            this.pinnedAugmentations.push(value);
          }
          this.installedAugmentations = this.installedAugmentations.filter(
            ({ id }) => id !== value.id,
          );
          if (
            !this.installedAugmentations.find(({ id }) => id === value.id) &&
            !this.suggestedAugmentations.find(({ id }) => id === value.id) &&
            !this.enabledOtherAugmentations.find(({ id }) => id === value.id)
          ) {
            /** DEV START **/
            if (IN_DEBUG_MODE) {
              logPinned.push('\n\t', { [value.name]: { ...(value as AugmentationObject) } }, '\n');
            }
            /** DEV END  **/
            this.enabledOtherAugmentations.push(value);
          }
          break;
        case CSE_PREFIX:
          if (!this.pinnedAugmentations.find(({ id }) => id === value.id)) {
            if (
              isRelevant &&
              AugmentationManager.isAugmentationEnabled(value) &&
              !this.installedAugmentations.find(({ id }) => id === value.id)
            ) {
              /** DEV START **/
              if (IN_DEBUG_MODE) {
                logInstalled.push(
                  '\n\t',
                  { [value.name]: { ...(value as AugmentationObject) } },
                  '\n',
                );
              }
              /** DEV END  **/
              this.installedAugmentations.push(value);
            } else {
              if (isHidden && !this.ignoredAugmentations.find(({ id }) => id === value.id)) {
                this.ignoredAugmentations.push(value);
              }
              if (!isHidden && !this.otherAugmentations.find(({ id }) => id === value.id)) {
                /** DEV START **/
                if (IN_DEBUG_MODE) {
                  logOther.push(
                    '\n\t',
                    { [value.name]: { ...(value as AugmentationObject) } },
                    '\n',
                  );
                }
                /** DEV END  **/
                this.otherAugmentations.push(value);
              }
            }
          }
          break;
        case USE_COUNT_PREFIX:
          this.augmentationStats[key.replace(`${USE_COUNT_PREFIX}-`, '')] = Number(value);
          break;
        default:
          break;
      }
    });
    if (
      !this.installedAugmentations.find(({ id }) => id === MY_TRUSTLIST_ID) &&
      !this.otherAugmentations.find(({ id }) => id === MY_TRUSTLIST_ID)
    ) {
      AugmentationManager.addOrEditAugmentation(MY_TRUSTLIST_TEMPLATE, {});
    }
    if (
      !this.installedAugmentations.find(({ id }) => id === MY_BLOCKLIST_ID) &&
      !this.otherAugmentations.find(({ id }) => id === MY_BLOCKLIST_ID)
    ) {
      AugmentationManager.addOrEditAugmentation(MY_BLOCKLIST_TEMPLATE, {});
    }
    debug(
      'getLocalAugmentations - processed\n---\n\tInstalled Augmentations\n---\n',
      ...logInstalled,
      '\n---\n\tIgnored Augmentations\n---\n',
      ...logIgnored,
      '\n---\n\tPinned Augmentations\n---\n',
      ...logPinned,
      '\n---\n\tOther Augmentations\n---\n',
      ...logOther,
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
  private async handleSubtabApiResponse(response: SubtabsResponse): Promise<void> {
    debug('handleSubtabApiResponse - call');
    if (!(this.url && response)) return;
    await this.getLocalAugmentations();
    this.getTabsAndAugmentations([
      ...this.installedAugmentations,
      ...this.enabledOtherAugmentations,
      ...(response.suggested_augmentations ?? []).reduce((a, augmentation) => {
        if (!this.pinnedAugmentations.find(({ id }) => id === augmentation.id)) {
          a.push({
            ...augmentation,
            id: augmentation.id.startsWith(INSTALLED_PREFIX)
              ? augmentation.id.replace(INSTALLED_PREFIX, CSE_PREFIX)
              : augmentation.id,
            installed: false,
          });
        }
        return a;
      }, [] as AugmentationObject[]),
    ]);
    /*
    !DEV DISABLED BY DEV-45[https://bit.ly/3x8tMaD]
    TODO: handle custom url subtabs and readable content
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
    ! END DISABLED */
    debug('handleSubtabApiResponse - processed');
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
      debug('\n---\n\tRequest API', url, '\n\tLicense', UserManager.user.license, '\n---');
      return (await postAPI(
        'subtabs',
        { url },
        {
          client: 'desktop',
          license_keys: UserManager.user.license ? [UserManager.user.license] : [],
          uuid: UserManager.user.id,
        },
      )) as SubtabsResponse;
    };
    let response: SubtabsResponse = Object.create(null);
    debug(
      '\n---\n\tIs strong privacy enabled --- ',
      UserManager.user.privacy ? 'Yes' : 'No',
      '\n---',
    );
    if (UserManager.user.privacy) {
      const cache = await new Promise<Record<string, { data: SubtabsResponse; expire: number }>>(
        (resolve) => chrome.storage.local.get(CACHED_SUBTABS_KEY, resolve),
      ).then((value) => value[CACHED_SUBTABS_KEY]);
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
        const { suggested_augmentations: defaultResponse } = await getSubtabs(DUMMY_SUBTABS_URL);
        const { suggested_augmentations: amazonResponse } = await getSubtabs(
          DUMMY_AMAZON_SUBTABS_URL,
        );

        const suggested_augmentations = defaultResponse
          ?.concat(amazonResponse ?? [])
          .reduce((result, suggestion) => {
            if (!result.find(({ id }) => id === suggestion.id)) {
              result.push(suggestion);
            }
            return result;
          }, [] as AugmentationObject[]);

        response = {
          subtabs: [],
          suggested_augmentations,
        };

        await new Promise((resolve) =>
          chrome.storage.local.set(
            {
              [CACHED_SUBTABS_KEY]: {
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
    const wrapper = this.document.createElement('div');
    wrapper.id = 'sidebar-root';
    wrapper.style.display = 'none';
    this.document.body.appendChild(wrapper);
    const nonCseTabs = this.sidebarTabs.filter((tab) => !tab.isCse);
    this.sidebarTabs.concat(nonCseTabs);
    const sidebarInit = React.createElement(Sidebar);
    this.reactInjector(wrapper, sidebarInit, 'sidebar-root-iframe');
    debug('createSidebar - processed');
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
    if (UserManager.user.privacy) {
      const { url, query } = properties;
      if (url) properties.url = md5(url);
      if (query) properties.query = md5(query);
    }

    properties.userIsAnon = UserManager.user.privacy;

    debug(
      'sendLogMessage - call\n---\n\tEvent',
      event,
      '\n\tProperties',
      properties,
      '\n\tStrong privacy',
      UserManager.user.privacy ? 'Yes' : 'No',
      '\n---',
    );

    if (!IN_DEBUG_MODE && UserManager.user.license) {
      chrome.runtime.sendMessage({
        event,
        properties,
        userId: UserManager.user.id,
        type: SEND_LOG_MESSAGE,
      });
    }
  }
}

/**
 * Static instance of the sidebar manager.
 */
const instance = new SidebarLoader();

export default instance;

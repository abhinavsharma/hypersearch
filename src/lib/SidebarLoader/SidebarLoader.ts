/**
 * @module SidebarLoader
 * @author Matyas Angyal<matyas@laso.ai>
 * @license (C) Insight
 * @version 1.0.0
 */
import React, { ReactElement } from 'react';
import { render } from 'react-dom';
import { SPECIAL_URL_JUNK_STRING } from 'lumos-shared-js';
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
  isAugmentationEnabled,
  EXTENSION_SERP_LOADED,
  NUM_DOMAINS_TO_CONSIDER,
  SEND_LOG_MESSAGE,
  IN_DEBUG_MODE,
  DUMMY_SUBTABS_URL,
  SUBTABS_CACHE_EXPIRE_MIN,
  BANNED_DOMAINS,
  SEARCH_DOMAINS_ACTION,
  SEARCH_HIDE_DOMAIN_ACTION,
  OPEN_URL_ACTION,
  HIDE_TAB_FAKE_URL,
  keyboardHandler,
  IGNORED_PREFIX,
  CSE_PREFIX,
  PINNED_PREFIX,
  keyUpHandler,
  IMAGE_URL_PARAM,
} from 'utils';

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
  public tabDomains: Record<string, string[]> | Record<string, string[]>[];

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
   *
   * @public
   * @property
   * @memberof SidebarLoader
   */
  public strongPrivacy: boolean;

  /**
   * True when the sidebar is in the expnaded state.
   *
   * @public
   * @property
   * @memberof SidebarLoader
   */
  public isExpanded: boolean;

  /**
   * The index of the currently visible sidebar tab.
   *
   * @public
   * @property
   * @memberof SidebarLoader
   */
  public currentTab: string;

  /**
   * If true, prevent the sidebar from auto-expanding, even when
   * othe expand conditions are true.
   *
   * @public
   * @property
   * @memberof SidebarLoader
   */
  public preventAutoExpand: boolean;

  constructor() {
    debug('SidebarLoader - initialize\n---\n\tSingleton Instance', this, '\n---');
    this.preventAutoExpand = false;
    this.styleEl = window.top.document.documentElement.getElementsByTagName('style')[0];
    this.tabDomains = Object.create(null);
    this.sidebarTabs = [];
    this.domainsToSearch = Object.create(null);
    this.customSearchEngine = Object.create(null);
    this.installedAugmentations = [];
    this.suggestedAugmentations = [];
    this.pinnedAugmentations = [];
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
    // On Google, we have to use the `pad` selector, since the desktop referencing to the
    // `<cite>` tag, however the process needs the actual link's `href` attribute.
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
   * Takes an augmentation and returns the corresponding URLs that the sidebar tabs are genereated form.
   *
   * @param augmentation
   * @returns The list URLs generated from the augmentation's actions.
   * @private
   * @method
   * @memberof SidebarLoader
   */
  private getTabUrls(augmentation: AugmentationObject) {
    const urls: URL[] = [];
    const emptyUrl = () =>
      new URL(
        isSafari()
          ? 'https://www.ecosia.org/search'
          : `https://${this.customSearchEngine.search_engine_json.required_prefix}`,
      );
    augmentation.actions.action_list.forEach((action) => {
      switch (action.key) {
        // We don't create tabs for SEARCH_HIDE_DOMAIN_ACTION, instead if the augmentation also have
        // SEARCH_DOMAINS_ACTION(s), we process them and create the sidebar URL using their values.
        case SEARCH_HIDE_DOMAIN_ACTION:
          const fakeUrl = emptyUrl();
          fakeUrl.href = HIDE_TAB_FAKE_URL;
          urls.push(fakeUrl);
          break;
        // OPEN_URL_ACTION will open a custom URL as sidebar tab and interpolates the matchers (%s, %u...etc).
        case OPEN_URL_ACTION:
          action.value.forEach((value) => {
            const url = AugmentationManager.processOpenPageActionString(value);
            url.searchParams.append(SPECIAL_URL_JUNK_STRING, SPECIAL_URL_JUNK_STRING);
            urls.push(url);
          });
          break;
        // A new sidebar tab url will be composed by each SEARCH_DOMAINS_ACTION values, by appending
        // the current search query with *(site: <domain_'> OR <domain_2> ... )* to filter results. The
        // hostname and query parameters are coming from the local/remote search engine data.
        case SEARCH_DOMAINS_ACTION:
          const customSearchUrl = emptyUrl();
          const tabAppendages = action.value;
          if (!tabAppendages.length) {
            customSearchUrl.href = HIDE_TAB_FAKE_URL;
          }

          const append =
            tabAppendages.length === 1
              ? `site:${tabAppendages[0]}`
              : `(${tabAppendages.map((x) => `site:${x}`).join(' OR ')})`;
          customSearchUrl.searchParams.append('q', `${this.query} ${append}`);
          customSearchUrl.searchParams.append(SPECIAL_URL_JUNK_STRING, SPECIAL_URL_JUNK_STRING);
          urls.push(customSearchUrl);
          this.tabDomains[augmentation.id][customSearchUrl.href] = action.value.map((value) =>
            removeProtocol(value),
          );
          break;
        default:
          debug(`\n---\n\tIncompatible action in ${augmentation.name}`, action, '\n---');
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
      ...this.pinnedAugmentations,
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
        augmentation.id.startsWith(CSE_PREFIX) &&
        !this.ignoredAugmentations.find((i) => i.id === augmentation.id)
      ) {
        const {
          isRelevant,
          matchingDomainsAction,
          matchingDomainsCondition,
          domainsToLookAction,
          hasPreventAutoexpand,
        } = AugmentationManager.getAugmentationRelevancy(augmentation);

        if (hasPreventAutoexpand) this.preventAutoExpand = hasPreventAutoexpand;

        /** DEV START **/
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
        /** DEV END  **/

        if (isRelevant && isAugmentationEnabled(augmentation)) {
          this.query = new URLSearchParams(this.document.location.search).get('q');
          this.tabDomains[augmentation.id] = [];
          this.domainsToSearch[augmentation.id] = augmentation.actions.action_list.reduce(
            (a, { key, value }) => {
              if (key === SEARCH_DOMAINS_ACTION) a = a.concat(value);
              return a;
            },
            [],
          );

          /** DEV START **/
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
          /** DEV END **/

          if (augmentation.hasOwnProperty('enabled')) {
            !augmentation.enabled && this.matchingDisabledInstalledAugmentations.push(augmentation);
          } else if (
            !this.suggestedAugmentations.find(({ id }) => id === augmentation.id) &&
            !this.pinnedAugmentations.find(({ id }) => id === augmentation.id)
          ) {
            this.suggestedAugmentations.push(augmentation);
          }

          this.getTabUrls(augmentation).forEach((url) => {
            const tab: SidebarTab = {
              url,
              augmentation,
              matchingDomainsAction,
              matchingDomainsCondition,
              id: augmentation.id,
              isCse: true,
              title: augmentation.name,
              description: augmentation.description,
            };
            newTabs.unshift(tab);

            /** DEV START **/
            IN_DEBUG_MODE && logTabs.unshift('\n\t', { [tab.title]: tab }, '\n');
            /** DEV END **/
          });
        } else {
          !this.otherAugmentations.find(({ id }) => id === augmentation.id) &&
            this.otherAugmentations.push(augmentation);
        }
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

    /** DEV START **/
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
    /** DEV END **/
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
    const existing = this.document.getElementById('sidebar-root');
    existing && this.document.body.removeChild(existing);
    // The first `<style>` element is injected by webpack. We have to remove this if its not
    // getting cleaned up by the host site itself. Otherwise style collisions can happen.
    const firstChild = this.document.documentElement.getElementsByTagName('style')[0];
    if (this.styleEl === firstChild) this.document.documentElement.removeChild(firstChild);
    // When the user applies strong privacy, we load the (existing) cached results of subtabs.
    this.strongPrivacy = await new Promise((resolve) =>
      chrome.storage.local.get('anonymousQueries', resolve),
    ).then(({ anonymousQueries }) => anonymousQueries);
    const response = await this.fetchSubtabs();
    response &&
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
          if (
            window.location.href.search(IMAGE_URL_PARAM) === -1 &&
            (process.env.PROJECT === 'is' || this.isSerp)
          ) {
            this.createSidebar();
          } else {
            return null;
          }
        }
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
    const handleKeyDown = (event: KeyboardEvent) => keyboardHandler(event, this);
    const handleKeyUp = (event: KeyboardEvent) => keyUpHandler(event);
    el.addEventListener('keydown', handleKeyDown, true);
    el.addEventListener('keyup', handleKeyUp);
    iframe.contentWindow.document.addEventListener('keydown', handleKeyDown, true);
    iframe.contentWindow.document.addEventListener('keyup', handleKeyUp, true);
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
    Object.entries(locals).forEach(([key, augmentation]) => {
      const flag = key.split('-')[0];
      switch (flag) {
        case IGNORED_PREFIX:
          this.ignoredAugmentations.push(augmentation);
          break;
        case PINNED_PREFIX:
          this.pinnedAugmentations.push(augmentation);
          this.installedAugmentations = this.installedAugmentations.filter(
            ({ id }) => id !== augmentation.id,
          );
          break;
        case CSE_PREFIX:
          const { isRelevant } = AugmentationManager.getAugmentationRelevancy(augmentation);
          if (!this.pinnedAugmentations.find(({ id }) => id === augmentation.id)) {
            if (isRelevant && isAugmentationEnabled(augmentation)) {
              this.installedAugmentations.push(augmentation);
            } else {
              this.otherAugmentations.push(augmentation);
            }
          }
          break;
        default:
          break;
      }
    });
    debug(
      'getLocalAugmentations - call\n---\n\tInstalled Augmentations',
      this.installedAugmentations,
      '\n\tIgnored Augmentations',
      this.ignoredAugmentations,
      '\n\tPinned Augmentations',
      this.pinnedAugmentations,
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
    this.customSearchEngine = await SearchEngineManager.getCustomSearchEngine(this.url.href);
    this.domains = this.getDomains(document);
    await this.getLocalAugmentations();
    this.tabDomains['original'] = this.getDomains(document);
    this.getTabsAndAugmentations([
      ...this.pinnedAugmentations,
      ...this.installedAugmentations,
      ...response.suggested_augmentations.filter(
        (augmentation) => !this.pinnedAugmentations.find(({ id }) => id === augmentation.id),
      ),
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
    this.reactInjector(wrapper, sidebarInit, 'sidebar-root-iframe', link);
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

/**
 * @module SidebarLoader
 * @author Matyas Angyal<matyas@laso.ai>
 * @license (C) Insight
 * @version 1.0.0
 */
import React, { ReactElement } from 'react';
import md5 from 'md5';
import { render } from 'react-dom';
import { v4 as uuid } from 'uuid';
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
  SYNC_LICENSE_KEY,
  SEARCH_APPEND_ACTION,
  USE_COUNT_PREFIX,
  SYNC_PRIVACY_KEY,
  GOOGLE_SERP_RESULT_DOMAIN_SELECTOR_FULL,
  INJECT_JS_ACTION,
  BANNED_EXTENSION_IDS,
  INSTALLED_PREFIX,
  EXTENSION_AUTO_EXPAND,
  DUMMY_AMAZON_SUBTABS_URL,
  MY_TRUSTLIST_ID,
  MY_TRUSTLIST_TEMPLATE,
  triggerSerpProcessing,
  MY_BLOCKLIST_ID,
  MY_BLOCKLIST_TEMPLATE,
  SYNC_DISTINCT_KEY,
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

  /**
   * Maps the corresponing usage statistics for an augmentation.
   *
   * @public
   * @property
   * @memberof SidebarLoader
   */
  public augmentationStats: Record<string, number>;

  public enabledOtherAugmentations: AugmentationObject[];

  public hideDomains: string[];

  public tourStep: string;

  public userData: Record<'license' | 'id', string>;

  constructor() {
    debug('SidebarLoader - initialize\n---\n\tSingleton Instance', this, '\n---');
    this.augmentationStats = Object.create(null);
    this.preventAutoExpand = false;
    this.domains = [];
    this.styleEl = window.top.document.documentElement.getElementsByTagName('style')[0];
    this.tabDomains = Object.create(null);
    this.sidebarTabs = [];
    this.domainsToSearch = Object.create(null);
    this.customSearchEngine = Object.create(null);
    this.installedAugmentations = [];
    this.suggestedAugmentations = [];
    this.pinnedAugmentations = [];
    this.otherAugmentations = [];
    this.enabledOtherAugmentations = [];
    this.ignoredAugmentations = [];
    this.hideDomains = [];
    this.matchingDisabledInstalledAugmentations = [];
    this.userData = Object.create(null);
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
    let els = [];
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
        isBing
          ? extractUrlProperties(i.textContent).full
          : extractUrlProperties(
              i instanceof HTMLLinkElement
                ? i.getAttribute('href')
                : i?.closest('a').getAttribute('href'),
            ).full,
      )
      .filter((domain) => !BANNED_DOMAINS.includes(domain));
    return getAllFromPage ? result : result.slice(0, NUM_DOMAINS_TO_CONSIDER);
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
    const defaultUrl =
      this.customSearchEngine.search_engine_json.required_prefix.search(/amazon\.com/gi) === -1
        ? this.customSearchEngine.search_engine_json?.required_prefix || 'google.com/search'
        : 'google.com/search';

    const emptyUrl = () =>
      new URL(isSafari() ? 'https://www.ecosia.org/search' : `https://${defaultUrl}`);
    let fakeTab = null;
    augmentation.actions.action_list.forEach((action) => {
      if (!fakeTab && action.key === SEARCH_HIDE_DOMAIN_ACTION) {
        const fakeUrl = emptyUrl();
        fakeUrl.href = HIDE_TAB_FAKE_URL;
        urls.push(fakeUrl);
        fakeTab = true;
      }
      const customSearchUrl = emptyUrl();
      switch (action.key) {
        // We don't create tabs for SEARCH_HIDE_DOMAIN_ACTION, instead if the augmentation also have
        // SEARCH_DOMAINS_ACTION(s), we process them and create the sidebar URL using their values.
        case SEARCH_HIDE_DOMAIN_ACTION:
          this.hideDomains.push(action.value[0]);
          break;
        // OPEN_URL_ACTION will open a custom URL as sidebar tab and interpolates the matchers (%s, %u...etc).
        case OPEN_URL_ACTION:
          action.value.forEach((value) => {
            const url = AugmentationManager.processOpenPageActionString(value);
            url.searchParams.append(SPECIAL_URL_JUNK_STRING, SPECIAL_URL_JUNK_STRING);
            url.searchParams.append('insight-tab-title', extractUrlProperties(url.href)?.hostname);
            urls.push(url);
          });
          break;
        // A new sidebar tab url will be composed by each SEARCH_DOMAINS_ACTION values, by appending
        // the current search query with *(site: <domain_'> OR <domain_2> ... )* to filter results. The
        // hostname and query parameters are coming from the local/remote search engine data.
        case SEARCH_DOMAINS_ACTION:
          const tabAppendages = action.value;
          if (!tabAppendages.length) {
            customSearchUrl.href = HIDE_TAB_FAKE_URL;
          }
          const append =
            tabAppendages.length === 1
              ? `site:${tabAppendages[0]}`
              : `(${tabAppendages.map((x) => `site:${x}`).join(' OR ')})`;
          customSearchUrl.searchParams.append('q', `${this.query} ${append}`);
          break;
        case SEARCH_APPEND_ACTION:
          customSearchUrl.searchParams.append('q', `${this.query} ${action.value[0]}`);
          break;
        default:
          debug(`\n---\n\tIncompatible action in ${augmentation.name}`, action, '\n---');
      }

      switch (action.key) {
        case SEARCH_DOMAINS_ACTION:
          customSearchUrl.searchParams.append(SPECIAL_URL_JUNK_STRING, SPECIAL_URL_JUNK_STRING);
          this.tabDomains[augmentation.id][customSearchUrl.href] = action.value.map((value) =>
            removeProtocol(value),
          );
          urls.push(customSearchUrl);
          break;
        case SEARCH_APPEND_ACTION:
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
      'getTabsAndAugmentations - call\n---\n\tTop domains\n',
      ...this.domains.map((domain, index) => `\n\t${index + 1}.) ${domain}\n`),
      '\n---',
      '\n\tAll domains\n',
      ...this.tabDomains['original'].map((domain, index) => `\n\t${index + 1}.) ${domain}\n`),
      '\n---',
    );
    this.sidebarTabs = [];
    const newTabs: SidebarTab[] = [];
    const logirrelevant: any[] = [];
    const logSuggested: any[] = [];
    const logTabs: any[] = [];

    augmentations.forEach((augmentation: AugmentationObject) => {
      augmentation.stats = this.augmentationStats[augmentation.id];

      const hasInjectJs = !!augmentation.actions.action_list.find(
        ({ key }) => key === INJECT_JS_ACTION,
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
            logirrelevant.push(
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

        if (isRelevant && isAugmentationEnabled(augmentation)) {
          this.tabDomains[augmentation.id] = [];
          this.domainsToSearch[augmentation.id] = augmentation.actions.action_list.reduce(
            (a, { key, value }) => {
              if (key === SEARCH_DOMAINS_ACTION) a = a.concat(value);
              return a;
            },
            [],
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
            IN_DEBUG_MODE && logTabs.unshift('\n\t', { [tab.title]: tab }, '\n');
            /** DEV END **/
          });
        } else {
          if (!this.otherAugmentations.find(({ id }) => id === augmentation.id)) {
            /** DEV START **/
            IN_DEBUG_MODE &&
              logirrelevant.push('\n\t', { [augmentation.name]: augmentation }, '\n');
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
        ...logirrelevant,
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
    if (
      this.url.href.search(/amazon\.com/gi) > -1 ||
      this.url.searchParams.get('tbm') === 'isch' ||
      this.url.searchParams.get('ia') === 'images' ||
      this.url.searchParams.get('iax') === 'images'
    ) {
      this.preventAutoExpand = true;
    }
    const existing = this.document.getElementById('sidebar-root');
    existing && this.document.body.removeChild(existing);
    // The first `<style>` element is injected by webpack. We have to remove this if its not
    // getting cleaned up by the host site itself. Otherwise style collisions can happen.
    const firstChild = this.document.documentElement.getElementsByTagName('style')[0];
    if (this.styleEl === firstChild) this.document.documentElement.removeChild(firstChild);
    // When the user applies strong privacy, we load the (existing) cached results of subtabs.
    this.strongPrivacy = await new Promise((resolve) =>
      chrome.storage.sync.get(SYNC_PRIVACY_KEY, resolve),
    ).then((value) => !value[SYNC_PRIVACY_KEY]);
    const response = await this.fetchSubtabs();
    this.customSearchEngine = await SearchEngineManager.getCustomSearchEngine(this.url.href);
    this.query = new URLSearchParams(this.document.location.search).get(
      this.customSearchEngine.search_engine_json?.required_params[0],
    );
    this.tourStep = new URLSearchParams(this.document.location.href).get('insight-tour');
    const prepareDocument = async () => {
      this.document.documentElement.style.setProperty('color-scheme', 'none');
      this.domains = this.getDomains(document) ?? [];
      this.tabDomains['original'] = this.getDomains(document, true);
      const checkRequiredParams = () =>
        !!this.customSearchEngine?.search_engine_json?.required_params.length &&
        this.customSearchEngine?.search_engine_json?.required_params
          .map((param) => window.location.search.search(`${param}=`) === -1)
          .indexOf(true) === -1;

      const checkRequiredPrefix = () =>
        !!this.customSearchEngine?.search_engine_json?.required_prefix &&
        window.location.href.search(this.customSearchEngine?.search_engine_json?.required_prefix) >
          -1;
      this.isSerp = checkRequiredPrefix() && checkRequiredParams();
      this.isSerp &&
        this.sendLogMessage(EXTENSION_SERP_LOADED, {
          query: this.query,
          url: this.url,
        });
      await this.handleSubtabApiResponse(response);
      this.createSidebar();
      triggerSerpProcessing(this);
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
    debug('getLocalAugmentations - call');
    const logInstalled = [];
    const logOther = [];
    const logIgnored = [];
    const logPinned = [];
    const locals: Record<string, AugmentationObject & number> = await new Promise((resolve) =>
      chrome.storage.local.get(resolve),
    );
    const syncs: Record<string, AugmentationObject & number> = await new Promise((resolve) =>
      chrome.storage.sync.get(resolve),
    );
    [...Object.entries(locals), ...Object.entries(syncs)].forEach(([key, value]) => {
      const { isRelevant } = AugmentationManager.getAugmentationRelevancy(value);
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
              isAugmentationEnabled(value) &&
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
              if (!this.otherAugmentations.find(({ id }) => id === value.id)) {
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
  private async handleSubtabApiResponse(response: SubtabsResponse) {
    debug('handleSubtabApiResponse - call');
    if (!(this.url && response)) return null;
    await this.getLocalAugmentations();
    this.getTabsAndAugmentations([
      ...this.installedAugmentations,
      ...this.enabledOtherAugmentations,
      ...response.suggested_augmentations.reduce((a, augmentation) => {
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
      }, []),
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
    await this.getUserData();
    const getSubtabs = async (url = this.url.href) => {
      debug('\n---\n\tRequest API', url, '\n\tLicense', this.userData.license, '\n---');
      return (await postAPI(
        'subtabs',
        { url },
        {
          client: 'desktop',
          license_keys: this.userData.license ? [this.userData.license] : [],
          uuid: this.userData.id,
        },
      )) as SubtabsResponse;
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
        const { suggested_augmentations: defaultResponse } = await getSubtabs(DUMMY_SUBTABS_URL);
        const { suggested_augmentations: amazonResponse } = await getSubtabs(
          DUMMY_AMAZON_SUBTABS_URL,
        );

        const suggested_augmentations = defaultResponse
          .concat(amazonResponse)
          .reduce((result, suggestion) => {
            if (!result.find(({ id }) => id === suggestion.id)) {
              result.push(suggestion);
            }
            return result;
          }, []);

        response = {
          subtabs: [],
          suggested_augmentations,
        };

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
    const existing = this.document.getElementById('sidebar-root');
    if (existing) {
      existing.parentElement.removeChild(existing);
    }
    const wrapper = this.document.createElement('div');
    wrapper.id = 'sidebar-root';
    wrapper.style.display = 'none';
    this.document.body.appendChild(wrapper);
    const nonCseTabs = this.sidebarTabs.filter((tab) => !tab.isCse);
    this.sidebarTabs.concat(nonCseTabs);
    const sidebarInit = React.createElement(Sidebar);
    this.reactInjector(wrapper, sidebarInit, 'sidebar-root-iframe', link);
    debug('createSidebar - processed');
  }

  private async getUserData() {
    // We use this for the logging. This ID will be assigned to the instance, throughout the application
    // lifetime. This way we can follow the exact user actions indentifying them by their ID. Also, we can
    // keep user's privacy intact and provide anonymous usage data to the Freshpaint log.
    const storedId = await new Promise((resolve) =>
      chrome.storage.sync.get(SYNC_DISTINCT_KEY, resolve),
    );
    let userId = storedId[SYNC_DISTINCT_KEY];
    if (!userId) {
      userId = uuid();
      chrome.storage.sync.set({ [SYNC_DISTINCT_KEY]: userId });
    }
    const storedLicense =
      (await new Promise((resolve) => chrome.storage.sync.get(SYNC_LICENSE_KEY, resolve)).then(
        (mod) => mod?.[SYNC_LICENSE_KEY],
      )) ?? null;
    this.userData.id = userId;
    this.userData.license = storedLicense;
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
    if (this.strongPrivacy) {
      const { url, query } = properties;
      if (url) properties.url = md5(url);
      if (query) properties.query = md5(query);
    }

    properties.userIsAnon = this.strongPrivacy;

    debug(
      'sendLogMessage - call\n---\n\tEvent',
      event,
      '\n\tProperties',
      properties,
      '\n\tStrong pricvacy',
      this.strongPrivacy ? 'Yes' : 'No',
      '\n---',
    );

    if (!IN_DEBUG_MODE && this.userData.license) {
      chrome.runtime.sendMessage({
        event,
        properties,
        userId: this.userData.id,
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

import {
  KP_SELECTORS,
  IN_DEBUG_MODE,
  SIDEBAR_TAB_FAKE_URL,
  PROCESS_SERP_OVERLAY_MESSAGE,
  DOMAINS_TO_RELEVANT_SLICE,
  CONDITION_KEY,
  AUGMENTATION_ID,
  SYNC_PRIVACY_KEY,
  SPECIAL_URL_JUNK_STRING,
  CUSTOM_UA_STRING,
  URL_PARAM_NO_COOKIE_KEY,
  STRIPPED_RESPONSE_HEADERS,
} from 'constant';

/**
 * ! PROTOTYPE EXTENSIONS
 */

/**
 * Returns the index of the last element in the array where predicate is true, and -1
 * otherwise.
 *
 * @param array The source array to search in
 * @param predicate find calls predicate once for each element of the array, in descending
 * order, until it finds one where predicate returns true. If such an element is found,
 * findLastIndex immediately returns that element index. Otherwise, findLastIndex returns -1.
 *
 * See: https://stackoverflow.com/a/53187807/2826713
 */
if (!Array.prototype['findLastIndex']) {
  Object.defineProperty(Array.prototype, 'findLastIndex', {
    value: function <T>(
      this: Array<any>,
      predicate: (value: T, index: number, obj: T[]) => boolean,
    ) {
      let l = this.length;
      while (l--) {
        if (predicate(this[l], l, this)) return l;
      }
      return -1;
    },
  });
}

/**
 * ! DOM HELPERS
 */

/**
 * Takes a `document` object and a callback function, that will be invoked when the
 * passed `document` object is ready. Current state is determined by `readyState` or the
 * `DOMContentLoaded` event.
 *
 * @param document - The document object what to wait for
 * @param callback - The callback to invoke when the document is ready
 */
export const runFunctionWhenDocumentReady = (document: Document, callback: any) => {
  try {
    if (typeof callback !== 'function') {
      throw new TypeError(`Callback must be callable! Given type is ${typeof callback}`);
    }
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      debug('runFunctionWhenDocumentReady - ready -', callback.name);
      callback();
    } else {
      debug('runFunctionWhenDocumentReady - attach listener -', callback.name);
      document.addEventListener(
        'DOMContentLoaded',
        () => {
          debug('runFunctionWhenDocumentReady - ready by listener -', callback.name);
          callback();
        },
        false,
      );
    }
  } catch (err) {
    debug('runFunctionWhenDocumentReady - error -', callback.name, '\n', err);
  }
};

export const isKnowledgePage = (document: Document) =>
  KP_SELECTORS.map((selector) => !!document.querySelectorAll(selector).length).indexOf(true) > -1;

export const getRankedDomains = (domains: string[]) =>
  [...domains.reduce((a, e) => a.set(e, (a.get(e) || 0) + 1), new Map()).entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([key]) => key);

export const triggerSerpProcessing = (
  loader: TSidebarLoader,
  subtabsOnly = false,
  customLink?: string,
) => {
  const augmentation = loader.sidebarTabs.map(({ augmentation }) => augmentation);
  const createdUrls = loader.sidebarTabs.map(({ url }) => url.href);
  !subtabsOnly &&
    window.top?.postMessage(
      {
        customLink,
        createdUrls,
        augmentation,
        name: PROCESS_SERP_OVERLAY_MESSAGE,
        selector: {
          link: customLink || loader.customSearchEngine.querySelector?.['desktop'],
          featured: loader.customSearchEngine.querySelector?.featured ?? Array(0),
          container: customLink
            ? null
            : loader.customSearchEngine.querySelector?.result_container_selector,
        },
      },
      '*',
    );
  window.top?.postMessage(
    {
      createdUrls,
      augmentation,
      name: PROCESS_SERP_OVERLAY_MESSAGE,
      selector: {
        link: loader.customSearchEngine.querySelector?.['phone'],
        featured: loader.customSearchEngine.querySelector?.featured,
        container: loader.customSearchEngine.querySelector?.result_container_selector,
      },
    },
    '*',
  );
};

/**
 * ! URL MANIPULATION
 */

/**
 * Takes an URL like string and removes the existing protocol and/or "www" prefix.
 *
 * @param urlLike - The URL string to modify
 * @returns The modified URL string
 */
export const removeProtocol = (urlLike: string) => {
  try {
    if (typeof urlLike !== 'string') {
      throw new TypeError(`URL like value must be a string! Given type is ${typeof urlLike}`);
    }
    return urlLike.replace(/^https?:\/\//, '').replace('www.', '');
  } catch (err) {
    debug('removeProtocol - error', err);
    return urlLike;
  }
};

/**
 * Takes an URL string and extracts its hostname, parameter names and full path.
 *
 * @param urlLike - The URL string which properties will be extracted
 * @returns The extracted properties [`hostname`, `params`, `full`]
 */
export const extractUrlProperties = (urlLike: string) => {
  let hostname: string | undefined = undefined;
  let params: string[] | undefined = undefined;
  let full: string | undefined = undefined;
  let fullWithParams: string | undefined = undefined;
  try {
    if (typeof urlLike !== 'string') {
      throw new TypeError(`URL like value must be string! Given type is ${typeof urlLike}`);
    }
    const url =
      urlLike.startsWith('http://') || urlLike.startsWith('https://')
        ? urlLike
        : `https://${urlLike}`;
    const raw = new URL(url);
    hostname = removeProtocol(raw.hostname);
    params = raw.searchParams
      .toString()
      .split('&')
      .map((i) => i.split('=')[0]);
    full = hostname + removeTrailingSlash(raw.pathname);
    fullWithParams = removeProtocol(raw.href);
  } catch (err) {
    debug('extractUrlProperties - error', err, '\nGiven value', urlLike);
  }
  return { hostname, params, full, fullWithParams };
};

export const extractPublication = (urlLike: string) => {
  if (typeof urlLike !== 'string') {
    return urlLike;
  }
  const { hostname, full } = extractUrlProperties(urlLike);
  if (!(hostname && full)) {
    return '';
  }
  const publication = DOMAINS_TO_RELEVANT_SLICE[hostname]
    ? full.match(DOMAINS_TO_RELEVANT_SLICE[hostname])?.[0] ?? hostname
    : null;
  return publication;
};

export const removeTrailingSlash = (urlLike: string) => {
  return urlLike.slice(-1) === '/' ? urlLike.slice(0, urlLike.length - 1) : urlLike;
};

/**
 * Takes a location string and manipulates it by the specified conditions. Future required
 * location modifiers should be placed here.
 *
 * @param location - The Location object
 * @returns
 */
export const replaceLocation = (location: Location): URL | null => {
  try {
    if (location instanceof Location) {
      // ! DEV: extend with required location modifiers if needed
      if (location.href.search(/amazon\.com.*field-keywords/gi) > -1) {
        const { href, search } = location;
        return new URL(`${href.split('/s')[0]}/s?k${search.split('field-keywords')[1]}`);
      }
      return new URL(location.href);
    }
    throw new TypeError(`Location must be a valid location object! Given value is ${location}`);
  } catch (err) {
    debug('replaceLocation - error', err);
    return null;
  }
};

/**
 * Takes a string and replaces any whitespace value with a unique identifier. This encoding is
 * used by the custom sidebar tab URLs, to ensure that spaces are preserved during transformations.
 * ! Should be used with `decodeSpace`.
 *
 * @param stringLike - A string like value
 * @returns Encoded string or original value if it's not string
 * @see decodeSpace
 */
export const encodeSpace = (stringLike: string) => {
  return typeof stringLike === 'string'
    ? stringLike.replace(/[\s]/gi, '[<INSIGHT_SPACE>]')
    : stringLike;
};

/**
 * Takes an encoded string and decodes the unique identifiers to be Unicode escape sequences. The decoding
 * is a second step of the space preserving in sidebar tab URLs. The output will contain `%20` (`space`)
 * instead of `+` characters which preferred during the `encodeURIComponent` method transformation.
 * ! Should be used with `encodeSpace`.
 *
 * @param stringLike - A uniquely encoded string
 * @returns The decoded version of the string or the original value if it's not string'
 * @see encodeSpace
 */
export const decodeSpace = (stringLike: string) => {
  return typeof stringLike === 'string'
    ? stringLike.replace(new RegExp(encodeURIComponent('[<INSIGHT_SPACE>]'), 'gi'), '%20')
    : stringLike;
};

/**
 * Takes an URL like string and return its publication URL or null if there is no matching publication.
 *
 * @param urlLike - The URL like string
 * @returns - The publication URL or null if URL is not a publication
 */
export const getPublicationUrl = (urlLike: string): string | null => {
  if (typeof urlLike !== 'string') {
    return null;
  }
  const { hostname, full } = extractUrlProperties(urlLike);
  if (!(hostname && full)) {
    return '';
  }
  return DOMAINS_TO_RELEVANT_SLICE[hostname]
    ? full.match(DOMAINS_TO_RELEVANT_SLICE[hostname])?.[0] ?? hostname
    : hostname;
};

export const sanitizeUrl = (urlLike: string) => {
  if (typeof urlLike !== 'string') {
    return urlLike;
  }
  return encodeURIComponent(urlLike.replace(/[\s]/gi, '_'));
};

export const getUrlSlices = (url: string) => {
  return (
    extractUrlProperties(url)
      .fullWithParams?.split('/')
      .reduce((slices, slice, index) => {
        if (slice.length) {
          slices[index - 1]
            ? slices.push([slices[index - 1], slice].join('/'))
            : slices.push(slice);
        }
        return slices;
      }, [] as string[])
      .reverse() ?? []
  );
};

/**
 * ! UTILITY
 */

/**
 * A wrapper around the default console statement to print messages only in development environment.
 *
 * @param args - The argument list for the console statement.
 */
export const debug = (...args: any[]) => {
  if (args && Symbol.iterator in Object(args) && IN_DEBUG_MODE) {
    /* eslint-disable-next-line no-console */
    console.log('INSIGHT DEBUG: ', ...args);
  }
};

/**
 * Takes a string and limit as inputs and create an ellipsis according to the given limit.
 * ! Ellipsis: limit the length of the given string and append `...` if longer than allowed.
 *
 * @param stringLike - The string which length will be limited
 * @param limit - Threshold for the string slicing
 * @returns
 */
export const makeEllipsis = (stringLike: string, limit: number) =>
  typeof stringLike === 'string' && stringLike.length > limit
    ? `${stringLike.slice(0, limit)}...`
    : stringLike;

/**
 * Decide if an event's bubbling should be prevented. This used on key events, to prevent Insight
 * handlers being used while user is typing into an input field.
 *
 * @param event - The event under consideration
 * @returns boolean
 */
export const shouldPreventEventBubble = (event: KeyboardEvent) => {
  return (
    !!event.target?.constructor.toString().match('HTMLInputElement') ||
    !!event.target?.constructor.toString().match('HTMLTextAreaElement') ||
    (event.target as HTMLElement).getAttribute('contenteditable') === 'true'
  );
};

/**
 * Takes a string like value as argument and removes the leading non-word characters,
 * emojis or spaces for example.
 *
 * @param stringLike - The string like value
 * @returns
 */
export const removeEmoji = (stringLike: string) =>
  typeof stringLike !== 'string' ? stringLike : stringLike.replace(/^[^\w\s]*/gi, '');

/**
 * Converts a stringified augmentation object to valid Base64 string.
 *
 * @param str - The stringified augmentation
 * @returns The encoded augmentation
 */
export const b64EncodeUnicode = (stringLike: string) => {
  if (typeof stringLike !== 'string') return stringLike;
  const escapedString = encodeURIComponent(stringLike);
  const replacerFunction = (_: string, p1: string) => String.fromCharCode(parseInt(p1, 16));
  return btoa(escapedString.replace(/%([0-9A-F]{2})/g, replacerFunction));
};

// TODO #1 END

// TODO #2: decouple to SidebarManager

export const isSafari = () => {
  const hasVersion = /Version\/(\d{2})/;
  const hasSafari = /Safari\/(\d{3})/;
  const hasChrome = /Chrome\/(\d{3})/;
  const ua = window.navigator.userAgent;
  return (
    ua.match(hasVersion) !== null && ua.match(hasSafari) !== null && ua.match(hasChrome) === null
  );
};

// See: https://stackoverflow.com/a/9851769/2826713
export const isFirefox = () => typeof InstallTrigger !== 'undefined';

export const compareTabs = (a: SidebarTab, b: SidebarTab, serpDomains: string[]) => {
  if (a.augmentation?.id === AUGMENTATION_ID.TRUSTLIST) return 1;
  if (b.augmentation?.id === AUGMENTATION_ID.TRUSTLIST) return -1;

  const aConditions = Array.from(
    new Set(a.augmentation?.conditions.condition_list.map(({ key }) => key)),
  );
  const bConditions = Array.from(
    new Set(b.augmentation?.conditions.condition_list.map(({ key }) => key)),
  );

  const aSuggested = !a.augmentation?.installed;
  const bSuggested = !b.augmentation?.installed;
  const bothSuggested = aSuggested && bSuggested;

  const aIsAny =
    aConditions.indexOf(CONDITION_KEY.SEARCH_ENGINE_IS) > -1 ||
    aConditions.indexOf(CONDITION_KEY.ANY_SEARCH_ENGINE) > -1 ||
    aConditions.indexOf(CONDITION_KEY.ANY_URL) > -1;
  const bIsAny =
    bConditions.indexOf(CONDITION_KEY.SEARCH_ENGINE_IS) > -1 ||
    bConditions.indexOf(CONDITION_KEY.ANY_SEARCH_ENGINE) > -1 ||
    bConditions.indexOf(CONDITION_KEY.ANY_URL) > -1;

  // Special case
  const specialCases = [ AUGMENTATION_ID.REDDIT, AUGMENTATION_ID.HACKER_NEWS ];
  
  for (let specialCase of specialCases) {
    if (a.augmentation.id === specialCase) {
      if (b.augmentation.pinned) { return 1; }
      return -1;
    }
  
    if (b.augmentation.id === specialCase) {
      if (a.augmentation.pinned) { return -1; }
      return 1;
    }
  }

  // Trivial cases that can be handled by checking tab types:
  // Pinned > Installed > Suggested > Any URL
  if (a.augmentation?.pinned && !b.augmentation?.pinned) return -1;
  if (!a.augmentation?.pinned && b.augmentation?.pinned) return 1;
  if (aSuggested && !bSuggested && !aIsAny && bIsAny) return -1;
  if (aSuggested && !bSuggested && aIsAny && !bIsAny) return 1;
  if (!aSuggested && bSuggested && !aIsAny && bIsAny) return -1;
  if (!aSuggested && bSuggested && aIsAny && !bIsAny) return 1;
  if (aSuggested && !bSuggested) return 1;
  if (!aSuggested && bSuggested) return -1;
  if (bothSuggested && aIsAny && !bIsAny) return 1;
  if (bothSuggested && !aIsAny && bIsAny) return -1;
  if (!aIsAny && bIsAny) return -1;
  if (aIsAny && !bIsAny) return 1;

  // Store SERP domains ratings as Record<domain, position>
  const tabRatings: Record<string, number> = Object.create(null);
  Array.from(new Set(serpDomains)).forEach((domain, index) => (tabRatings[domain] = index));

  // Compare matching domains rate according to the corresponding condition types
  // Search Domains > Search Intent Domains
  const aLowestSearchDomains = { name: '', rate: Infinity, domains: a.matchingDomainsCondition };
  const bLowestSearchDomains = { name: '', rate: Infinity, domains: b.matchingDomainsCondition };
  const aLowestIntentDomains = { name: '', rate: Infinity, domains: a.matchingIntent };
  const bLowestIntentDomains = { name: '', rate: Infinity, domains: b.matchingIntent };

  // Check if tabs under consideration are having any matching domains from SERP. If so, set their
  // rating accordingly. We care the lowest rating as the most relevant (higher SERP position).
  const getTabDomainRatings = (domainsA: string[], domainsB: string[]) => {
    domainsA.forEach((domain) => {
      if (tabRatings[domain] < aLowestSearchDomains.rate) {
        aLowestSearchDomains.name = domain;
        aLowestSearchDomains.rate = tabRatings[domain];
      }
    });
    domainsB.forEach((domain) => {
      if (tabRatings[domain] < bLowestSearchDomains.rate) {
        bLowestSearchDomains.name = domain;
        bLowestSearchDomains.rate = tabRatings[domain];
      }
    });
  };

  if (a.matchingDomainsCondition?.length && !b.matchingDomainsCondition?.length) return 1;
  if (!a.matchingDomainsCondition?.length && b.matchingDomainsCondition?.length) return -1;
  if (a.matchingDomainsCondition?.length && b.matchingDomainsCondition?.length) {
    getTabDomainRatings(aLowestSearchDomains.domains ?? [], bLowestSearchDomains.domains ?? []);
    if (aLowestSearchDomains.rate === bLowestSearchDomains.rate) {
      getTabDomainRatings(
        aLowestSearchDomains.domains?.filter((i) => i !== aLowestSearchDomains.name) ?? [],
        bLowestSearchDomains.domains?.filter((i) => i !== bLowestSearchDomains.name) ?? [],
      );
    }
    return aLowestSearchDomains.rate > bLowestSearchDomains.rate ? 1 : -1;
  }

  if (a.matchingIntent?.length && !b.matchingIntent?.length) return 1;
  if (b.matchingIntent?.length && b.matchingIntent?.length) return -1;
  if (a.matchingIntent?.length && b.matchingIntent?.length) {
    const aIntentDomains = (aLowestIntentDomains.domains?.filter((i) => typeof i === 'string') ??
      []) as string[];
    const bIntentDomains = (bLowestIntentDomains.domains?.filter((i) => typeof i === 'string') ??
      []) as string[];
    getTabDomainRatings(aIntentDomains, bIntentDomains);
    if (aLowestIntentDomains.rate === aLowestIntentDomains.rate) {
      getTabDomainRatings(
        aIntentDomains.filter((i) => String(i) !== aLowestIntentDomains.name) ?? [],
        bIntentDomains.filter((i) => i !== bLowestIntentDomains.name) ?? [],
      );
    }
    return aLowestIntentDomains.rate > bLowestIntentDomains.rate ? 1 : -1;
  }
  return -1;
};

/**
 * Takes the list of current sidebar tabs and returns the first index of the tab, that
 * is not a fake hidden tab.
 *
 * @param tabs - The list of sidebar tabs
 * @returns {string} The first valid tab index
 */
export const getFirstValidTabIndex = (tabs: SidebarTab[]) => {
  return (tabs.findIndex(({ url }) => url?.href !== SIDEBAR_TAB_FAKE_URL) + 1).toString();
};

export const getLastValidTabIndex = (tabs: SidebarTab[]) => {
  return (tabs.findLastIndex(({ url }) => url?.href !== SIDEBAR_TAB_FAKE_URL) + 1).toString();
};

export const getStoredUserSettings = async () =>
  await new Promise<Record<string, boolean>>((resolve) =>
    chrome.storage.sync.get([SYNC_PRIVACY_KEY], resolve),
  ).then((result) => ({
    privacy: result?.[SYNC_PRIVACY_KEY],
  }));

export const processCookieString = (header: string) => {
  if (header.search(/__sso\.key/g) > -1) {
    return header;
  }
  let newHeader = header;
  if (newHeader.search(/Secure/) === -1) {
    newHeader = newHeader.concat(' Secure');
  }
  if (newHeader.search(/SameSite=[\w]*/g) === -1) {
    newHeader = newHeader.concat(' SameSite=None');
  } else {
    newHeader = newHeader.replace(/SameSite=[\w]*/g, 'SameSite=None');
  }
  return newHeader;
};

const getStrippedHeaders = (url: string) => {
  const BAN_COOKIES = url.includes(URL_PARAM_NO_COOKIE_KEY);
  BAN_COOKIES && STRIPPED_RESPONSE_HEADERS.push('set-cookie');
  return STRIPPED_RESPONSE_HEADERS;
};

export const applyResponseHeaderModifications = (
  url: string,
  headers: chrome.webRequest.HttpHeader[],
) => {
  return headers
    .filter((header) => !getStrippedHeaders(url).includes(header.name.toLowerCase()))
    .map((header) => {
      if (header.name.toLowerCase() === 'set-cookie') {
        header.value = processCookieString(header.value ?? '');
      }
      if (header.name.toLowerCase() === 'location') {
        try {
          header.value = new URL(header.value?.replace(/^https?:\/\//, 'https://') ?? '').href;
        } catch (e) {
          debug('onHeadersReceived - error', e);
        }
      }
      return header;
    });
};

export const applyRequestHeaderMutations = (
  requestHeaders: chrome.webRequest.HttpHeader[],
  url: string,
  frameId: number,
) =>{
  // Should not modify requests for the main frame
  if (frameId === 0) { return requestHeaders; }

  return requestHeaders?.map((requestHeader) => {
    const isCookieHeader = requestHeader.name.toLowerCase() === 'cookie';
    isCookieHeader && (requestHeader.value = processCookieString(requestHeader.value ?? ''));
    const specialUrl = url.includes(SPECIAL_URL_JUNK_STRING);
    const urlMatchesSearchPattern = specialUrl;
    const shouldRewriteUA =
      urlMatchesSearchPattern &&
      requestHeader.name.toLowerCase() === 'user-agent' &&
      url.search(/ecosia\.org/gi) < 1;
    shouldRewriteUA && (requestHeader.value = CUSTOM_UA_STRING);
    return requestHeader;
  })
}

export const isDark = () => {
  if (window.document.location.hostname.includes('google')) {
    return document.body.getAttribute('data-dt') === '1';
  }

  return matchMedia('(prefers-color-scheme: dark)');
};

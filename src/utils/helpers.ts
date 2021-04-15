import { LUMOS_API_URL, LUMOS_APP_BASE_URL_PROD, LUMOS_APP_BASE_URL_DEBUG } from 'lumos-shared-js';
import {
  KP_SELECTORS,
  IN_DEBUG_MODE,
  ENABLED_AUGMENTATION_TYPES,
  ANY_URL_CONDITION,
  HIDE_TAB_FAKE_URL,
  ANY_URL_CONDITION_MOBILE,
} from 'utils';

export const isMobileDevice = window.navigator.userAgent.toLowerCase().includes('mobi');

const swapUrlsForDebuggingInJsonResponse = <T>(json: T): T => {
  if (IN_DEBUG_MODE) {
    return JSON.parse(
      JSON.stringify(json).replace(LUMOS_APP_BASE_URL_PROD, LUMOS_APP_BASE_URL_DEBUG),
    );
  }
  return json;
};

export const getAPI = async <T>(api: string, params = {}): Promise<T> => {
  const url: URL = new URL(LUMOS_API_URL + api);
  Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));
  try {
    const response = await fetch(url.href, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
    });

    const response_json = await response.json();

    if (response_json) {
      return swapUrlsForDebuggingInJsonResponse<T>(response_json);
    }
  } catch (err) {
    debug('getAPI error', err);
    return null;
  }
};

export const postAPI = async <T>(api: string, params = {}, body = {}): Promise<T> => {
  try {
    const url: URL = new URL(LUMOS_API_URL + api);
    Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));

    const response = await fetch(url.href, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
      body: JSON.stringify(body), // TODO: may move to this later
    });

    const response_json = await response.json();

    if (response_json) {
      return swapUrlsForDebuggingInJsonResponse<T>(response_json);
    }
  } catch (err) {
    debug('postAPI error', err);
    return null;
  }
};

export const runFunctionWhenDocumentReady = (
  document: Document,
  callback: ({ ...args }?: any) => void,
): void => {
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    debug('document is ready right now');
    callback();
  } else {
    debug('document is not ready yet...');
    document.addEventListener(
      'DOMContentLoaded',
      () => {
        debug('DELAYED - document is ready right now');
        callback();
      },
      false,
    );
  }
  return;
};

export const loadPublicFile: (path: string) => Promise<string> = async (path) =>
  new Promise((resolve) => {
    const request = new XMLHttpRequest();
    request.open('GET', chrome.extension.getURL(path));
    request.onload = function () {
      if (request.status >= 200 && request.status <= 400) {
        resolve(request.responseText);
      }
    };
    request.send();
  });

export const removeWww = (s: string) => {
  if (s?.startsWith('www.')) {
    return s.slice(4);
  }
  return s;
};

export const extractUrlProperties = (s: string) => {
  try {
    let url: string;
    if (s.startsWith('http://') || s.startsWith('https://')) url = s;
    else url = `https://${s}`;
    const raw = new URL(url);
    const hostname = removeWww(raw.hostname);
    return {
      hostname,
      params: raw.searchParams
        .toString()
        .split('&')
        .map((i) => i.split('=')[0]),
      full: hostname + raw.pathname,
    };
  } catch (e) {
    debug('extractUrlProperties - error', e);
  }
};

export const removeProtocol = (url: string) => url.replace(/^https?:\/\//, '').replace('www.', '');

export const isKnowledgePage = (document: Document) =>
  KP_SELECTORS.map((selector) => !!document.querySelectorAll(selector).length).indexOf(true) > -1;

export const debug = (...args: any[]) => {
  if (IN_DEBUG_MODE) {
    console.log('LUMOS SHARED DEBUG: ', ...args);
  }
};

export const isSafari = () => {
  const hasVersion = /Version\/(\d{2})/;
  const hasSafari = /Safari\/(\d{3})/;
  const hasChrome = /Chrome\/(\d{3})/;
  const ua = window.navigator.userAgent;
  return (
    ua.match(hasVersion) !== null && ua.match(hasSafari) !== null && ua.match(hasChrome) === null
  );
};

export const getRankedDomains = (domains: string[]) =>
  [...domains.reduce((a, e) => a.set(e, (a.get(e) || 0) + 1), new Map()).entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([key]) => key);

export const compareTabs = (a: SidebarTab, b: SidebarTab, domains: string[]) => {
  const aConditions = Array.from(
    new Set(a.augmentation.conditions.condition_list.map(({ key }) => key)),
  );
  const bConditions = Array.from(
    new Set(b.augmentation.conditions.condition_list.map(({ key }) => key)),
  );
  const aSuggested = !a.augmentation.hasOwnProperty('enabled');
  const bSuggested = !b.augmentation.hasOwnProperty('enabled');
  const bothSuggested = aSuggested && bSuggested;
  const aIsAny =
    aConditions.indexOf(ANY_URL_CONDITION) > -1 ||
    aConditions.indexOf(ANY_URL_CONDITION_MOBILE) > -1;
  const bIsAny =
    bConditions.indexOf(ANY_URL_CONDITION) > -1 ||
    bConditions.indexOf(ANY_URL_CONDITION_MOBILE) > -1;
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
  const tabRatings = Object.create(null);
  const aLowest = { name: '', rate: Infinity, domains: a.matchingDomainsCondition };
  const bLowest = { name: '', rate: Infinity, domains: b.matchingDomainsCondition };
  Array.from(new Set(domains)).forEach((i, index) => (tabRatings[i] = index));
  const compareDomainList = (domainsA: string[], domainsB: string[]) => {
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

export const isAugmentationEnabled = (augmentation: AugmentationObject) =>
  augmentation.conditions.condition_list
    .map((condition) => ENABLED_AUGMENTATION_TYPES.includes(condition.key))
    .indexOf(false) === -1 &&
  augmentation.actions.action_list
    .map((action) => ENABLED_AUGMENTATION_TYPES.includes(action.key))
    .indexOf(false) === -1;

export const b64EncodeUnicode = (str: string) =>
  btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(p1, 16)),
    ),
  );

export const getFirstValidTabIndex = (tabs: SidebarTab[]) => {
  return (tabs.findIndex(({ url }) => url?.href !== HIDE_TAB_FAKE_URL) + 1).toString();
};

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
if (!Array.prototype.hasOwnProperty('findLastIndex')) {
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

export const getLastValidTabIndex = (tabs: SidebarTab[]) => {
  return (tabs.findLastIndex(({ url }) => url?.href !== HIDE_TAB_FAKE_URL) + 1).toString();
};

export const makeEllipsis = (s: string, limit: number) =>
  s.length > limit ? s.slice(0, limit) + '...' : s;

export const shouldPreventEventBubble = (event: KeyboardEvent) => {
  return (
    !!event.target.constructor.toString().match('HTMLInputElement') ||
    !!event.target.constructor.toString().match('HTMLTextAreaElement')
  );
};

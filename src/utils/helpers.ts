import { LUMOS_API_URL, LUMOS_APP_BASE_URL_PROD, LUMOS_APP_BASE_URL_DEBUG } from 'lumos-shared-js';
import { KP_SELECTORS, IN_DEBUG_MODE } from './constants';

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

export const extractHostnameFromUrl = (s: string) => {
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
    debug('extractHostnameFromUrl - error', e);
  }
};

export const isKnowledgePage = (document: Document) =>
  KP_SELECTORS.map((selector) => !!document.querySelectorAll(selector).length).indexOf(true) > -1;

export const debug = (...args: any[]) => {
  if (IN_DEBUG_MODE || window.FORCE_DEBUG) {
    console.log('LUMOS SHARED DEBUG: ', ...args);
  }
};

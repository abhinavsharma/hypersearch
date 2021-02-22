import {
  LUMOS_API_URL,
  debug,
  IN_DEBUG_MODE,
  LUMOS_APP_BASE_URL_PROD,
  LUMOS_APP_BASE_URL_DEBUG,
} from 'lumos-shared-js';

// https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
export const isMobileDevice = window.navigator.userAgent.toLowerCase().includes('mobi');

function swapUrlsForDebuggingInJsonResponse(json: object): object {
  if (IN_DEBUG_MODE) {
    return JSON.parse(
      JSON.stringify(json).replace(LUMOS_APP_BASE_URL_PROD, LUMOS_APP_BASE_URL_DEBUG),
    );
  }
  return json;
}

export async function getAPI(api: string, params = {}): Promise<any> {
  let url: URL = new URL(LUMOS_API_URL + api);
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
      // body: JSON.stringify(params) // TODO: may move to this later
    });

    const response_json = await response.json();

    if (response_json) {
      return swapUrlsForDebuggingInJsonResponse(response_json);
    }
  } catch (err) {
    debug('getAPI error', err);
    return null;
  }
}

export async function postAPI(api: string, params = {}, body = {}): Promise<any> {
  try {
    let url: URL = new URL(LUMOS_API_URL + api);
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
      return swapUrlsForDebuggingInJsonResponse(response_json);
    }
  } catch (err) {
    debug('postAPI error', err);
    return null;
  }
}

export const runFunctionWhenDocumentReady = (document: Document, callback: Function): void => {
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    debug('runFunctionWhenDocumentReady - document is ready right now');
    callback();
  } else {
    debug('runFunctionWhenDocumentReady - document is not ready');
    document.addEventListener(
      'DOMContentLoaded',
      () => {
        debug('runFunctionWhenDocumentReady - document was not ready but DOMContentLoaded now');
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
  if (s?.startsWith("www.")) {
    return s.slice(4);
  }
  return s
}

export const extractHostnameFromUrl = (s: string) => {
  let url: string;
  if (s.startsWith('http://') || s.startsWith('https://')) url = s;
  else url = `https://${removeWww(s)}`;
  const raw = new URL(url);
  return {
    hostname: raw.hostname,
    params: raw.searchParams
      .toString()
      .split('&')
      .map((i) => i.split('=')[0]),
  };
};

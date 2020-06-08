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

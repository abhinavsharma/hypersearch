import { MESSAGES, debug, CLIENT_MESSAGES } from 'lumos-shared-js';
import { loadHiddenMessenger } from './messenger_background';
import { HOSTNAME_TO_PATTERN } from 'lumos-shared-js/src/content/constants_altsearch';
let USER_AGENT_REWRITE_URL_SUBSTRINGS = Object.values(HOSTNAME_TO_PATTERN).map((s) =>
  s.replace('{searchTerms}', ''),
);

export let URL_TO_TAB = {};

debug('installing listener override response headers');
// https://gist.github.com/dergachev/e216b25d9a144914eae2#file-manifest-json
// this is to get around loading pages in iframes that otherwise
// don't want to be loaded in iframes
chrome.webRequest.onHeadersReceived.addListener(
  function (details) {
    let strippedHeaders = ['x-frame-options', 'content-security-policy'];
    return {
      responseHeaders: details.responseHeaders.filter(
        (responseHeader) => !strippedHeaders.includes(responseHeader.name.toLowerCase()),
      ),
    };
  },
  {
    urls: ['<all_urls>'],
  },
  ['blocking', 'responseHeaders'],
);

debug('installing listener for overriding request headers');
chrome.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    return {
      requestHeaders: details.requestHeaders.map((requestHeader) => {
        // this is for the search result iframes loaded in the sidebar, we pretend the browser is mobile for them
        let urlMatchesSearchPattern =
          USER_AGENT_REWRITE_URL_SUBSTRINGS.filter((substring) => details.url.includes(substring))
            .length > 0;
        if (
          urlMatchesSearchPattern &&
          details.frameId > 0 &&
          requestHeader.name.toLowerCase() === 'user-agent'
        ) {
          requestHeader.value =
            'Mozilla/5.0 (Linux; Android 7.0; SM-G930V Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.125 Mobile Safari/537.36';
        }
        return requestHeader;
      }),
    };
  },
  { urls: ['<all_urls>'] },
  ['blocking', 'requestHeaders'],
);

debug('installing listener for onUpdated');
function onUpdatedListener(tabId, changeInfo, tab) {
  debug('function call - onUpdatedListener:', tabId, changeInfo, tab);
  if (changeInfo.url) {
    debug('changeInfo has URL:', changeInfo.url);
    chrome.tabs.sendMessage(tabId, {
      message: MESSAGES.BROWSERBG_BROWSERFG_URL_UPDATED,
      data: { url: changeInfo.url },
    });
  }
  URL_TO_TAB[tab.url] = tabId;
}
window.onload = function () {
  loadHiddenMessenger(document, window);
};

chrome.tabs.onUpdated.addListener(onUpdatedListener);

chrome.browserAction.onClicked.addListener(function (tab) {
  debug(
    'message from background to content script',
    CLIENT_MESSAGES.BROWSER_CONTENT_FLIP_NON_SERP_CONTAINER,
  );
  chrome.tabs.sendMessage(tab.id, {
    data: {
      command: CLIENT_MESSAGES.BROWSER_CONTENT_FLIP_NON_SERP_CONTAINER,
    },
  });
});

chrome.browserAction.setBadgeBackgroundColor({ color: 'black' });

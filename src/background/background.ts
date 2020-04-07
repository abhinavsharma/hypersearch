import { MESSAGES, debug } from "lumos-shared-js"
import {loadHiddenMessenger } from "./messenger_background";

export let URL_TO_TAB = {}

debug("installing listener for header interception")
// https://gist.github.com/dergachev/e216b25d9a144914eae2#file-manifest-json
// this is to get around loading pages in iframes that otherwise
// don't want to be loaded in iframes
chrome.webRequest.onHeadersReceived.addListener(
    function (details) {
      for (var i = 0; i < details.responseHeaders.length; ++i) {
        if (details.responseHeaders[i].name.toLowerCase() == 'x-frame-options') {
          details.responseHeaders.splice(i, 1);
          return {
            responseHeaders: details.responseHeaders
          };
        }
      }
    }, {
      urls: ["<all_urls>"]
    }, ["blocking", "responseHeaders"]
);

debug("installing listener for onUpdated")
function onUpdatedListener(tabId, changeInfo, tab){
    debug("function call - onUpdatedListener:", tabId, changeInfo, tab)
    if (changeInfo.url) {
        debug("changeInfo has URL:", changeInfo.url)
        chrome.tabs.sendMessage( tabId, {
            message: MESSAGES.BROWSERBG_BROWSERFG_URL_UPDATED,
            data: {'url': changeInfo.url}
        })
    }
    URL_TO_TAB[tab.url] = tabId
}
window.onload = function() {
  loadHiddenMessenger(document, window);
}

chrome.tabs.onUpdated.addListener(onUpdatedListener);

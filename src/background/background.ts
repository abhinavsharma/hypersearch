import { MESSAGES, debug } from "../shared/constants"

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
}

chrome.tabs.onUpdated.addListener(onUpdatedListener);

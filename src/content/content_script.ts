import { MESSAGES, debug } from "../shared/constants";
import { loadOrUpdateDrawer } from "./drawer";
import { loadOrUpdateSidebar } from "./sidebar";
import { modifyPage } from "./modify";

debug("executing content script on", location.href)

function main() {
    handleUrlUpdated(new URL(location.href))
}

function handleUrlUpdated(url: URL) {
    debug("function call - handleUrlUpdated:", url)
    // load or update the drawer
    loadOrUpdateDrawer(url)
    // load or update the sidebar
    loadOrUpdateSidebar(url)
    // load or update inline content
    modifyPage(url)
}

debug("messages - setting up listener for bg messages")
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    debug("message received from background: ", msg.message)
    if (msg.message === MESSAGES.BROWSERBG_BROWSERFG_URL_UPDATED) {
        handleUrlUpdated(new URL(msg.data.url))
    } else {
        sendResponse('Color message is none.');
    }
});

// Structure of the content script
// Loads a sidebar hidden
// Loads a drawer hidden

// Whenever the url changes (sync or async), calls APIs drawer and sidebar
// When sidebar API returns true, 

main();
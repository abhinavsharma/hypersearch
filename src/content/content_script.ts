import { debug, MESSAGES, modifyPage } from "lumos-shared-js";
import { loadOrUpdateSidebar } from "./sidebar";
import {nativeBrowserPostMessageToReactApp, nativeBrowserAddReactAppListener } from "./messenger_content";

debug("executing content script on", location.href)
function main(window: Window, document: Document, location: Location): void {
    // mutates document
    handleUrlUpdated(window, document, new URL(location.href))
}

function handleUrlUpdated(window: Window, document: Document, url: URL): void {
    var user = null;
    var userMemberships = [];
    debug("function call - handleUrlUpdated:", url)
    
    // load or update the drawer
    // loadOrUpdateDrawer(document, url)

    document.addEventListener("DOMContentLoaded", () => { 
        debug("DOMContentLoaded:", url)
        // check if user is logged in
        nativeBrowserAddReactAppListener({
            "window": window,
            "message": "isUserLoggedIn",
            "callback": (msg) => {
                let data = msg.data;
                console.log('isUserLoggedIn', data)
                user = data.user
                userMemberships = data.memberships
                // load or update the sidebar
                loadOrUpdateSidebar(document, url, userMemberships);
                modifyPage(url, window, document, nativeBrowserPostMessageToReactApp, nativeBrowserAddReactAppListener, userMemberships);
            }
        })
        nativeBrowserPostMessageToReactApp({"command": "isUserLoggedIn", "data": {origin: url.href}})
        // load or update inline content
    }, false)
    
}
// Structure of the content script
// Loads a sidebar hidden
// Loads a drawer hidden

// Whenever the url changes (sync or async), script is rerun
// When sidebar API returns true, 

main(window, document, location);

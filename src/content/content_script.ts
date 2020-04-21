import { debug, MESSAGES, modifyPage } from "lumos-shared-js";
import { loadOrUpdateSidebar, populateSidebar, createSidebar } from "./sidebar";
import {nativeBrowserPostMessageToReactApp, nativeBrowserAddReactAppListener } from "./messenger_content";
import { getAlternateSearchEnginesFromSerp, serpUrlToSearchText } from "lumos-shared-js/src/content/modify_serp";

debug("executing content script on", location.href)
function main(window: Window, document: Document, location: Location): void {
    // mutates document
    handleUrlUpdated(window, document, new URL(location.href))
}

function handleUrlUpdated(window: Window, document: Document, url: URL): void {
    var name = null;
    var user = null;
    var userMemberships = [];
    let lastModifiedHref: string = null;
    debug("function call - handleUrlUpdated:", url)
    
    // load or update the drawer
    // loadOrUpdateDrawer(document, url)

    nativeBrowserAddReactAppListener({
        "window": window,
        "message": "isUserLoggedIn",
        "callback": (msg) => {
            let data = msg.data;
            debug('isUserLoggedIn', data)
            name = data.name
            user = data.user
            userMemberships = data.memberships
            // load or update the sidebar
            if (url.href !== lastModifiedHref) {
                lastModifiedHref = url.href
                const searchText = serpUrlToSearchText(url);
                if (searchText) {
                    loadOrUpdateSidebar(document, url, userMemberships);
                }
                document.addEventListener("DOMContentLoaded", () => { 
                    debug("DOMContentLoaded:", url)
                    modifyPage(url, window, document, nativeBrowserPostMessageToReactApp, nativeBrowserAddReactAppListener, userMemberships, name);
                }, false)
            }
        }
    })
    nativeBrowserPostMessageToReactApp({"command": "isUserLoggedIn", "data": {origin: url.href}})

    document.addEventListener("DOMContentLoaded", () => { 
        debug("DOMContentLoaded:", url)
        // check if user is logged in
        
        // load or update inline content
    }, false)
    
}
// Structure of the content script
// Loads a sidebar hidden
// Loads a drawer hidden

// Whenever the url changes (sync or async), script is rerun
// When sidebar API returns true, 

main(window, document, location);

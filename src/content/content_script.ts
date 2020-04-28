import { debug, modifyPage } from "lumos-shared-js";
import { loadOrUpdateSidebar } from "./sidebar";
import {nativeBrowserPostMessageToReactApp, nativeBrowserAddReactAppListener } from "./messenger_content";
import { serpUrlToSearchText } from "lumos-shared-js/src/content/modify_serp";
import { postAPI } from "./helpers";
import uuidv1 = require('uuid/v1');

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
                if (document.readyState === 'loading') {
                    document.addEventListener("DOMContentLoaded", () => { 
                        debug("DOMContentLoaded:", url)
                        modifyPage(url, window, document, nativeBrowserPostMessageToReactApp, nativeBrowserAddReactAppListener, userMemberships, name);
                    }, false)
                } else {
                    debug("DOM Content already Loaded:", url)
                    modifyPage(url, window, document, nativeBrowserPostMessageToReactApp, nativeBrowserAddReactAppListener, userMemberships, name);
                }
                logPageVisit(userMemberships, url).then(() => {
                    debug("loggedPageVisit: ", url)
                })
            }
        }
    })
    nativeBrowserPostMessageToReactApp({"command": "isUserLoggedIn", "data": {origin: url.href}})
}

async function logPageVisit(userMemberships: any, url: URL) {
    for (const network of userMemberships) {
        let log_id = uuidv1(); 
        await postAPI('logger', {url: url.href}, {
            'id': log_id,
            'url': url.href,
            'publisher': url.hostname,
            'timestamp': Date.now(),
            'network': network.id
        })
    }
}
// Structure of the content script
// Loads a sidebar hidden
// Loads a drawer hidden

// Whenever the url changes (sync or async), script is rerun
// When sidebar API returns true, 

main(window, document, location);

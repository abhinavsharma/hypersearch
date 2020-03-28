import { CONTENT_PAGE_ELEMENT_ID_LUMOS_DRAWER, debug, STYLE_WIDTH_SIDEBAR, STYLE_HEIGHT_DRAWER } from "../shared/constants"
import { getAPI } from "./content_shared";
import { IDrawerResponse } from "../shared/interfaces";

function showDrawer() {
    let drawerIframe = document.getElementById(CONTENT_PAGE_ELEMENT_ID_LUMOS_DRAWER) as HTMLIFrameElement;
    drawerIframe.style.visibility = "visible"
}

function hideDrawer() {
    let drawerIframe = document.getElementById(CONTENT_PAGE_ELEMENT_ID_LUMOS_DRAWER) as HTMLIFrameElement;
    drawerIframe.style.visibility = "hidden"
}

function isDrawerLoaded(document) {
    debug("function call - isDrawerLoaded", document)
    return !!document.getElementById(CONTENT_PAGE_ELEMENT_ID_LUMOS_DRAWER);
}

function createDrawer(document: Document) {
    debug("function call - createDrawer")
    let iframe = document.createElement('iframe');
    iframe.id = CONTENT_PAGE_ELEMENT_ID_LUMOS_DRAWER;
    document.body.appendChild(iframe);
}

function getDrawerUrl(url: URL) {
    debug("function call - getDrawerUrl", url);
    // TODO
    return url;
}

function handleDrawerResponse(url: URL, document: Document, response_json: IDrawerResponse) {
    if (!isDrawerLoaded(document)) {
        createDrawer(document)
    }

    const drawerIframe = document.getElementById(CONTENT_PAGE_ELEMENT_ID_LUMOS_DRAWER) as HTMLIFrameElement;
    if (!drawerIframe) {
        debug("drawer iframe not found in document", document)
        return;
    }
    drawerIframe.setAttribute("style", `
        position: fixed;
        bottom: 0;
        height: ${STYLE_HEIGHT_DRAWER};
        width: 100%;
        padding-right: ${STYLE_WIDTH_SIDEBAR}
        background: white;
        border: none
        z-index: 2147483648;
    `)
    hideDrawer()

    if (response_json && response_json.show_drawer) {
        let drawerIframe = document.getElementById(CONTENT_PAGE_ELEMENT_ID_LUMOS_DRAWER) as HTMLIFrameElement;
        let drawerHref = response_json.url
        showDrawer();
        drawerIframe.src = drawerHref
    }
}

export function loadOrUpdateDrawer(document: Document, url: URL) {
    getAPI('drawer', {url: url.href}).then(function(response_json) {
        handleDrawerResponse(url, document, response_json)
    })
}
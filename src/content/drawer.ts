import { CONTENT_PAGE_ELEMENT_ID_LUMOS_DRAWER, debug, STYLE_WIDTH_SIDEBAR, STYLE_HEIGHT_DRAWER, IDrawerResponse } from "lumos-shared-js"
import { getAPI } from "./helpers";

function showDrawer(document): void {
    let drawerIframe = document.getElementById(CONTENT_PAGE_ELEMENT_ID_LUMOS_DRAWER) as HTMLIFrameElement;
    drawerIframe.style.visibility = "visible"
}

function hideDrawer(document): void {
    let drawerIframe = document.getElementById(CONTENT_PAGE_ELEMENT_ID_LUMOS_DRAWER) as HTMLIFrameElement;
    drawerIframe.style.visibility = "hidden"
}

function isDrawerLoaded(document): boolean {
    debug("function call - isDrawerLoaded", document)
    return !!document.getElementById(CONTENT_PAGE_ELEMENT_ID_LUMOS_DRAWER);
}

function createDrawer(document: Document): void {
    debug("function call - createDrawer")
    let iframe = document.createElement('iframe');
    iframe.id = CONTENT_PAGE_ELEMENT_ID_LUMOS_DRAWER;
    document.body.appendChild(iframe);
}

function handleDrawerResponse(document: Document, response_json: IDrawerResponse): void {
    // mutates drawer
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
    hideDrawer(document)

    if (response_json && response_json.show_drawer) {
        let drawerIframe = document.getElementById(CONTENT_PAGE_ELEMENT_ID_LUMOS_DRAWER) as HTMLIFrameElement;
        let drawerHref = response_json.url
        showDrawer(document);
        drawerIframe.src = drawerHref
    }
}

export function loadOrUpdateDrawer(document: Document, url: URL): void {
    getAPI('drawer', {url: url.href}).then(function(response_json) {
        handleDrawerResponse(document, response_json)
    })
}
import { CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR, debug, STYLE_COLOR_BORDER, STYLE_PADDING_SMALL, STYLE_WIDTH_SIDEBAR, STYLE_ZINDEX_MAX, STYLE_COLOR_LINK } from "../shared/constants"
import { getAPI } from "./content_shared";
import { ISidebarResponseArrayObject, ISidebarTab } from '../shared/interfaces'

function showSidebar() {
    let sidebarContainer = document.getElementById(CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR);
    sidebarContainer.style.width = STYLE_WIDTH_SIDEBAR
}

function isVisible() {
    let sidebarContainer = document.getElementById(CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR);
    return sidebarContainer.style.width == STYLE_WIDTH_SIDEBAR ? true : false;
}

function hideSidebar() {
    let sidebarContainer = document.getElementById(CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR);
    sidebarContainer.style.width = "0px";
}

function isSidebarLoaded(document) {
    debug("function call - isSidebarLoaded", document)
    return !!document.getElementById(CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR);
}

function createSidebar(document: Document) {
    debug("function call - createSidebar")
    let sidebarContainer = document.createElement('div');
    sidebarContainer.id = CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR;

    sidebarContainer.setAttribute("style", `
        position: fixed;
        right: 0;
        top: 0;
        width: 0;
        bottom: 0;
        height: 100%;
        z-index: ${STYLE_ZINDEX_MAX};
        background: white;
        border-left: 1px solid ${STYLE_COLOR_BORDER};
        transition-property: all;
        transition-duration: .5s;
        transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
    `)
    document.body.appendChild(sidebarContainer);
    hideSidebar()
}

function getSidebarUrl(url: URL) {
    debug("function call - getSidebarUrl", url);
    // TODO
    return url;
}

function populateSidebar(sidebarTabs: Array<ISidebarTab>) {
    debug("function call - populateSidebar: ", sidebarTabs)
    let container = document.getElementById(CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR)
    if (!container) {
        debug("did not find sidebar element")
    }

    let tabsContainer = document.createElement("div")
    tabsContainer.setAttribute("style", `
        background-color: ${STYLE_COLOR_BORDER};
    `)
    let contentContainer = document.createElement("div")
    contentContainer.setAttribute("style", `
        height: 100%;
    `)

    sidebarTabs.forEach(function (sidebarTab: ISidebarTab) {
        
        // switcher element
        let tabElement = document.createElement("span");
        tabElement.innerText = sidebarTab.title
        tabElement.setAttribute("style", `
            display: inline-block;
            padding: ${STYLE_PADDING_SMALL};
            border-right: 1px solid ${STYLE_COLOR_BORDER};
            color: ${STYLE_COLOR_LINK};
            cursor: pointer
        `)
        
        // content element
        let contentIframe = document.createElement("iframe")
        contentIframe.src = sidebarTab.url.href
        contentIframe.setAttribute("style", `
            height: 100%;
            border: none;
        `)

        if (sidebarTab.default) {
            contentIframe.style.visibility = 'inherit'
            contentIframe.style.height = '100%'
            tabElement.style.backgroundColor = 'white'
            contentIframe.addEventListener("load", function() {showSidebar()})
        } else {
            contentIframe.style.visibility = 'hidden'
        }
        
        //  toggling click handler
        tabElement.addEventListener("click", function(e) { 
            for(let child = tabsContainer.firstChild; child !== null; child = child.nextSibling) {
                let castedChild = <HTMLElement> child;
                castedChild.style.backgroundColor = STYLE_COLOR_BORDER
            }
            for(let child = contentContainer.firstChild; child !== null; child = child.nextSibling) {
                let castedChild = <HTMLElement> child;
                castedChild.style.visibility = 'hidden'
                castedChild.style.height = '0'
            }
            var clickedTab = <HTMLElement> (e.target || e.srcElement);
            
            clickedTab.style.backgroundColor = 'white'
            contentIframe.style.visibility = 'inherit'
            contentIframe.style.height = '100%'
        })

        tabsContainer.appendChild(tabElement)
        contentContainer.appendChild(contentIframe)
    })

    // For dismissing the sidebar
    let dismissButton = document.createElement("div");
    dismissButton.appendChild(document.createTextNode("×"));
    dismissButton.setAttribute("style", `
        float: right;
        padding-top: ${STYLE_PADDING_SMALL};
        padding-right: ${STYLE_PADDING_SMALL};
        cursor: pointer;
    `)
    dismissButton.addEventListener("click", function(e) {
        if (isVisible()) {
            hideSidebar()
        } else {
            showSidebar()
        }
    })
    tabsContainer.appendChild(dismissButton)

    container.appendChild(tabsContainer)
    container.appendChild(contentContainer)
}

function handleSubtabResponse(response_json: Array<ISidebarResponseArrayObject>) {
    // setup as many tabs as in response
    if (!(response_json && response_json.length > 1)) {
        debug("handleSubtabResponse - response json is invalid")
        return;
    }

    let sidebarTabs: Array<ISidebarTab> = []

    // sometimes the api specifies a default tab
    // if not, since this is web, we will choose the first as a default
    let wasThereADefault = false;
    response_json.forEach(function(responseTab: ISidebarResponseArrayObject) {
        if (responseTab.url === document.location.href) {
            return;
        }
        if(responseTab.default) {
            wasThereADefault = true;
        }
        let sidebarTab: ISidebarTab = {
            title: responseTab.title,
            url: new URL(responseTab.url),
            default: responseTab.default
        }
        sidebarTabs.push(sidebarTab);
    })
    if (!wasThereADefault) {
        sidebarTabs[0].default = true
    }

    populateSidebar(sidebarTabs)
}

function updateSidebarUrl(document: Document, url: URL) {
    debug("function call - updateSidebarUrl:", url)
    let sidebarContainer = document.getElementById(CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR) as HTMLIFrameElement;
    if (!sidebarContainer) {
        debug("sidebar iframe not found in document", document)
        return;
    }
    
    getAPI('subtabs', {url: url.href}).then(handleSubtabResponse)
}

export function loadOrUpdateSidebar(url: URL) {
    if (!isSidebarLoaded(document)) {
        createSidebar(document)
    }
    updateSidebarUrl(document, url)
}

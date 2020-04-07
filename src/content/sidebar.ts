import { ISidebarResponseArrayObject, ISidebarTab, CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR, debug, STYLE_COLOR_BORDER, STYLE_PADDING_SMALL, STYLE_WIDTH_SIDEBAR, STYLE_ZINDEX_MAX, STYLE_WIDTH_SIDEBAR_TAB, STYLE_SIDEBAR_HIDER_X_OFFSET, STYLE_SIDEBAR_HIDER_Y_OFFSET, STYLE_SIDEBAR_TOGGLER_WIDTH, STYLE_FONT_SIZE_SMALL, STYLE_BORDER_RADIUS_PILL, STYLE_COLOR_LUMOS_GOLD_SOLID, CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR_SHOW, CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR_HIDE, STYLE_SIDEBAR_SHOWER_X_OFFSET, STYLE_FONT_SIZE_LARGE, STYLE_PADDING_MEDIUM, STYLE_COLOR_TEXT, STYLE_SIDEBAR_SHOWER_Y_OFFSET, STYLE_PADDING_LARGE, STYLE_WIDTH_SIDEBAR_TAB_LEFT, STYLE_WIDTH_SIDEBAR_TAB_RIGHT, CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR_OVERLAY, CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR_CONTENT, CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR_TABS } from "lumos-shared-js"
import { postAPI, runFunctionWhenDocumentReady } from "./helpers";

const ANIMATE_TIME_SHOW_CONTENT_DELAY = 350;

function isVisible(document: Document): boolean {
    let sidebarContainer = document.getElementById(CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR);
    return sidebarContainer.style.width == STYLE_WIDTH_SIDEBAR ? true : false;
}

function flipSidebar(document: Document, force?: string): void {

    let sidebarContainer = document.getElementById(CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR);
    let sidebarOverlayContainer = document.getElementById(CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR_OVERLAY)
    let showButton = document.getElementById(CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR_SHOW);
    let hideButton = document.getElementById(CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR_HIDE);
    let tabsContainer = document.getElementById(CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR_TABS)
    let contentContainer = document.getElementById(CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR_CONTENT)

    if ((force && force == 'hide') || isVisible(document)) {
        // hide sidebar
        if (tabsContainer && contentContainer) {
            tabsContainer.style.visibility = "hidden"
            contentContainer.style.visibility = "hidden"    
        }
        
        sidebarContainer.style.visibility = "hidden";
        showButton.style.visibility = "visible";
        hideButton.style.visibility = "hidden";
        sidebarContainer.style.width = "0px";
        sidebarOverlayContainer.style.display = "none"
    } else {
        // show sidebar
        sidebarContainer.style.visibility = "visible";
        showButton.style.visibility = "hidden";
        sidebarOverlayContainer.style.display = "block"
        sidebarContainer.style.width = STYLE_WIDTH_SIDEBAR;
        if (tabsContainer && contentContainer) {
            setTimeout(() => {
                tabsContainer.style.visibility = "visible"
                contentContainer.style.visibility = "visible"   
            }, ANIMATE_TIME_SHOW_CONTENT_DELAY)
        }
    }
}

function isSidebarLoaded(document): boolean {
    debug("function call - isSidebarLoaded", document)
    return !!document.getElementById(CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR);
}

function createSidebar(document: Document) {
    debug("function call - createSidebar")

    let sidebarOverlayContainer = document.createElement('div');
    sidebarOverlayContainer.id = CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR_OVERLAY;
    sidebarOverlayContainer.setAttribute("style", `
        position: fixed;
        z-index: ${STYLE_ZINDEX_MAX};
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: black;
        opacity: 0.75;
        transition: opacity 0.5s ease;
        display: none;
    `)
    sidebarOverlayContainer.addEventListener("click", () => {flipSidebar(document)})
    document.body.appendChild(sidebarOverlayContainer)
    let sidebarContainer = document.createElement('div');
    sidebarContainer.id = CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR;

    sidebarContainer.setAttribute("style", `
        position: fixed;

        /* side  of screen */
        left: 0;
        border-right: 1px solid ${STYLE_COLOR_BORDER};

        top: 0;
        width: 0;
        bottom: 0;
        height: 100%;
        z-index: ${STYLE_ZINDEX_MAX};
        background: white;
        transition-property: all;
        transition-duration: .5s;
        transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
    `)

    // For dismissing the sidebar
    let sidebarToggler = document.createElement("div");
    let sidebarTogglerWhenHidden = document.createElement("div");
    let lumosLogoTitle = document.createElement("div")
    let lumosLogo = document.createElement("img")
    lumosLogo.src = chrome.extension.getURL('logo128.png');
    lumosLogoTitle.setAttribute("style", `
        border-bottom: 0.5px solid #bbb;
    `)
    lumosLogo.setAttribute("style", `
        display: inline-block;
        margin-left: ${STYLE_PADDING_SMALL};
        width: ${STYLE_WIDTH_SIDEBAR_TAB_LEFT};
    `)
    let lumosTitle = document.createElement("div")
    lumosTitle.setAttribute("style", `
        display: inline-block;
        vertical-align: super;
        max-width: ${STYLE_WIDTH_SIDEBAR_TAB_RIGHT};
    `)
    lumosTitle.appendChild(document.createTextNode("Alternatives (press L)"))
    lumosLogoTitle.appendChild(lumosLogo)
    lumosLogoTitle.appendChild(lumosTitle)

    sidebarTogglerWhenHidden.appendChild(lumosLogoTitle)
    sidebarTogglerWhenHidden.id = CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR_SHOW

    let sidebarTogglerWhenVisible = document.createElement("div");
    sidebarTogglerWhenVisible.appendChild(document.createTextNode("×"));
    sidebarTogglerWhenVisible.id = CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR_HIDE

    sidebarToggler.setAttribute("style", `
        cursor: pointer;
    `)

    sidebarTogglerWhenHidden.setAttribute("style", `
        position: fixed;
        left: ${STYLE_SIDEBAR_SHOWER_X_OFFSET};
        bottom: ${STYLE_SIDEBAR_SHOWER_Y_OFFSET};
        max-width: ${STYLE_SIDEBAR_TOGGLER_WIDTH};
        padding: ${STYLE_PADDING_SMALL} ${STYLE_PADDING_LARGE};
        background: ${STYLE_COLOR_LUMOS_GOLD_SOLID};
        border-radius: ${STYLE_BORDER_RADIUS_PILL};
        font-size: ${STYLE_FONT_SIZE_SMALL};
        z-index: ${STYLE_ZINDEX_MAX};
        cursor: pointer;
        visibility: hidden;
    `)
    sidebarTogglerWhenVisible.setAttribute("style", `
        position: absolute;
        right: ${STYLE_SIDEBAR_HIDER_X_OFFSET};
        top: ${STYLE_SIDEBAR_HIDER_Y_OFFSET};
        
        border: 1px solid ${STYLE_COLOR_BORDER};
        background: white;
        border-radius: 50%;
        font-size: ${STYLE_FONT_SIZE_LARGE};
        padding: ${STYLE_PADDING_MEDIUM}
    `)
    
    sidebarTogglerWhenHidden.addEventListener("click", function(e) {
        flipSidebar(document)
    })
    sidebarTogglerWhenVisible.addEventListener("click", function(e) {
        flipSidebar(document)
    })

    sidebarToggler.appendChild(sidebarTogglerWhenVisible)
    document.body.appendChild(sidebarTogglerWhenHidden)

    document.onkeypress = function (e: KeyboardEvent) {
        if (e.key === "l" || e.key === "L") {
            if (!(document.activeElement.nodeName == 'TEXTAREA'
                || document.activeElement.nodeName == 'INPUT'
                || (document.activeElement.nodeName == 'DIV'))) {
                flipSidebar(document)
            }
        }
    };

    sidebarContainer.appendChild(sidebarToggler)

    document.body.appendChild(sidebarContainer);
    flipSidebar(document, 'hide')

    // special case: by default hiding the sidebar will show this toggle but wem hide it until
    // content is populated
    sidebarTogglerWhenHidden.style.visibility = 'hidden'
}

function populateSidebar(document: Document, sidebarTabs: Array<ISidebarTab>): void {
    // mutates document

    // check if sidebar has been created
    debug("function call - populateSidebar: ", sidebarTabs)
    let container = document.getElementById(CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR)
    if (!container) {
        debug("did not find sidebar element")
    }

    // build a ui to switch between sub-tabs within the sidebar
    let tabsContainer = document.createElement("div")
    tabsContainer.id = CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR_TABS
    tabsContainer.setAttribute("style", `
        background-color: ${STYLE_COLOR_BORDER};
        border-bottom: 1px solid ${STYLE_COLOR_BORDER};
    `)
    let contentContainer = document.createElement("div")
    contentContainer.id = CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR_CONTENT
    contentContainer.setAttribute("style", `
        height: 100%;
    `)

    // create a ui to preview the sidebar when it is hidden
    let sidebarTogglerWhenHidden = document.getElementById(CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR_SHOW)
    Array.from(sidebarTogglerWhenHidden.getElementsByClassName("sidebar_preview_item")).forEach((e) => {
        e.parentNode.removeChild(e);
    })
    // special case: we only show this once we are sure there are alternative pages
    sidebarTogglerWhenHidden.style.visibility = 'visible'

    // populate the sidebar and preview UIs with content from the response
    sidebarTabs.forEach(function (sidebarTab: ISidebarTab) {

        // preview element that lives outside the sidebar
        let sidebarPreviewItem = document.createElement("div");
        sidebarPreviewItem.appendChild(document.createTextNode(sidebarTab.title));
        sidebarPreviewItem.setAttribute("style", `
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            padding: ${STYLE_PADDING_SMALL} 0;
        `)
        sidebarPreviewItem.classList.add('sidebar_preview_item')
        sidebarTogglerWhenHidden.appendChild(sidebarPreviewItem);
        
        // tabs that switch between different subtabs
        let tabElement = document.createElement("span");
        tabElement.innerText = sidebarTab.title
        tabElement.setAttribute("style", `
            display: inline-block;
            font-size: ${STYLE_FONT_SIZE_SMALL};
            padding: ${STYLE_PADDING_SMALL};
            text-align: center;
            border-right: 1px solid ${STYLE_COLOR_BORDER};
            color: ${STYLE_COLOR_TEXT};
            width: ${STYLE_WIDTH_SIDEBAR_TAB};
            cursor: pointer;
        `)
        
        // load the urls of the subtabs into iframes
        let contentIframe = document.createElement("iframe")
        contentIframe.src = sidebarTab.url.href
        contentIframe.setAttribute("style", `
            height: 100%;
            border: none;
        `)

        // set the default subtab
        if (sidebarTab.default) {
            contentIframe.style.visibility = 'inherit'
            contentIframe.style.height = '100%'
            tabElement.style.backgroundColor = 'white'
        } else {
            contentIframe.style.visibility = 'hidden'
        }
        
        //  enable switching between tabs
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

        // insert tab and content into container
        tabsContainer.appendChild(tabElement)
        contentContainer.appendChild(contentIframe)
    })

    container.appendChild(tabsContainer)
    container.appendChild(contentContainer)
}

function handleSubtabResponse(url: URL, document: Document, response_json: Array<ISidebarResponseArrayObject>): void {
    // mutates document
    debug("function call - handleSubtabResponse", url)

    if (!isSidebarLoaded(document)) {
        createSidebar(document)
    }

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
    populateSidebar(document, sidebarTabs)
}

export function loadOrUpdateSidebar(document: Document, url: URL, userMemberships: string[]): void {
    // mutates document
    if (localStorage.getItem('userMemberships') === null) {
        // TODO: handle logged out case
        return
    }
    postAPI('subtabs', {url: url.href}, {networks: userMemberships}).then(function(response_json: Array<ISidebarResponseArrayObject>) { 
        runFunctionWhenDocumentReady(document, () => {
            handleSubtabResponse(url, document, response_json)
        })
    })
}

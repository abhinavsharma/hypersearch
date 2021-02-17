import {
  ISidebarTab,
  CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR,
  debug,
  STYLE_COLOR_BORDER,
  STYLE_PADDING_SMALL,
  STYLE_WIDTH_SIDEBAR,
  STYLE_ZINDEX_MAX,
  STYLE_WIDTH_SIDEBAR_TAB,
  STYLE_SIDEBAR_HIDER_X_OFFSET,
  STYLE_SIDEBAR_HIDER_Y_OFFSET,
  STYLE_SIDEBAR_TOGGLER_WIDTH,
  STYLE_FONT_SIZE_SMALL,
  STYLE_BORDER_RADIUS_PILL,
  CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR_SHOW,
  CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR_HIDE,
  STYLE_FONT_SIZE_LARGE,
  STYLE_PADDING_MEDIUM,
  STYLE_COLOR_TEXT,
  STYLE_SIDEBAR_SHOWER_Y_OFFSET,
  STYLE_WIDTH_SIDEBAR_TAB_RIGHT,
  CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR_OVERLAY,
  CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR_CONTENT,
  CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR_TABS,
  STYLE_PADDING_XLARGE,
  LUMOS_APP_BASE_URL,
  STYLE_COLOR_UNSELECTED_TAB,
  CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR_PREVIEW_CONTAINER,
  RESET_CSS,
  MESSAGES,
  serpUrlToSearchText,
  STYLE_FONT_SIZE_MEDIUM,
  STYLE_COLOR_TEXT_LIGHT,
} from 'lumos-shared-js';
import { loadPublicFile, runFunctionWhenDocumentReady } from 'utils/helpers';
import { MESSAGES as LUMOS_WEB_MESSAGES } from 'lumos-web/src/Constants';
import SidebarTabsManager from 'lib/sidebarTabsManager';
import handleSubtabApiResponse from 'lib/handleSubtabApiResponse';
import { nativeBrowserAddReactAppListener } from 'lib/nativeMessenger';

const MIN_CLIENT_WIDTH_AUTOSHOW = 1200;

let mostRecentLumosUrl = null;
const sidebarTabsManager = new SidebarTabsManager();
const sidebarIframes = [];

function isVisible(document: Document): boolean {
  const sidebarContainer = document.getElementById(CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR);
  return sidebarContainer.style.width == STYLE_WIDTH_SIDEBAR ? true : false;
}

function flipSidebar(document: Document, force?: string): void {
  const sidebarContainer = document.getElementById(CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR);
  const serpOverlayContainer = document.getElementById(
    CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR_OVERLAY,
  );
  const showButton = document.getElementById(CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR_SHOW);
  const hideButton = document.getElementById(CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR_HIDE);
  const tabsContainer = document.getElementById(CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR_TABS);
  const contentContainer = document.getElementById(CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR_CONTENT);

  if ((force && force == 'hide') || (isVisible(document) && force !== 'show')) {
    // hide sidebar
    if (tabsContainer && contentContainer) {
      tabsContainer.style.visibility = 'hidden';
      contentContainer.style.visibility = 'hidden';
    }

    sidebarContainer.style.visibility = 'hidden';
    showButton.style.visibility = 'visible';
    hideButton.style.visibility = 'hidden';
    sidebarContainer.style.width = '0px';
    // serpOverlayContainer.style.display = "none"
  } else {
    // show sidebar
    sidebarContainer.style.visibility = 'visible';
    showButton.style.visibility = 'hidden';
    hideButton.style.visibility = 'visible';
    // serpOverlayContainer.style.display = "block"
    sidebarContainer.style.width = STYLE_WIDTH_SIDEBAR;
    if (tabsContainer && contentContainer) {
      tabsContainer.style.visibility = 'visible';
      contentContainer.style.visibility = 'visible';
    }
  }
}

function isSidebarLoaded(document): boolean {
  debug('function call - isSidebarLoaded', document);
  return !!document.getElementById(CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR);
}

function addElementAt(container: HTMLElement, element: HTMLElement, index: number) {
  const children = container.children;
  if (children.length === 0 || index === -1) {
    container.appendChild(element);
  } else {
    container.insertBefore(element, children[index]);
  }
}

function tabElementIndex(tabElement: HTMLElement) {
  const elements = Array.from(tabElement.parentElement.children);
  return elements.indexOf(tabElement);
}

const selectTabElement = (tabElement: HTMLElement) => {
  tabElement.style.backgroundColor = 'white';
  tabElement.style.fontWeight = 'bold';
  tabElement.style.borderColor = 'white';

  const index = tabElementIndex(tabElement);

  if (index >= 0) {
    sidebarIframes[index].style.visibility = 'inherit';
    sidebarIframes[index].style.height = '100%';
  }
};

const unselectTabElement = (tabElement: HTMLElement) => {
  tabElement.style.backgroundColor = STYLE_COLOR_UNSELECTED_TAB;
  tabElement.style.fontWeight = 'normal';
  tabElement.style.borderColor = STYLE_COLOR_UNSELECTED_TAB;
};

const unselectAllTabs = (tabsContainer: HTMLElement, contentContainer: HTMLElement) => {
  for (let child = tabsContainer.firstChild; child !== null; child = child.nextSibling) {
    const castedChild = <HTMLElement>child;
    unselectTabElement(castedChild);
  }

  for (let child = contentContainer.firstChild; child !== null; child = child.nextSibling) {
    const castedChild = <HTMLElement>child;
    castedChild.style.visibility = 'hidden';
    castedChild.style.height = '0';
  }
};

const removeSidebarTab = (tabElement: HTMLElement) => {
  const index = tabElementIndex(tabElement);

  if (index >= 0) {
    tabElement.remove();
    sidebarIframes.splice(index, 1)?.[0].remove();
  }
};

function loadSidebarTabs(sidebarTabs: ISidebarTab[]) {
  const tabsContainer = document.getElementById(CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR_TABS);
  const contentContainer = document.getElementById(CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR_CONTENT);
  const selectDefault = tabsContainer.children.length === 0;
  const defaultIndex = selectDefault && sidebarTabs.findIndex((sidebarTab) => sidebarTab.default);
  const isNotSerp = !serpUrlToSearchText(new URL(window.location.href));

  sidebarTabs.forEach(function (sidebarTab: ISidebarTab, idx) {
    const isDefault = selectDefault && defaultIndex === idx;
    const isRecentlyVisited =
      isNotSerp && sidebarTabsManager.isTabRecentlyVisited(sidebarTab.url.href);
    const tab = addSidebarTab(document, sidebarTab, isDefault && !isRecentlyVisited);

    if (isNotSerp) {
      sidebarTabsManager.tabVisited(sidebarTab.url.href);
    }

    if (isDefault || (defaultIndex === -1 && idx === 0)) {
      unselectAllTabs(tabsContainer, contentContainer);
      selectTabElement(tab);
    }
  });
}

function addSidebarTab(
  document: HTMLDocument,
  sidebarTab: ISidebarTab,
  isDefault: boolean,
  index: number = -1,
) {
  const tabsContainer = document.getElementById(CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR_TABS);
  const contentContainer = document.getElementById(CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR_CONTENT);
  const sidebarTogglerPreviewContainer = document.getElementById(
    CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR_PREVIEW_CONTAINER,
  );
  const sidebarTogglerWhenHidden = document.getElementById(
    CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR_SHOW,
  );

  // preview element that lives outside the sidebar
  const sidebarPreviewItem = document.createElement('div');
  sidebarPreviewItem.appendChild(document.createTextNode(sidebarTab.title));
  sidebarPreviewItem.setAttribute(
    'style',
    `
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          padding: ${STYLE_PADDING_SMALL} 0;
          font-weight: bold;
      `,
  );
  sidebarPreviewItem.classList.add('sidebar_preview_item');
  addElementAt(sidebarTogglerPreviewContainer, sidebarPreviewItem, index);

  const tabElement = document.createElement('span');
  const contentIframe = document.createElement('iframe');
  const pinElement = document.createElement('span');
  pinElement.appendChild(document.createTextNode('📌'));
  pinElement.setAttribute(
    'style',
    `
    margin-left: 5px;
  `,
  );
  pinElement.addEventListener('click', () => {
    const pinnedTab = sidebarTabsManager.pinSidebarTab(
      mostRecentLumosUrl ? mostRecentLumosUrl : contentIframe.src,
    );

    if (!pinnedTab) {
      return;
    }

    unselectAllTabs(tabsContainer, contentContainer);
    selectTabElement(addSidebarTab(document, pinnedTab, false, 0));
  });

  const listenUrlUpdate = (msg: MessageEvent) => {
    if (msg.data && msg.data.command) {
      const { data } = msg;
      switch (data.command) {
        case LUMOS_WEB_MESSAGES.WEB_CONTENT_URL_UPDATED:
          if ((msg.source as any) !== contentIframe.contentWindow) {
            return;
          }

          const index = tabElementIndex(tabElement);
          if (sidebarTab.isPinnedTab) {
            sidebarTabsManager.updatedPinnedTabUrl(data.updatedUrl, index);
          } else {
            mostRecentLumosUrl = data.updatedUrl;
          }
          break;
      }
    }
  };

  window.addEventListener('message', listenUrlUpdate, false);

  const unpinElement = document.createElement('span');
  unpinElement.appendChild(document.createTextNode('❌'));
  unpinElement.setAttribute(
    'style',
    `
    margin-left: 5px;
  `,
  );
  unpinElement.addEventListener('click', () => {
    const index = tabElementIndex(tabElement);
    sidebarTabsManager.unpinSidebarTab(index);
    sidebarPreviewItem.remove();
    removeSidebarTab(tabElement);

    if (tabsContainer.children.length === 0) {
      flipSidebar(document, 'hide');
      sidebarTogglerWhenHidden.style.visibility = 'hidden';
    } else {
      selectTabElement(<HTMLElement>tabsContainer.firstElementChild);
    }

    window.removeEventListener('message', listenUrlUpdate);
  });

  tabElement.appendChild(document.createTextNode(sidebarTab.title));
  if (sidebarTab.isPinnedTab) {
    tabElement.appendChild(unpinElement);
  } else if (sidebarTab.url.host === new URL(LUMOS_APP_BASE_URL).host) {
    tabElement.appendChild(pinElement);
  }
  tabElement.setAttribute(
    'style',
    `
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: ${STYLE_FONT_SIZE_MEDIUM};
          padding: ${STYLE_PADDING_MEDIUM};
          text-align: center;
          color: ${STYLE_COLOR_TEXT};
          background: ${STYLE_COLOR_UNSELECTED_TAB};
          width: ${STYLE_WIDTH_SIDEBAR_TAB};
          cursor: pointer;
          border-radius: 10px 10px 0 0;
      `,
  );

  // load the urls of the subtabs into iframes

  contentIframe.src = sidebarTab.url.href;
  contentIframe.setAttribute(
    'style',
    `
      max-width: ${STYLE_WIDTH_SIDEBAR};
      width: 100%;
      height: 100%;
      border: none;
      `,
  );
  contentIframe.addEventListener('load', () => {
    debug('iframe loaded');
    if (isDefault && document.body.clientWidth > MIN_CLIENT_WIDTH_AUTOSHOW) {
      flipSidebar(document, 'show');
    }
  });

  //  enable switching between tabs
  tabElement.addEventListener('click', function (e) {
    const clickSrc = <HTMLElement>(e.target || e.srcElement);

    if (clickSrc !== tabElement) {
      return;
    }

    unselectAllTabs(tabsContainer, contentContainer);
    selectTabElement(clickSrc);
  });

  // insert tab and content into containers
  addElementAt(tabsContainer, tabElement, index);
  sidebarIframes.splice(index !== -1 ? index : sidebarIframes.length, 0, contentIframe);
  contentContainer.appendChild(contentIframe);

  return tabElement;
}

const loadSidebarIfNeeded = async (document: Document) => {
  debug('function call - loadSidebarIfNeeded', document);
  if (!isSidebarLoaded(document)) {
    await createSidebar(document);
  }
};

function removeAllSidebarTabs(document: Document) {
  const tabsContainer = document.getElementById(CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR_TABS);
  const contentContainer = document.getElementById(CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR_CONTENT);
  const sidebarTogglerPreviewContainer = document.getElementById(
    CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR_PREVIEW_CONTAINER,
  );

  // Cleaning old content before adding new
  while (tabsContainer.firstChild) {
    tabsContainer.removeChild(tabsContainer.firstChild);
  }

  while (contentContainer.firstChild) {
    contentContainer.removeChild(contentContainer.firstChild);
  }

  while (sidebarTogglerPreviewContainer.firstChild) {
    sidebarTogglerPreviewContainer.removeChild(sidebarTogglerPreviewContainer.firstChild);
  }

  sidebarIframes.splice(0, sidebarIframes.length);
}

const loadSidebarCss = () => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = chrome.extension.getURL('styles/sidebar.css');
  link.type = 'text/css';
  document.head.appendChild(link);
};

/**
 * Generate the DOM layout of the extension. This will load markup and style
 * files from the public folder as its defined in `manifest.json`.
 * See: `web_accessible_resources`
 *
 * @param document The document object
 */
export const createSidebar = async (document: Document) => {
  debug('function call - createSidebar');

  // Initialization
  const wrapper = document.createElement('div');
  const result: string = await loadPublicFile('./markup/sidebar.html');
  wrapper.innerHTML = result;
  document.body.appendChild(wrapper);
  loadSidebarCss();

  // Serp Overlay
  const serpOverlay: HTMLDivElement = wrapper.querySelector('.serp-overlay');
  serpOverlay.id = CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR_OVERLAY;
  serpOverlay.addEventListener('click', () => flipSidebar(document, 'hide'));

  // Sidebar Container
  const sidebarContainer: HTMLDivElement = wrapper.querySelector('.sidebar-container');
  sidebarContainer.id = CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR;
  sidebarContainer.addEventListener('mouseover', () => {
    sidebarOverlayContainer.style.right = null;
    sidebarOverlayContainer.style.bottom = null;
  });
  sidebarContainer.setAttribute(
    'style',
    `
        ${RESET_CSS}
        z-index: ${Number(STYLE_ZINDEX_MAX) - 1} !important;
        border-right-color: ${STYLE_COLOR_BORDER} !important;
        border-left-color: ${STYLE_COLOR_TEXT_LIGHT} !important;
    `,
  );

  // Sidebar Toggle Preview Container
  const sidebarTogglerPreviewContainer = wrapper.querySelector(
    '.sidebar-toggler-preview-container',
  );
  sidebarTogglerPreviewContainer.id = CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR_PREVIEW_CONTAINER;

  //Sidebar Toggler When Hidden
  const sidebarTogglerWhenHidden: HTMLDivElement = wrapper.querySelector(
    '.sidebar-toggler-when-hidden',
  );
  sidebarTogglerWhenHidden.id = CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR_SHOW;
  sidebarTogglerWhenHidden.addEventListener('click', function (e) {
    flipSidebar(document, 'show');
  });
  sidebarTogglerWhenHidden.setAttribute(
    'style',
    `
      ${RESET_CSS}
      bottom: ${STYLE_SIDEBAR_SHOWER_Y_OFFSET} !important;
      max-width: ${STYLE_SIDEBAR_TOGGLER_WIDTH} !important;
      padding: ${STYLE_PADDING_XLARGE} !important;
      border-radius: ${STYLE_BORDER_RADIUS_PILL} 0 0 ${STYLE_BORDER_RADIUS_PILL} !important;
      font-size: ${STYLE_FONT_SIZE_SMALL} !important;
      z-index: ${STYLE_ZINDEX_MAX} !important;
    `,
  );

  // Sidebar Toggler When Visible
  const sidebarTogglerWhenVisible = wrapper.querySelector('.sidebar-toggler-when-visible');
  sidebarTogglerWhenVisible.id = CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR_HIDE;
  sidebarTogglerWhenVisible.addEventListener('click', function (e) {
    flipSidebar(document, 'hide');
  });
  sidebarTogglerWhenVisible.setAttribute(
    'style',
    `
      ${RESET_CSS}
      left: ${STYLE_SIDEBAR_HIDER_X_OFFSET} !important;
      top: ${STYLE_SIDEBAR_HIDER_Y_OFFSET} !important;
      border: 3px solid ${STYLE_COLOR_TEXT_LIGHT} !important;
      font-size: ${STYLE_FONT_SIZE_LARGE} !important;
      padding: ${STYLE_PADDING_MEDIUM} !important;
      z-index: ${STYLE_ZINDEX_MAX} !important;
    `,
  );

  // Tabs Container
  const tabsContainer = wrapper.querySelector('.tabs-container');
  tabsContainer.id = CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR_TABS;

  // Content Container
  const contentContainer = wrapper.querySelector('.content-container');
  contentContainer.id = CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR_CONTENT;

  // Sidebar Overlay Container
  const sidebarOverlayContainer: HTMLDivElement = wrapper.querySelector(
    '.sidebar-overlay-container',
  );
  sidebarOverlayContainer.setAttribute('style', `z-index: ${STYLE_ZINDEX_MAX} !important;`);

  flipSidebar(document, 'hide');

  // special case: by default hiding the sidebar will show this toggle but wem hide it until
  // content is populated
  sidebarTogglerWhenHidden.style.visibility = 'hidden';

  document.onkeydown = function (e: KeyboardEvent) {
    if (
      sidebarContainer.style.visibility === 'visible' &&
      (e.key === 'ArrowRight' || e.key === 'ArrowLeft')
    ) {
      const tabContainer = document.getElementById('lumos_sidebar_tabs');
      if (tabContainer) {
        let selectedChild: HTMLElement;
        let next: Element;
        let prev: Element;

        function triggerEvent(elem, event) {
          var clickEvent = new Event(event); // Create the event.
          elem.dispatchEvent(clickEvent); // Dispatch the event.
        }

        tabContainer.childNodes.forEach((child, i) => {
          const c = child as HTMLElement;
          if (c.style.backgroundColor == 'white') {
            selectedChild = c;
            prev = c.previousElementSibling
              ? c.previousElementSibling
              : tabContainer.lastElementChild;
            next = c.nextElementSibling ? c.nextElementSibling : tabContainer.firstElementChild;
          }
        });

        if (selectedChild && prev && next) {
          if (e.key === 'ArrowLeft') {
            triggerEvent(prev, 'click');
          } else if (e.key === 'ArrowRight') {
            triggerEvent(next, 'click');
          }
        }
      }
    }
  };

  nativeBrowserAddReactAppListener({
    window,
    message: MESSAGES.BROWSERBG_BROWSERFG_URL_UPDATED,
    callback: (msg) => {
      try {
        loadOrUpdateSidebar(document, new URL(msg.data.url));
      } catch {
        loadOrUpdateSidebar(document, new URL(window.location.href));
      }
    },
  });
};

export const loadOrUpdateSidebar = async (document: Document, url: URL) => {
  // mutates document
  debug('function call - loadOrUpdateSidebar', document, url);

  const loadSidebarTabsAndShowSidebar = async (
    document: HTMLDocument,
    tabs: ISidebarTab[],
    showSidebar: boolean,
  ) => {
    debug('function call - loadSidebarTabsAndShowSidebar', document, tabs, showSidebar);
    await loadSidebarIfNeeded(document);
    loadSidebarTabs(tabs);

    if (showSidebar) {
      flipSidebar(document, 'show');
    } else {
      const sidebarContainer = document.getElementById(CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR);
      const showButton = document.getElementById(CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR_SHOW);

      if (sidebarContainer.style.visibility === 'hidden') {
        showButton.style.visibility = 'visible';
      }
    }
  };

  const initialTabs = sidebarTabsManager.getPinnedTabs();
  runFunctionWhenDocumentReady(document, () => {
    !!initialTabs.length && loadSidebarTabsAndShowSidebar(document, initialTabs, true);
  });

  sidebarTabsManager.fetchSubtabs(url).then((response) => {
    if (!response) return;
    runFunctionWhenDocumentReady(document, async () => {
      const tabs = await handleSubtabApiResponse(url, document, response);
      !!tabs.length && loadSidebarTabsAndShowSidebar(document, tabs, true);
    });
  });
};

import {
  expandSidebar,
  flipSidebar,
  getFirstValidTabIndex,
  getLastValidTabIndex,
  shouldPreventEventBubble,
  SWITCH_TO_TAB,
  UPDATE_SIDEBAR_TABS_MESSAGE,
  EXPAND_KEY,
  FULLSCREEN_KEY,
  SHRINK_KEY,
  SWITCH_LEFT_TAB,
  SWITCH_RIGHT_TAB,
} from 'utils';

let buffer: boolean[] = [];

export const keyUpHandler = (event: KeyboardEvent) => {
  if (!!event.metaKey || !!event.ctrlKey) {
    buffer = [];
  }
};

export const keyboardHandler = (event: KeyboardEvent, loader: TSidebarLoader) => {
  if (!loader.isSerp || shouldPreventEventBubble(event)) return;

  const currentTabIndex = Number(loader.currentTab);
  const handleToggle = () => {
    loader.isExpanded = !loader.isExpanded;
    expandSidebar(loader.sidebarTabs.length, loader.maxAvailableSpace);
    chrome.runtime.sendMessage({ type: UPDATE_SIDEBAR_TABS_MESSAGE });
  };

  if (buffer.indexOf(true) > -1) {
    buffer = [];
    return;
  }

  switch (event.code) {
    case FULLSCREEN_KEY.CODE:
      handleToggle();
      buffer = [];
      break;
    case EXPAND_KEY.CODE:
      loader.isExpanded && handleToggle();
      flipSidebar(document, 'show', loader.sidebarTabs.length, loader.maxAvailableSpace);
      buffer = [];
      break;
    case SHRINK_KEY.CODE:
      loader.isExpanded && handleToggle();
      flipSidebar(document, 'hide', loader.sidebarTabs.length, loader.maxAvailableSpace);
      buffer = [];
      break;
    case SWITCH_RIGHT_TAB.CODE:
      chrome.runtime.sendMessage({
        type: SWITCH_TO_TAB,
        index:
          currentTabIndex === loader.sidebarTabs.length
            ? getFirstValidTabIndex(loader.sidebarTabs)
            : (
                currentTabIndex +
                Number(getFirstValidTabIndex(loader.sidebarTabs.slice(currentTabIndex)))
              ).toString(),
      });
      buffer = [];
      break;
    case SWITCH_LEFT_TAB.CODE:
      {
        const lastIndex = getLastValidTabIndex(loader.sidebarTabs.slice(0, currentTabIndex - 1));
        chrome.runtime.sendMessage({
          type: SWITCH_TO_TAB,
          index: lastIndex === '0' ? getLastValidTabIndex(loader.sidebarTabs) : lastIndex,
        });
        buffer = [];
      }
      break;
    default:
      (!!event.metaKey || !!event.ctrlKey) && buffer.push(true);
      break;
  }
};

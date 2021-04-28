import {
  expandSidebar,
  flipSidebar,
  getFirstValidTabIndex,
  getLastValidTabIndex,
  shouldPreventEventBubble,
  SWITCH_TO_TAB,
  UPDATE_SIDEBAR_TABS_MESSAGE,
} from 'utils';

let buffer = [];

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
    expandSidebar(loader.sidebarTabs.length);
    chrome.runtime.sendMessage({ type: UPDATE_SIDEBAR_TABS_MESSAGE });
  };

  if (buffer.indexOf(true) > -1) {
    buffer = [];
    return;
  }

  switch (event.code) {
    case 'KeyF':
      handleToggle();
      buffer = [];
      break;
    case 'KeyI':
      loader.isExpanded && handleToggle();
      flipSidebar(document, 'show', loader.sidebarTabs.length);
      buffer = [];
      break;
    case 'Escape':
      loader.isExpanded && handleToggle();
      flipSidebar(document, 'hide', loader.sidebarTabs.length);
      buffer = [];
      break;
    case 'ArrowRight':
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
    case 'ArrowLeft':
      const lastIndex = getLastValidTabIndex(loader.sidebarTabs.slice(0, currentTabIndex - 1));
      chrome.runtime.sendMessage({
        type: SWITCH_TO_TAB,
        index: lastIndex === '0' ? getLastValidTabIndex(loader.sidebarTabs) : lastIndex,
      });
      buffer = [];
      break;
    default:
      (!!event.metaKey || !!event.ctrlKey) && buffer.push(true);
      break;
  }
};

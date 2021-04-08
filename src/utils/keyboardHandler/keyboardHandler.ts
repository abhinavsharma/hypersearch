import {
  expandSidebar,
  flipSidebar,
  getFirstValidTabIndex,
  getLastValidTabIndex,
  shouldPreventEventBubble,
  SWITCH_TO_TAB,
  UPDATE_SIDEBAR_TABS_MESSAGE,
} from 'utils';

export const keyboardHandler = (event: KeyboardEvent, loader: TSidebarLoader) => {
  if (shouldPreventEventBubble(event)) return;
  const currentTabIndex = Number(loader.currentTab);
  const handleToggle = () => {
    loader.isExpanded = !loader.isExpanded;
    expandSidebar();
    chrome.runtime.sendMessage({ type: UPDATE_SIDEBAR_TABS_MESSAGE });
  };
  switch (event.code) {
    case 'KeyF':
      handleToggle();
      break;
    case 'KeyP':
      loader.isExpanded && handleToggle();
      flipSidebar(document, 'show', loader.sidebarTabs.length);
      break;
    case 'KeyH':
      loader.isExpanded && handleToggle();
      flipSidebar(document, 'hide', loader.sidebarTabs.length);
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
      break;
    case 'ArrowLeft':
      const lastIndex = getLastValidTabIndex(loader.sidebarTabs.slice(0, currentTabIndex - 1));
      chrome.runtime.sendMessage({
        type: SWITCH_TO_TAB,
        index: lastIndex === '0' ? getLastValidTabIndex(loader.sidebarTabs) : lastIndex,
      });
      break;
  }
};

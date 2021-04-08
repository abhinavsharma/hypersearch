import React, { useEffect, useRef } from 'react';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import {
  EXTENSION_SERP_FILTER_LOADED,
  HIDE_DOMAINS_MESSAGE,
  HIDE_TAB_FAKE_URL,
  expandSidebar,
  UPDATE_SIDEBAR_TABS_MESSAGE,
  SWITCH_TO_TAB,
  getFirstValidTabIndex,
  shouldPreventEventBubble,
  getLastValidTabIndex,
  flipSidebar,
} from 'utils';

export const SidebarTabContainer: SidebarTabContainer = ({ tab, currentTab }) => {
  const frameRef = useRef<HTMLIFrameElement>(null);

  const augmentation =
    (tab.isSuggested
      ? SidebarLoader.suggestedAugmentations
      : SidebarLoader.installedAugmentations
    ).find(({ id }) => id === tab.id) ?? Object.create(null);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (shouldPreventEventBubble(event)) return;
    const currentTabIndex = Number(currentTab);
    const handleToggle = () => {
      SidebarLoader.isExpanded = !SidebarLoader.isExpanded;
      expandSidebar();
      chrome.runtime.sendMessage({ type: UPDATE_SIDEBAR_TABS_MESSAGE });
    };
    switch (event.code) {
      case 'KeyF':
        handleToggle();
        break;
      case 'KeyP':
        SidebarLoader.isExpanded && handleToggle();
        flipSidebar(document, 'show', SidebarLoader.sidebarTabs.length);
        break;
      case 'KeyH':
        SidebarLoader.isExpanded && handleToggle();
        flipSidebar(document, 'hide', SidebarLoader.sidebarTabs.length);
        break;
      case 'ArrowRight':
        chrome.runtime.sendMessage({
          type: SWITCH_TO_TAB,
          index:
            currentTabIndex === SidebarLoader.sidebarTabs.length
              ? getFirstValidTabIndex(SidebarLoader.sidebarTabs)
              : (
                  currentTabIndex +
                  Number(getFirstValidTabIndex(SidebarLoader.sidebarTabs.slice(currentTabIndex)))
                ).toString(),
        });
        break;
      case 'ArrowLeft':
        const lastIndex = getLastValidTabIndex(
          SidebarLoader.sidebarTabs.slice(0, currentTabIndex - 1),
        );
        chrome.runtime.sendMessage({
          type: SWITCH_TO_TAB,
          index: lastIndex === '0' ? getLastValidTabIndex(SidebarLoader.sidebarTabs) : lastIndex,
        });
        break;
    }
  };

  useEffect(() => {
    frameRef.current?.contentWindow.addEventListener('keydown', handleKeyDown);

    if (tab.hideDomains.length) {
      window.top.postMessage(
        {
          augmentation,
          name: HIDE_DOMAINS_MESSAGE,
          tab: tab.id,
          hideDomains: tab.hideDomains,
          selector: {
            link:
              SidebarLoader.customSearchEngine.querySelector[
                window.top.location.href.search(/google\.com/) > -1 ? 'pad' : 'desktop'
              ],
            container: SidebarLoader.customSearchEngine.querySelector.result_container_selector,
          },
        },
        '*',
      );
    }

    return () => frameRef.current?.contentWindow.removeEventListener('keydown', handleKeyDown);
  }, []);

  return tab.url.href !== HIDE_TAB_FAKE_URL ? (
    <iframe
      ref={frameRef}
      src={unescape(tab.url.href)}
      className="insight-tab-iframe"
      onLoad={() => {
        SidebarLoader.sendLogMessage(EXTENSION_SERP_FILTER_LOADED, {
          query: SidebarLoader.query,
          filter_name: tab.title,
          domains_to_search: SidebarLoader.domainsToSearch[tab.id],
        });
      }}
    />
  ) : null;
};

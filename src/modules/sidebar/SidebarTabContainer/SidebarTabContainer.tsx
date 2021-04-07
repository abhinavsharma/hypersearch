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
} from 'utils';

export const SidebarTabContainer: SidebarTabContainer = ({ tab }) => {
  const frameRef = useRef<HTMLIFrameElement>(null);

  const augmentation =
    (tab.isSuggested
      ? SidebarLoader.suggestedAugmentations
      : SidebarLoader.installedAugmentations
    ).find(({ id }) => id === tab.id) ?? Object.create(null);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (shouldPreventEventBubble(event)) return;
    const currentTabIndex = Number(SidebarLoader.currentTab);
    if (event.code === 'ArrowRight') {
      if (!SidebarLoader.isExpanded) {
        SidebarLoader.isExpanded = !SidebarLoader.isExpanded;
        expandSidebar();
        chrome.runtime.sendMessage({ type: UPDATE_SIDEBAR_TABS_MESSAGE });
      } else {
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
      }
    }
    if (event.code === 'ArrowLeft') {
      if (!SidebarLoader.isExpanded) return;
      if (SidebarLoader.currentTab === getFirstValidTabIndex(SidebarLoader.sidebarTabs)) {
        SidebarLoader.isExpanded = !SidebarLoader.isExpanded;
        expandSidebar();
        chrome.runtime.sendMessage({ type: UPDATE_SIDEBAR_TABS_MESSAGE });
      } else {
        chrome.runtime.sendMessage({
          type: SWITCH_TO_TAB,
          index: getLastValidTabIndex(SidebarLoader.sidebarTabs.slice(0, currentTabIndex - 1)),
        });
      }
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

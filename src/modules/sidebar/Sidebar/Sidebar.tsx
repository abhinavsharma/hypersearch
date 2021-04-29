/**
 * @module Sidebar
 * @author Matyas Angyal<matyas@laso.ai>
 * @license (C) Insight
 * @version 1.0.0
 */
import React, { useEffect, useState } from 'react';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import AugmentationManager from 'lib/AugmentationManager/AugmentationManager';
import { flipSidebar } from 'utils/flipSidebar/flipSidebar';
import { getFirstValidTabIndex, isKnowledgePage, triggerSerpProcessing } from 'utils/helpers';
import { SidebarTabs, SidebarToggleButton } from 'modules/sidebar';
import {
  DISABLE_SUGGESTED_AUGMENTATION,
  HIDE_TAB_FAKE_URL,
  TOGGLE_BLOCKED_DOMAIN_MESSAGE,
  TOGGLE_TRUSTED_DOMAIN_MESSAGE,
  UPDATE_SIDEBAR_TABS_MESSAGE,
  WINDOW_REQUIRED_MIN_WIDTH,
} from 'utils/constants';
import './Sidebar.scss';

const Sidebar: Sidebar = () => {
  const [sidebarTabs, setSidebarTabs] = useState<SidebarTab[]>(SidebarLoader.sidebarTabs);
  const [activeKey, setActiveKey] = useState<string>(
    getFirstValidTabIndex(SidebarLoader.sidebarTabs),
  );
  // SIDE-EFFECTS
  useEffect(() => {
    // Set up a listener for a message when an augmentation has been either installed
    // deleted or modified. To keep the sidebar up-to-date we generate sidebar tabs from
    // the actually installed augmentations and non-serp subtabs.
    chrome.runtime.onMessage.addListener((msg) => {
      switch (msg.type) {
        case UPDATE_SIDEBAR_TABS_MESSAGE:
          SidebarLoader.getTabsAndAugmentations();
          setSidebarTabs(SidebarLoader.sidebarTabs);
          triggerSerpProcessing(SidebarLoader);
          break;
        case DISABLE_SUGGESTED_AUGMENTATION:
          AugmentationManager.disableSuggestedAugmentation(msg.augmentation);
          break;
        case TOGGLE_BLOCKED_DOMAIN_MESSAGE:
          (async () => {
            !msg.isBlocked
              ? await AugmentationManager.updateBlockList(msg.domain)
              : await AugmentationManager.deleteFromBlockList(msg.domain);
          })();
          break;
        case TOGGLE_TRUSTED_DOMAIN_MESSAGE:
          (async () => await AugmentationManager.toggleTrustlist(msg.domain))();
          break;
      }
    });
    // When one of the following conditions are met, we hide the sidebar by default, regardless
    // of the number of matching tabs. If there are matching tabs and the sidebar can't expand on
    // load, the height of the toggle button (SidebarToggleButton) is set dynamically.
    const isSmallWidth = window.innerWidth <= WINDOW_REQUIRED_MIN_WIDTH;
    const isTabsLength = getFirstValidTabIndex(sidebarTabs) !== '0';
    const isSearchTabs = sidebarTabs?.find((tab) => tab.isCse);
    if (
      isSmallWidth ||
      !isTabsLength ||
      !isSearchTabs ||
      isKnowledgePage(document) ||
      SidebarLoader.preventAutoExpand
    ) {
      flipSidebar(
        document,
        'hide',
        sidebarTabs.filter(({ url }) => url.href !== HIDE_TAB_FAKE_URL).length,
        true,
      );
    } else {
      flipSidebar(
        document,
        'show',
        sidebarTabs.filter(({ url }) => url.href !== HIDE_TAB_FAKE_URL).length,
      );
    }
  }, []);

  return (
    <>
      <div id="insight-sidebar-container">
        <SidebarTabs tabs={sidebarTabs} activeKey={activeKey} setActiveKey={setActiveKey} />
      </div>
      {!!sidebarTabs.filter(({ url }) => url?.href !== HIDE_TAB_FAKE_URL).length && (
        <SidebarToggleButton tabs={sidebarTabs} />
      )}
    </>
  );
};

export { Sidebar };

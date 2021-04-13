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
import { getFirstValidTabIndex, isKnowledgePage } from 'utils/helpers';
import { SidebarTabs, SidebarToggleButton } from 'modules/sidebar';
import {
  AIRTABLE_IMPROVE_SEARCH_LINK,
  APP_NAME,
  DISABLE_SUGGESTED_AUGMENTATION,
  UPDATE_SIDEBAR_TABS_MESSAGE,
  WINDOW_REQUIRED_MIN_WIDTH,
} from 'utils/constants';
import './Sidebar.scss';

const Sidebar: Sidebar = () => {
  // We use this state variable to forcibly open a given tab on the sidebar.
  const [forceTab, setForceTab] = useState<string | null>(null);
  // The matching tabs for the current page. We load these tabs into the sidebar.
  const [sidebarTabs, setSidebarTabs] = useState<SidebarTab[]>(SidebarLoader.sidebarTabs);
  // SIDE-EFFECTS
  useEffect(() => {
    // Set up a listener for a message when an augmentation has been either installed
    // deleted or modified. To keep the sidebar up-to-date we generate sidebar tabs from
    // the actually installed augmentations and non-serp subtabs.
    chrome.runtime.onMessage.addListener((msg) => {
      switch (msg.type) {
        case UPDATE_SIDEBAR_TABS_MESSAGE:
          SidebarLoader.getTabsAndAugmentations();
          setSidebarTabs((prev = []) => [
            ...SidebarLoader.sidebarTabs,
            ...prev.filter((i) => !i.isCse),
          ]);
          break;
        case DISABLE_SUGGESTED_AUGMENTATION:
          AugmentationManager.disableSuggestedAugmentation(msg.augmentation);
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
      flipSidebar(document, 'hide', sidebarTabs?.length, true);
    } else {
      flipSidebar(document, 'show', sidebarTabs?.length);
    }
  }, []);

  return (
    <>
      <div id="insight-sidebar-container">
        <div id="insight-sidebar-title">
          <span>{APP_NAME}&nbsp;/&nbsp;</span>
          <a target="_blank" href={AIRTABLE_IMPROVE_SEARCH_LINK}>
            Send Feedback
          </a>
        </div>
        <SidebarTabs tabs={sidebarTabs} forceTab={forceTab} />
      </div>
      <SidebarToggleButton tabs={sidebarTabs} setTab={setForceTab} />
    </>
  );
};

export { Sidebar };

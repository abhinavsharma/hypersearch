/**
 * @module Sidebar
 * @author Matyas Angyal<matyas@laso.ai>
 * @license (C) Insight
 * @version 1.0.0
 */
import React, { useEffect, useState } from 'react';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import { flipSidebar } from 'utils/flipSidebar/flipSidebar';
import { getFirstValidTabIndex, isKnowledgePage } from 'utils/helpers';
import { SidebarTabs, SidebarToggleButton } from 'modules/sidebar';
import {
  AIRTABLE_IMPROVE_SEARCH_LINK,
  APP_NAME,
  DISABLE_SUGGESTED_AUGMENTATION,
  SIDEBAR_Z_INDEX,
  UPDATE_SIDEBAR_TABS_MESSAGE,
  WINDOW_REQUIRED_MIN_WIDTH,
} from 'utils/constants';
import './Sidebar.scss';
import AugmentationManager from 'lib/AugmentationManager/AugmentationManager';

const Sidebar: Sidebar = () => {
  // We use this state variable to forcibly open a given tab on the sidebar.
  const [forceTab, setForceTab] = useState<string | null>(null);
  // The matching tabs for the current page. We load these tabs into the sidebar.
  const [sidebarTabs, setSidebarTabs] = useState<SidebarTab[]>(SidebarLoader.sidebarTabs);
  // Passing actual tabDomains through context. This is a workaround for Ant Tab prerender.
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
    if (isSmallWidth || !isTabsLength || !isSearchTabs || isKnowledgePage(document)) {
      flipSidebar(document, 'hide', sidebarTabs?.length);
    } else {
      flipSidebar(document, 'show', sidebarTabs?.length);
    }
  }, []);

  return (
    <>
      <div className="insight-sidebar-container">
        <div
          className="insight-sidebar-close-button"
          style={{ zIndex: SIDEBAR_Z_INDEX + 1 }}
          onClick={() => {
            setForceTab('1');
            setTimeout(() => {
              // The timeout will guarantee that the sidebar is collapsing properly.
              flipSidebar(document, 'hide', sidebarTabs.length);
            }, 100);
            setForceTab(null);
          }}
        >
          ×
        </div>
        <div className="insight-sidebar-title">
          <span>🔎&nbsp;&nbsp;Lenses from {APP_NAME}&nbsp;/&nbsp;</span>
          <a target="_blank" href={AIRTABLE_IMPROVE_SEARCH_LINK}>
            Feedback
          </a>
        </div>
        <SidebarTabs tabs={sidebarTabs} forceTab={forceTab} />
      </div>
      <SidebarToggleButton tabs={sidebarTabs} setTab={setForceTab} />
    </>
  );
};

export { Sidebar };

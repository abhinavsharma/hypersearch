/**
 * @module Sidebar
 * @author Matyas Angyal<matyas@laso.ai>
 * @license (C) Insight
 * @version 1.0.0
 */
import React, { useEffect, useState } from 'react';
import { flipSidebar } from 'utils/flipSidebar/flipSidebar';
import { UPDATE_SIDEBAR_TABS_MESSAGE } from 'utils/constants';
import { SidebarTabs, SidebarToggleButton } from 'modules/sidebar';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import './Sidebar.scss';

// Minimum inner width of the window for expanding sidebar by default.
const WINDOW_REQUIRED_MIN_WIDTH = 1200;
// Engine specific query selectors for Knowledge Page/Panel identification on SERP pages.
// If such content found on the current page, the sidebar remains hidden until manually opened.
const GOOGLE_KP_SELECTOR = '.kp-wholepage';
const DDG_KP_SELECTOR = '.b_ans';
const BING_KP_SELECTOR = '.module--about';

const CloseIcon: CloseIcon = ({ setForceTab, numTabs }) => (
  <div
    className="insight-sidebar-close-button"
    onClick={() => {
      setForceTab('1');
      setTimeout(() => {
        // The timeout will guarantee that the sidebar is collapsing properly.
        flipSidebar(document, 'hide', numTabs);
      }, 100);
      setForceTab(null);
    }}
  >
    ×
  </div>
);

const Sidebar: Sidebar = () => {
  // We use this state variable to forcibly open a given tab on the sidebar.
  const [forceTab, setForceTab] = useState<string | null>(null);
  // The matching tabs for the current page. We load these tabs into the sidebar.
  const [sidebarTabs, setSidebarTabs] = useState<SidebarTab[]>(SidebarLoader.sidebarTabs);
  // SIDE-EFFECTS
  useEffect(() => {
    // We set up a listener for a message when an augmentation has been either installed
    // deleted or modified. To keep the sidebar up-to-date we generate sidebar tabs from
    // the actually installed augmentations and non-serp subtabs.
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.type === UPDATE_SIDEBAR_TABS_MESSAGE) {
        SidebarLoader.getTabsAndAugmentations();
        setSidebarTabs((prev = []) => [
          ...SidebarLoader.sidebarTabs,
          ...prev.filter((i) => !i.isCse),
        ]);
      }
    });
    // When one of the following conditions are met, we hide the sidebar by default, regardless
    // of the number of matching tabs. If there are matching tabs and the sidebar can't expand on
    // load, the height of the toggle button (SidebarToggleButton) is set dynamically.
    const isSmallWidth = window.innerWidth <= WINDOW_REQUIRED_MIN_WIDTH;
    const isTabsLength = sidebarTabs?.length !== 0;
    const isSearchTabs = sidebarTabs?.find((tab) => tab.isCse);
    const isKnowledgePage =
      !!document.querySelectorAll(GOOGLE_KP_SELECTOR).length ||
      !!document.querySelectorAll(BING_KP_SELECTOR).length ||
      !!document.querySelectorAll(DDG_KP_SELECTOR).length;
    if (isSmallWidth || !isTabsLength || !isSearchTabs || isKnowledgePage) {
      flipSidebar(document, 'hide', sidebarTabs?.length);
    } else {
      flipSidebar(document, 'show', sidebarTabs?.length);
    }
  }, []);

  return (
    <>
      <div className="insight-sidebar-container">
        <CloseIcon setForceTab={setForceTab} numTabs={sidebarTabs?.length} />
        <SidebarTabs tabs={sidebarTabs} forceTab={forceTab} />
      </div>
      <SidebarToggleButton tabs={sidebarTabs} />
    </>
  );
};

export { Sidebar };

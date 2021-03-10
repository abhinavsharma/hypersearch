/**
 * @module Sidebar
 * @author Matyas Angyal<matyas@laso.ai>
 * @license (C) Insight
 * @version 1.0.0
 */
import React, { useEffect, useState } from 'react';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import { flipSidebar } from 'utils/flipSidebar/flipSidebar';
import { SidebarTabs, SidebarToggleButton } from 'modules/sidebar';
import {
  BING_KP_SELECTOR,
  GOOGLE_KP_SELECTOR,
  SET_TAB_DOMAINS_MESSAGE,
  UPDATE_SIDEBAR_TABS_MESSAGE,
  WINDOW_REQUIRED_MIN_WIDTH,
} from 'utils/constants';
import './Sidebar.scss';

export const SidebarTabDomainsContext = React.createContext(null);

const Sidebar: Sidebar = () => {
  // We use this state variable to forcibly open a given tab on the sidebar.
  const [forceTab, setForceTab] = useState<string | null>(null);
  // The matching tabs for the current page. We load these tabs into the sidebar.
  const [sidebarTabs, setSidebarTabs] = useState<SidebarTab[]>(SidebarLoader.sidebarTabs);
  // Passing actual tabDomains through context. This is a workaround for Ant Tab prerender.
  const [tabDomains, setTabDomains] = useState<Record<string, string[]>>();
  // SIDE-EFFECTS
  useEffect(() => {
    // Due to security reasons, rendered IFrames must use the `postMessage` API to send
    // their ID to `frames` content script where the domains of the tab's SERP will be
    // extracted and sent back to here to assign to the global singleton property.
    window.top.addEventListener('message', (event) => {
      if (event.data.type === SET_TAB_DOMAINS_MESSAGE) {
        SidebarLoader.tabDomains[event.data.tab] = Array.from(new Set(event.data.domains));
        setTabDomains((prev) => ({
          ...prev,
          [event.data.tab]: Array.from(new Set(event.data.domains)),
        }));
      }
    });
    // Set up a listener for a message when an augmentation has been either installed
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
      !!document.querySelectorAll(BING_KP_SELECTOR).length;
    if (isSmallWidth || !isTabsLength || !isSearchTabs || isKnowledgePage) {
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
        <SidebarTabDomainsContext.Provider value={tabDomains}>
          <SidebarTabs tabs={sidebarTabs} forceTab={forceTab} />
        </SidebarTabDomainsContext.Provider>
      </div>
      <SidebarToggleButton tabs={sidebarTabs} />
    </>
  );
};

export { Sidebar };

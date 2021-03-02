import React, { createContext, useEffect, useState } from 'react';
import { flipSidebar } from 'lib/flipSidebar/flipSidebar';
import { WINDOW_REQUIRED_MIN_WIDTH } from 'lib/loadOrUpdateSidebar/loadOrUpdateSidebar';
import { SidebarTabs, SidebarToggleButton } from 'modules/sidebar';
import './Sidebar.scss';

const GOOGLE_KP_SELECTOR = '.kp-wholepage';
const DDG_KP_SELECTOR = '.b_ans';
const BING_KP_SELECTOR = '.module--about';

export const AugmentationContext = createContext(null);

const XIcon: XIcon = ({ setForceTab, numTabs }) => {
  const handleClick = () => {
    setForceTab('1');
    // Workaround to `useState`'s async nature. The timeout
    // will ensure that the sidebar is collapsed properly.
    setTimeout(() => {
      flipSidebar(document, 'hide', numTabs);
    }, 100);
    setForceTab(null);
  };

  return (
    <div className="insight-sidebar-close-button" onClick={handleClick}>
      ×
    </div>
  );
};

export const Sidebar: Sidebar = ({ url, tabs, suggestedAugmentations }) => {
  const [forceTab, setForceTab] = useState<string | null>(null);

  useEffect(() => {
    const isSmallWidth = window.innerWidth <= WINDOW_REQUIRED_MIN_WIDTH;
    const isTabsLength = tabs.length !== 0;
    const isSearchTabs = tabs.find((tab) => tab.isCse);
    const isKnowledgePage =
      !!document.querySelectorAll(GOOGLE_KP_SELECTOR).length ||
      !!document.querySelectorAll(BING_KP_SELECTOR).length ||
      !!document.querySelectorAll(DDG_KP_SELECTOR).length;

    if (isSmallWidth || !isTabsLength || !isSearchTabs || isKnowledgePage) {
      flipSidebar(document, 'hide', tabs.length);
    } else {
      flipSidebar(document, 'show', tabs.length);
    }
  }, []);

  const augmentationContextValue = {
    url,
    suggested: suggestedAugmentations.filter((i) =>
      tabs.find(
        (tab) => tab.title === i.name && i.actions.action_list.some((i) => i.key !== 'inject_js'),
      ),
    ),
  };

  return (
    <AugmentationContext.Provider value={augmentationContextValue}>
      <div className="insight-sidebar-container">
        <XIcon setForceTab={setForceTab} numTabs={tabs.length} />
        <SidebarTabs tabs={tabs} forceTab={forceTab} />
      </div>
      <SidebarToggleButton tabs={tabs} />
    </AugmentationContext.Provider>
  );
};

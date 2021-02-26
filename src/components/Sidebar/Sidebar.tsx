import React, { createContext, useEffect, useState } from 'react';
import { SidebarTabs } from 'components/SidebarTabs/SidebarTabs';
import { flipSidebar } from 'lib/flipSidebar/flipSidebar';
import { SidebarToggleButton } from 'components/SidebarToggleButton/SidebarToggleButton';
import './Sidebar.scss';
import { WINDOW_REQUIRED_MIN_WIDTH } from 'lib/loadOrUpdateSidebar/loadOrUpdateSidebar';

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
    const isKnowledgePage =
      !!document.querySelectorAll('#rhs').length || // Google
      !!document.querySelectorAll('.b_ans').length || // Bing
      !!document.querySelectorAll('.module--about').length; // DuckDuckGo

    if (window.innerWidth <= WINDOW_REQUIRED_MIN_WIDTH || tabs.length === 0 || isKnowledgePage) {
      flipSidebar(document, 'hide', tabs.length);
    } else {
      flipSidebar(document, 'show', tabs.length);
    }
  }, []);

  const augmentationContextValue = {
    url,
    installed: [], // TODO: get this list from local storage
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

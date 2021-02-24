import React, { createContext, useState } from 'react';
import { SidebarTabs } from 'components/SidebarTabs/SidebarTabs';
import { flipSidebar } from 'lib/flipSidebar/flipSidebar';
import { SidebarToggleButton } from 'components/SidebarToggleButton/SidebarToggleButton';
import './Sidebar.scss';

export const AugmentationContext = createContext(null);

const XIcon: XIcon = ({ setForceTab }) => {
  const handleClick = () => {
    setForceTab('1');
    // Workaround to `useState`'s async nature. The timeout
    // will ensure that the sidebar is collapsed properly.
    setTimeout(() => {
      flipSidebar(document, 'hide');
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

  const augmentationContextValue = {
    url,
    installed: suggestedAugmentations.filter((i) => tabs.find((tab) => tab.title === i.name)),
    suggested: suggestedAugmentations.filter((i) =>
      tabs.find(
        (tab) => tab.title !== i.name && i.actions.action_list.some((i) => i.key !== 'inject_js'),
      ),
    ),
  };

  return (
    <AugmentationContext.Provider value={augmentationContextValue}>
      <div className="insight-sidebar-container">
        <XIcon setForceTab={setForceTab} />
        <SidebarTabs tabs={tabs} forceTab={forceTab} />
      </div>
      <SidebarToggleButton tabs={tabs} />
    </AugmentationContext.Provider>
  );
};

import React, { useEffect, useRef } from 'react';
import { SidebarTabs } from 'components/SidebarTabs/SidebarTabs';
import { flipSidebar } from 'lib/flipSidebar/flipSidebar';
import { keyEventTranlator } from 'lib/keyEventTranslator/keyEventTranslator';
import { SidebarToggleButton } from 'components/SidebarToggleButton/SidebarToggleButton';
import './Sidebar.scss';

const XIcon: XIcon = () => {
  const handleClick = () => flipSidebar(document, 'hide');
  return (
    <div className="insight-sidebar-close-button" onClick={handleClick}>
      ×
    </div>
  );
};

export const Sidebar: Sidebar = ({ tabs }) => {
  const sidebarRef = useRef(null);

  const handleKeyDown = (e: KeyboardEvent) => keyEventTranlator(e, sidebarRef.current);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <div ref={sidebarRef} className="insight-sidebar-container">
        <XIcon />
        <SidebarTabs tabs={tabs} />
      </div>
      <SidebarToggleButton tabs={tabs} />
    </>
  );
};

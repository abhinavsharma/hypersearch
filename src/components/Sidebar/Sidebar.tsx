import React, { useEffect, useRef, useState } from 'react';
import Button from 'antd/lib/button';
import { SidebarTabs } from 'components/SidebarTabs/SidebarTabs';
import { flipSidebar } from 'lib/flipSidebar/flipSidebar';
import { keyEventTranlator } from 'lib/keyEventTranslator/keyEventTranslator';
import './Sidebar.scss';
import { SidebarToggleButton } from 'components/SidebarToggleButton/SidebarToggleButton';

const XIcon: XIcon = () => {
  const handleClick = () => flipSidebar(document, 'hide');
  return (
    <Button className="insight-sidebar-close-button" onClick={handleClick}>
      ×
    </Button>
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

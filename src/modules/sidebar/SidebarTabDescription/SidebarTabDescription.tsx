import React from 'react';
import './SidebarTabDescription.scss';

export const SidebarTabDescription: SidebarTabDescription = ({ tab }) => {
  return <div className="sidebar-tab-description">{tab.description}</div>;
};

import React from 'react';
import './SidebarTabTitle.scss';

export const SidebarTabTitle: SidebarTabTitle = ({ tab, index, activeKey, setActiveKey }) => {
  const handleClick = () => setActiveKey((index + 1).toString());
  return (
    <div
      onClick={handleClick}
      className={`insight-tab-pill ${tab.url?.href === 'hide' ? 'hidden' : ''}`}
    >
      <span
        className={`insight-tab-title ${activeKey === (index + 1).toString() ? 'active' : ''} ${
          activeKey === '0' ? 'hidden' : ''
        }`}
      >
        {tab.isSuggested ? tab.title : `${tab.title}\u00a0◾`}
      </span>
    </div>
  );
};

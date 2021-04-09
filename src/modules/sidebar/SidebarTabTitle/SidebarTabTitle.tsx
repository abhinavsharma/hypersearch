import Tooltip from 'antd/lib/tooltip';
import React from 'react';
import './SidebarTabTitle.scss';
import 'antd/lib/tooltip/style/index.css';

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
        {!tab.augmentation.installed ? (
          <Tooltip title={'Suggested'} destroyTooltipOnHide={{ keepParent: false }}>
            {tab.title}
          </Tooltip>
        ) : (
          <Tooltip title={'Local'} destroyTooltipOnHide={{ keepParent: false }}>
            {tab.title} {`\u00a0◾`}
          </Tooltip>
        )}
      </span>
    </div>
  );
};

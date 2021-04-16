import Tooltip from 'antd/lib/tooltip';
import React from 'react';
import './SidebarTabTitle.scss';
import 'antd/lib/tooltip/style/index.css';

const insertNewlineAfterEmoji = (s) => {
  return s?.replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])(.*)/g, '$1\n$2');
};

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
        {!tab.augmentation?.installed ? (
          <Tooltip title={'Suggested'} destroyTooltipOnHide={{ keepParent: false }}>
            {insertNewlineAfterEmoji(tab.title)}
          </Tooltip>
        ) : (
          <Tooltip title={'Local'} destroyTooltipOnHide={{ keepParent: false }}>
            {insertNewlineAfterEmoji(tab.title)} {`\u00a0◾`}
          </Tooltip>
        )}
      </span>
    </div>
  );
};

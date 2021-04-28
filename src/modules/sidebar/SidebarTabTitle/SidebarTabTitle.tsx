import React from 'react';
import Tooltip from 'antd/lib/tooltip';
import { APP_NAME, removeEmoji } from 'utils';
import 'antd/lib/tooltip/style/index.css';
import './SidebarTabTitle.scss';

/**
 * ! DISABLED
 * TODO: decide wheter to extract logic or remove

 const insertNewlineAfterEmoji = (s, showVerified: boolean) => {
  return (
    <div>
      {showVerified && (
        <Suspense fallback={null}>
          <CloudDownloadOutlined />
        </Suspense>
      )}
      {s?.replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])(.*)/g, '$1\n$2')}
    </div>
  );
};

 * ! DISABLED END
 */

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
          <Tooltip
            title={`Lens suggested by ${APP_NAME}`}
            destroyTooltipOnHide={{ keepParent: false }}
          >
            {removeEmoji(tab.title)}
          </Tooltip>
        ) : (
          <Tooltip title={'Local Lens'} destroyTooltipOnHide={{ keepParent: false }}>
            {removeEmoji(tab.title)}
          </Tooltip>
        )}
      </span>
    </div>
  );
};

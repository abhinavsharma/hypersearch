import Tooltip from 'antd/lib/tooltip';
import React, { Suspense } from 'react';
import './SidebarTabTitle.scss';
import 'antd/lib/tooltip/style/index.css';
import { APP_NAME } from 'utils/constants';

const insertNewlineAfterEmoji = (s, showVerified: boolean) => {
  return <div>
  {showVerified && <Suspense fallback={null}><CloudDownloadOutlined /></Suspense>}
  {s?.replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])(.*)/g, '$1\n$2')}
</div>
};

const CloudDownloadOutlined = React.lazy(
  async () => await import('@ant-design/icons/CloudDownloadOutlined').then((mod) => mod),
);

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
          <Tooltip title={`Lens suggested by ${APP_NAME}`} destroyTooltipOnHide={{ keepParent: false }}>
            {insertNewlineAfterEmoji(tab.title, true)}
          </Tooltip>
        ) : (
          <Tooltip title={'Local Lens'} destroyTooltipOnHide={{ keepParent: false }}>
            {insertNewlineAfterEmoji(tab.title, false)}
          </Tooltip>
        )}
      </span>
    </div>
  );
};

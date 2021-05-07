import React from 'react';
import md5 from 'md5';
import Tooltip from 'antd/lib/tooltip';
import { APP_NAME, EXTENSION_SERP_SUBTAB_CLICKED, removeEmoji } from 'utils';
import 'antd/lib/tooltip/style/index.css';
import './SidebarTabTitle.scss';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';

export const SidebarTabTitle: SidebarTabTitle = ({ tab, index, activeKey, setActiveKey }) => {
  const handleClick = () => {
    setActiveKey((index + 1).toString());
    SidebarLoader.sendLogMessage(EXTENSION_SERP_SUBTAB_CLICKED, {
      originalUrl: SidebarLoader.strongPrivacy
        ? md5(SidebarLoader.url.href)
        : SidebarLoader.url.href,
      originalQuery: SidebarLoader.strongPrivacy ? md5(SidebarLoader.query) : SidebarLoader.query,
      subtabUrl: SidebarLoader.strongPrivacy ? md5(tab.url.href) : tab.url.href,
      subtabName: tab.title,
    });
  };
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
            {tab.url.searchParams.get('insight-tab-title') ?? removeEmoji(tab.title)}
          </Tooltip>
        ) : (
          <Tooltip title={'Local Lens'} destroyTooltipOnHide={{ keepParent: false }}>
            {tab.url.searchParams.get('insight-tab-title') ?? removeEmoji(tab.title)}
          </Tooltip>
        )}
      </span>
    </div>
  );
};

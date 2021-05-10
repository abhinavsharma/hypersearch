import React, { useEffect } from 'react';
import md5 from 'md5';
import Tooltip from 'antd/lib/tooltip';
import {
  APP_NAME,
  decodeSpace,
  EXTENSION_SERP_LINK_HOVEROPEN,
  EXTENSION_SERP_SUBTAB_CLICKED,
  EXTENSION_SUBTAB_SCROLL,
  extractUrlProperties,
  removeEmoji,
  removeProtocol,
  TRIGGER_FRAME_SCROLL_LOG_MESSAGE,
  TRIGGER_GUTTER_HOVEROPEN_MESSAGE,
} from 'utils';
import 'antd/lib/tooltip/style/index.css';
import './SidebarTabTitle.scss';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import { useDebouncedFn } from 'beautiful-react-hooks';

export const SidebarTabTitle: SidebarTabTitle = ({ tab, index, activeKey, setActiveKey }) => {
  const handleHoverOpenLog = useDebouncedFn(
    (msg: any) => {
      SidebarLoader.sendLogMessage(EXTENSION_SERP_LINK_HOVEROPEN, {
        query: SidebarLoader.query,
        url: msg.url,
        position_in_serp:
          (SidebarLoader.tabDomains as any)['original'].indexOf(
            extractUrlProperties(msg.url).full,
          ) + 1,
      });
    },
    1000,
    null,
    [],
  );

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

  useEffect(() => {
    chrome.runtime.onMessage.addListener((msg) => {
      const matching =
        msg.url &&
        (escape(removeProtocol(decodeSpace(tab.url.href))) === escape(removeProtocol(msg.url)) ||
          escape(removeProtocol(decodeSpace(tab.url.href))).search(
            escape(removeProtocol(msg.url)),
          ) > -1);
      if (msg.type === TRIGGER_FRAME_SCROLL_LOG_MESSAGE && matching) {
        SidebarLoader.sendLogMessage(EXTENSION_SUBTAB_SCROLL, {
          originalUrl: SidebarLoader.strongPrivacy
            ? md5(SidebarLoader.url.href)
            : SidebarLoader.url.href,
          originalQuery: SidebarLoader.strongPrivacy
            ? md5(SidebarLoader.query)
            : SidebarLoader.query,
          subtabUrl: SidebarLoader.strongPrivacy ? md5(tab.url.href) : tab.url.href,
          subtabName: tab.title,
        });
      }
      if (msg.type === TRIGGER_GUTTER_HOVEROPEN_MESSAGE && matching) {
        handleHoverOpenLog(msg);
      }
    });
  }, [tab.url.href]);

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

import React, { useEffect } from 'react';
import md5 from 'md5';
import { useDebouncedFn } from 'beautiful-react-hooks';
import Tooltip from 'antd/lib/tooltip';
import SidebarLoader from 'lib/sidebar';
import UserManager from 'lib/user';
import { decodeSpace, extractUrlProperties, removeProtocol } from 'lib/helpers';
import {
  APP_NAME,
  EXTENSION_SERP_LINK_HOVEROPEN,
  EXTENSION_SERP_SUBTAB_CLICKED,
  EXTENSION_SUBTAB_SCROLL,
  SIDEBAR_TAB_FAKE_URL,
  TRIGGER_FRAME_SCROLL_LOG_MESSAGE,
  TRIGGER_GUTTER_HOVEROPEN_MESSAGE,
  URL_PARAM_TAB_TITLE_KEY,
} from 'constant';
import 'antd/lib/tooltip/style/index.css';
import './SidebarTabTitle.scss';

/** MAGICS **/
const SUGGESTED_TOOLTIP_TEXT = `Lens suggested by ${APP_NAME}`;
const INSTALLED_TOOLTIP_TEXT = 'Local Lens';

export const SidebarTabTitle: SidebarTabTitle = ({ tab, index, activeKey, setActiveKey }) => {
  const handleHoverOpenLog = useDebouncedFn(
    (msg: any) => {
      SidebarLoader.sendLogMessage(EXTENSION_SERP_LINK_HOVEROPEN, {
        query: SidebarLoader.query,
        url: msg.url,
        license_keys: UserManager.user.licenses,
        position_in_serp:
          SidebarLoader.publicationSlices['original'].indexOf(
            extractUrlProperties(msg.url).full ?? '',
          ) + 1,
      });
    },
    1000,
    undefined,
    [],
  );

  const handleClick = () => {
    setActiveKey((index + 1).toString());
    SidebarLoader.sendLogMessage(EXTENSION_SERP_SUBTAB_CLICKED, {
      originalUrl: UserManager.user.privacy ? md5(SidebarLoader.url.href) : SidebarLoader.url.href,
      originalQuery: UserManager.user.privacy ? md5(SidebarLoader.query) : SidebarLoader.query,
      subtabUrl: UserManager.user.privacy ? md5(tab.url.href) : tab.url.href,
      subtabName: tab.augmentation.name,
    });
  };

  useEffect(() => {
    chrome.runtime.onMessage.addListener((msg) => {
      const matching =
        msg.url &&
        (escape(removeProtocol(decodeSpace(tab.url.href))) === escape(removeProtocol(msg.url)) ||
          escape(removeProtocol(decodeSpace(tab.url.href))).includes(
            escape(removeProtocol(msg.url)),
          ));
      if (msg.type === TRIGGER_FRAME_SCROLL_LOG_MESSAGE && matching) {
        SidebarLoader.sendLogMessage(EXTENSION_SUBTAB_SCROLL, {
          originalUrl: UserManager.user.privacy
            ? md5(SidebarLoader.url.href)
            : SidebarLoader.url.href,
          originalQuery: UserManager.user.privacy ? md5(SidebarLoader.query) : SidebarLoader.query,
          subtabUrl: UserManager.user.privacy ? md5(tab.url.href) : tab.url.href,
          subtabName: tab.augmentation.name,
        });
      }
      if (msg.type === TRIGGER_GUTTER_HOVEROPEN_MESSAGE && matching) {
        handleHoverOpenLog(msg);
      }
    });
  }, [tab.url.href, tab.augmentation.name, handleHoverOpenLog]);

  const keepParent = { keepParent: false };

  return (
    <div
      onClick={handleClick}
      className={`insight-tab-pill ${tab.url?.href === SIDEBAR_TAB_FAKE_URL ? 'hidden' : ''}`}
    >
      <span
        className={`insight-tab-title ${activeKey === (index + 1).toString() ? 'active' : ''} ${
          activeKey === '0' ? 'hidden' : ''
        }`}
      >
        {!tab.augmentation?.installed ? (
          <Tooltip title={SUGGESTED_TOOLTIP_TEXT} destroyTooltipOnHide={keepParent}>
            {tab.url.searchParams?.get(URL_PARAM_TAB_TITLE_KEY) ?? tab.augmentation.name}
          </Tooltip>
        ) : (
          <Tooltip title={INSTALLED_TOOLTIP_TEXT} destroyTooltipOnHide={keepParent}>
            {tab.url.searchParams?.get(URL_PARAM_TAB_TITLE_KEY) ?? tab.augmentation.name}
          </Tooltip>
        )}
      </span>
    </div>
  );
};

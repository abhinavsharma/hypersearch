import React, { useState } from 'react';
import Typography from 'antd/lib/typography';
import Button from 'antd/lib/button';
import Tooltip from 'antd/lib/tooltip';
import { Maximize, Minimize, Menu } from 'react-feather';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import { CustomSidebarIcon } from 'modules/shared';
import {
  AIRTABLE_IMPROVE_SEARCH_LINK,
  APP_NAME_LONG,
  expandSidebar,
  FULLSCREEN_KEY,
  flipSidebar,
  OPEN_AUGMENTATION_BUILDER_MESSAGE,
  OPEN_BUILDER_PAGE,
  UPDATE_SIDEBAR_TABS_MESSAGE,
  SHRINK_KEY,
} from 'utils';
import 'antd/lib/typography/style/index.css';
import 'antd/lib/button/style/index.css';
import 'antd/lib/tooltip/style/index.css';
import './SidebarHeader.scss';

/** MAGICS **/
const ICON_COLOR = '#999999';
const SHRINK_TOOLTIP_TEXT = `Back to Search Engine ("${FULLSCREEN_KEY.KEY}" key)`;
const EXPAND_TOOLTIP_TEXT = `Fullscreen ("${FULLSCREEN_KEY.KEY}" key)`;
const MENU_TOOLTIP_TEXT = 'Lenses Menu';
const HIDE_TOOLTIP_TEXT = `Hide ("${SHRINK_KEY.KEY}" key)`;

const { Title } = Typography;

export const SidebarHeader: SidebarHeader = ({ tabs }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(SidebarLoader.isExpanded);

  const handleClose = () => {
    isExpanded && handleExpand();
    flipSidebar(document, 'hide', tabs.length, SidebarLoader.maxAvailableSpace);
  };

  const handleOpenBuilder = () => {
    if (SidebarLoader.tourStep) {
      SidebarLoader.tourStep = '2';
    }
    chrome.runtime.sendMessage({
      type: OPEN_AUGMENTATION_BUILDER_MESSAGE,
      page: OPEN_BUILDER_PAGE.ACTIVE,
    });
  };

  const handleExpand = () => {
    SidebarLoader.isExpanded = !SidebarLoader.isExpanded;
    setIsExpanded(SidebarLoader.isExpanded);
    expandSidebar(SidebarLoader.sidebarTabs.length, SidebarLoader.maxAvailableSpace);
    chrome.runtime.sendMessage({ type: UPDATE_SIDEBAR_TABS_MESSAGE });
  };

  const keepParent = { keepParent: false };

  return (
    <div id="sidebar-header">
      <div className="app-name-and-feedback">
        <Title className="app-name" level={5}>
          {APP_NAME_LONG}
        </Title>
        <div>
          <a
            className="app-feedback"
            target="_blank"
            href={AIRTABLE_IMPROVE_SEARCH_LINK.replace(
              '<query>',
              new URLSearchParams(window.location.search ?? '').get('q') ?? '',
            )}
            rel="noreferrer"
          >
            Send Feedback
          </a>
        </div>
      </div>
      <div id="header-actions-container">
        <Tooltip
          destroyTooltipOnHide={keepParent}
          title={isExpanded ? SHRINK_TOOLTIP_TEXT : EXPAND_TOOLTIP_TEXT}
        >
          <Button
            onClick={handleExpand}
            icon={
              isExpanded ? (
                <Minimize size={20} stroke={ICON_COLOR} />
              ) : (
                <Maximize size={20} stroke={ICON_COLOR} />
              )
            }
            type="text"
          />
        </Tooltip>
        <Tooltip destroyTooltipOnHide={keepParent} title={MENU_TOOLTIP_TEXT}>
          <Button
            onClick={handleOpenBuilder}
            className={
              SidebarLoader.tourStep === 'true' || SidebarLoader.tourStep === '1'
                ? 'insight-tour-shake'
                : ''
            }
            icon={<Menu size={20} stroke={ICON_COLOR} />}
            type="text"
          />
        </Tooltip>
        <Tooltip destroyTooltipOnHide={keepParent} title={HIDE_TOOLTIP_TEXT}>
          <Button
            onClick={handleClose}
            icon={<CustomSidebarIcon stroke={ICON_COLOR} />}
            type="text"
          />
        </Tooltip>
      </div>
    </div>
  );
};

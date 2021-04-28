import React from 'react';
import Typography from 'antd/lib/typography';
import Button from 'antd/lib/button';
import { Maximize, Menu, Sidebar } from 'react-feather';
import {
  APP_NAME,
  expandSidebar,
  flipSidebar,
  OPEN_AUGMENTATION_BUILDER_MESSAGE,
  OPEN_BUILDER_PAGE,
  UPDATE_SIDEBAR_TABS_MESSAGE,
} from 'utils';
import 'antd/lib/typography/style/index.css';
import 'antd/lib/button/style/index.css';
import './SidebarHeader.scss';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import Tooltip from 'antd/lib/tooltip';
import 'antd/lib/tooltip/style/index.css';

const { Title } = Typography;

export const SidebarHeader: SidebarHeader = ({ tabs }) => {
  const handleClose = () => {
    flipSidebar(document, 'hide', tabs.length);
  };

  const handleOpenBuilder = () => {
    chrome.runtime.sendMessage({
      type: OPEN_AUGMENTATION_BUILDER_MESSAGE,
      page: OPEN_BUILDER_PAGE.ACTIVE,
    });
  };

  const handleExpand = () => {
    SidebarLoader.isExpanded = !SidebarLoader.isExpanded;
    expandSidebar(SidebarLoader.sidebarTabs.length);
    chrome.runtime.sendMessage({ type: UPDATE_SIDEBAR_TABS_MESSAGE });
  };

  return (
    <div id="sidebar-header">
      <Title className="app-name" level={5}>
        {APP_NAME}
      </Title>
      <div id="header-actions-container">
        <Tooltip destroyTooltipOnHide={{ keepParent: false }} title="Fullscreen (F)">
          <Button onClick={handleExpand} icon={<Maximize size={20} stroke={'#999'} />} type="text" />
        </Tooltip>
        <Tooltip destroyTooltipOnHide={{ keepParent: false }} title="Lenses Menu">
          <Button onClick={handleOpenBuilder} icon={<Menu size={20} stroke={'#999'} />} type="text" />
        </Tooltip>
        <Tooltip destroyTooltipOnHide={{ keepParent: false }} title="Hide (Esc)">
          <Button onClick={handleClose} icon={<Sidebar size={20} stroke={'#999'} />} type="text" />
        </Tooltip>
      </div>
    </div>
  );
};

/**
 * @module SidebarTabs
 * @author Matyas Angyal<matyas@laso.ai>
 * @license (C) Insight
 * @version 1.0.0
 */
import React, { useState, useEffect, useCallback } from 'react';
import Tabs from 'antd/lib/tabs';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import { AddAugmentationTab, ActiveAugmentationsPage } from 'modules/augmentations/';
import {
  ActionBar,
  SidebarTabContainer,
  SidebarTabDescription,
  SidebarTabDomains,
  SidebarTabReadable,
  SidebarTabTitle,
} from 'modules/sidebar';
import {
  flipSidebar,
  extractUrlProperties,
  getFirstValidTabIndex,
  OPEN_AUGMENTATION_BUILDER_MESSAGE,
  SEND_FRAME_INFO_MESSAGE,
  EXTENSION_SERP_LINK_CLICKED,
  EXTENSION_SERP_FILTER_LINK_CLICKED,
} from 'utils';
import 'antd/lib/button/style/index.css';
import 'antd/lib/tabs/style/index.css';
import './SidebarTabs.scss';

const { TabPane } = Tabs;

export const SidebarTabs: SidebarTabs = ({ forceTab, tabs }) => {
  const [activeKey, setActiveKey] = useState<string>(
    !!tabs.length ? getFirstValidTabIndex(tabs) : '0',
  );

  const handleLog = useCallback(async (msg) => {
    if (SidebarLoader.strongPrivacy) return null;
    if (msg.frame.parentFrameId === -1) {
      SidebarLoader.sendLogMessage(EXTENSION_SERP_LINK_CLICKED, {
        query: SidebarLoader.query,
        url: msg.url,
        position_in_serp: SidebarLoader.domains.indexOf(extractUrlProperties(msg.url).hostname) + 1,
      });
    } else {
      const sourceTab = tabs.find(
        (i) => unescape(i.url.href) === msg.frame.url.replace('www.', ''),
      );
      if (!sourceTab) return null;
      setTimeout(
        () =>
          SidebarLoader.sendLogMessage(EXTENSION_SERP_FILTER_LINK_CLICKED, {
            query: SidebarLoader.query,
            url: msg.url,
            filter_name: sourceTab.title,
            position_in_serp: SidebarLoader.tabDomains[sourceTab.id].indexOf(msg.url) + 1,
          }),
        250,
      );
    }
  }, []);

  useEffect(() => {
    chrome.runtime.onMessage.addListener((msg) => {
      switch (msg.type) {
        // Set up listener for expanding sidebar with the augmentation builder page,
        // when the extension toolbar icon is clicked by the user.
        case OPEN_AUGMENTATION_BUILDER_MESSAGE:
          flipSidebar(document, 'show', tabs?.length);
          setActiveKey('0');
          break;
        // LOGGING
        case SEND_FRAME_INFO_MESSAGE:
          handleLog(msg);
          break;
        default:
          break;
      }
    });
  }, [tabs]);

  const TabBar: TabBar = (props, DefaultTabBar) => (
    <DefaultTabBar {...props} className="insight-tab-bar" />
  );

  const extraContent = {
    right: (
      <AddAugmentationTab
        tabs={tabs}
        numInstalledAugmentations={tabs.length}
        active={(forceTab ?? activeKey) === '0'}
        setActiveKey={setActiveKey}
      />
    ),
  };

  return (
    <>
      <Tabs
        className="insight-tab-container"
        renderTabBar={TabBar}
        activeKey={forceTab ?? activeKey}
        tabBarExtraContent={extraContent}
      >
        <TabPane key="0" tab={null} forceRender>
          <ActiveAugmentationsPage setActiveKey={setActiveKey} />
        </TabPane>
        {tabs?.map((tab, i) => {
          return (
            <TabPane
              key={i + 1}
              tab={
                <SidebarTabTitle
                  tab={tab}
                  index={i}
                  setActiveKey={setActiveKey}
                  activeKey={activeKey}
                />
              }
              forceRender
              className={`insight-full-tab`}
            >
              {activeKey === (i + 1).toString() && (
                <ActionBar tab={tab} setActiveKey={setActiveKey} />
              )}
              {tab.description && <SidebarTabDescription tab={tab} />}
              {tab.url && tab.isCse && (
                <SidebarTabDomains tab={tab} domains={SidebarLoader.tabDomains[tab.id]} />
              )}
              {tab.readable && <SidebarTabReadable readable={tab.readable} />}
              {tab.url && <SidebarTabContainer tab={tab} />}
            </TabPane>
          );
        })}
      </Tabs>
    </>
  );
};

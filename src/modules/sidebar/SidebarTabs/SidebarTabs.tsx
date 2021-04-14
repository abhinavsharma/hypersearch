/**
 * @module SidebarTabs
 * @author Matyas Angyal<matyas@laso.ai>
 * @license (C) Insight
 * @version 1.0.0
 */
import React, { useState, useEffect, useCallback, Suspense } from 'react';
import Tabs from 'antd/lib/tabs';
import Button from 'antd/lib/button';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import { AddAugmentationTab, ActiveAugmentationsPage } from 'modules/augmentations/';
import {
  ActionBar,
  SidebarTabContainer,
  SidebarTabMeta,
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
  expandSidebar,
  UPDATE_SIDEBAR_TABS_MESSAGE,
  SWITCH_TO_TAB,
  USE_COUNT_PREFIX,
} from 'utils';
import 'antd/lib/button/style/index.css';
import 'antd/lib/tabs/style/index.css';
import 'antd/lib/tooltip/style/index.css';
import './SidebarTabs.scss';
import Tooltip from 'antd/lib/tooltip';
import { InlineGutterOptionsPage } from 'modules/gutter';

const { TabPane } = Tabs;

const LeftOutlined = React.lazy(
  async () => await import('@ant-design/icons/LeftOutlined').then((mod) => mod),
);

const RightOutlined = React.lazy(
  async () => await import('@ant-design/icons/RightOutlined').then((mod) => mod),
);

export const SidebarTabs: SidebarTabs = ({ forceTab, tabs }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(SidebarLoader.isExpanded);
  const [activeKey, setActiveKey] = useState<string>(getFirstValidTabIndex(tabs));
  const [showPage, setShowPage] = useState<'builder' | 'gutter'>('builder');
  const [gutterPageData, setGutterPageData] = useState<
    Record<string, string & AugmentationObject[]>
  >();

  const handleExpand = () => {
    SidebarLoader.isExpanded = !SidebarLoader.isExpanded;
    expandSidebar();
    chrome.runtime.sendMessage({ type: UPDATE_SIDEBAR_TABS_MESSAGE });
  };

  const handleClose = () => {
    flipSidebar(document, 'hide', tabs.length);
  };

  const extraContent = {
    left: (
      <Suspense fallback={null}>
        {!isExpanded && (
          <Tooltip title='Fullscreen ("F" key)' destroyTooltipOnHide={{ keepParent: false }}>
            <LeftOutlined
              style={{ color: '#999' }}
              onClick={handleExpand}
              className="expand-icon"
            />
          </Tooltip>
        )}
        <Tooltip
          title={isExpanded ? 'Back to Search Engine ("F" key)' : 'Hide sidebar ("H" key)'}
          destroyTooltipOnHide={{ keepParent: false }}
        >
          <Button
            type="text"
            className="expand-icon"
            onClick={isExpanded ? handleExpand : handleClose}
          >
            <RightOutlined style={{ color: '#999' }} />
          </Button>
        </Tooltip>
      </Suspense>
    ),
    right: (
      <AddAugmentationTab
        tabs={tabs}
        numInstalledAugmentations={tabs.length}
        active={(forceTab ?? activeKey) === '0'}
        setActiveKey={setActiveKey}
      />
    ),
  };

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
      const statId = `${USE_COUNT_PREFIX}-${sourceTab.id}`;
      const existingStat =
        (await new Promise((resolve) => chrome.storage.sync.get(statId, resolve)).then(
          (value) => value?.[statId],
        )) ?? 0;
      const newStat = Number(existingStat) + 1;
      chrome.storage.sync.set({ [statId]: newStat });
      SidebarLoader.augmentationStats[sourceTab.id] = newStat;
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
      chrome.runtime.sendMessage({ type: UPDATE_SIDEBAR_TABS_MESSAGE });
    }
  }, []);

  useEffect(() => {
    chrome.runtime.onMessage.addListener((msg) => {
      switch (msg.type) {
        // Set up listener for expanding sidebar with the augmentation builder page,
        // when the extension toolbar icon is clicked by the user.
        case OPEN_AUGMENTATION_BUILDER_MESSAGE:
          flipSidebar(document, 'show', tabs?.length, true);
          setActiveKey('0');
          if (msg.page === 'gutter' && msg.augmentations) {
            setGutterPageData({ augmentations: msg.augmentations, domain: msg.domain });
          }
          msg.page && setShowPage(msg.page);
          break;
        // LOGGING
        case SEND_FRAME_INFO_MESSAGE:
          handleLog(msg);
          break;
        case SWITCH_TO_TAB:
          setActiveKey(msg.index);
          break;
        default:
          break;
      }
    });
  }, [tabs]);

  useEffect(() => {
    setIsExpanded(SidebarLoader.isExpanded);
  }, [SidebarLoader.isExpanded]);

  useEffect(() => {
    SidebarLoader.currentTab = activeKey;
  }, [activeKey]);

  const TabBar: TabBar = (props, DefaultTabBar) => (
    <DefaultTabBar {...props} className="insight-tab-bar" />
  );

  return (
    <>
      <Tabs
        className="insight-tab-container"
        renderTabBar={TabBar}
        activeKey={forceTab ?? activeKey}
        tabBarExtraContent={extraContent}
      >
        <TabPane key="0" tab={null} forceRender>
          {(() => {
            switch (showPage) {
              case 'builder':
                return <ActiveAugmentationsPage setActiveKey={setActiveKey} />;
              case 'gutter':
                return (
                  <InlineGutterOptionsPage
                    hidingAugmentations={gutterPageData.augmentations}
                    domain={gutterPageData.domain}
                  />
                );
              default:
                return null;
            }
          })()}
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
              <SidebarTabMeta tab={tab} />
              {tab.readable && <SidebarTabReadable readable={tab.readable} />}
              {tab.url && <SidebarTabContainer tab={tab} currentTab={activeKey} />}
            </TabPane>
          );
        })}
      </Tabs>
    </>
  );
};

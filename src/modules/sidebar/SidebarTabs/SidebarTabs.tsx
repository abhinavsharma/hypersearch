/**
 * @module SidebarTabs
 * @author Matyas Angyal<matyas@laso.ai>
 * @license (C) Insight
 * @version 1.0.0
 */
import React, { useState, useEffect, useCallback, Suspense } from 'react';
import Tabs from 'antd/lib/tabs';
import Button from 'antd/lib/button';
import Router from 'route-lite';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import {
  AddAugmentationTab,
  ActiveAugmentationsPage,
  EditAugmentationPage,
} from 'modules/augmentations/';
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
  OPEN_AUGMENTATION_BUILDER_MESSAGE,
  SEND_FRAME_INFO_MESSAGE,
  EXTENSION_SERP_LINK_CLICKED,
  EXTENSION_SERP_FILTER_LINK_CLICKED,
  expandSidebar,
  UPDATE_SIDEBAR_TABS_MESSAGE,
  SWITCH_TO_TAB,
  USE_COUNT_PREFIX,
  OPEN_BUILDER_PAGE,
} from 'utils';
import 'antd/lib/button/style/index.css';
import 'antd/lib/tabs/style/index.css';
import 'antd/lib/tooltip/style/index.css';
import './SidebarTabs.scss';
import Tooltip from 'antd/lib/tooltip';
import { InlineGutterOptionsPage } from 'modules/gutter';

const { TabPane } = Tabs;

const ExpandAltOutlined = React.lazy(
  async () => await import('@ant-design/icons/ExpandAltOutlined').then((mod) => mod),
);

const CloseOutlined = React.lazy(
  async () => await import('@ant-design/icons/CloseOutlined').then((mod) => mod),
);

const ShrinkOutlined = React.lazy(
  async () => await import('@ant-design/icons/ShrinkOutlined').then((mod) => mod),
);

export const SidebarTabs: SidebarTabs = ({ activeKey, setActiveKey, tabs }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(SidebarLoader.isExpanded);
  const [showPage, setShowPage] = useState<OPEN_BUILDER_PAGE>(OPEN_BUILDER_PAGE.ACTIVE);
  const [pageData, setPageData] = useState<Record<string, any>>();

  const handleExpand = () => {
    SidebarLoader.isExpanded = !SidebarLoader.isExpanded;
    expandSidebar(SidebarLoader.sidebarTabs.length);
    chrome.runtime.sendMessage({ type: UPDATE_SIDEBAR_TABS_MESSAGE });
  };

  const handleClose = () => {
    flipSidebar(document, 'hide', tabs.length);
  };

  const extraContent = {
    left: (
      <Suspense fallback={null}>
        <Tooltip
          title={isExpanded ? 'Back to Search Engine ("F" key)' : 'Hide sidebar (Escape key)'}
          destroyTooltipOnHide={{ keepParent: false }}
        >
          <Button
            type="text"
            className="expand-icon"
            onClick={isExpanded ? handleExpand : handleClose}
          >
            {isExpanded ? <ShrinkOutlined /> : <CloseOutlined style={{ color: '#999' }} />}
          </Button>
        </Tooltip>
        {!isExpanded && (
          <Tooltip title='Fullscreen ("F" key)' destroyTooltipOnHide={{ keepParent: false }}>
            <ExpandAltOutlined
              style={{ color: '#999' }}
              onClick={handleExpand}
              className="expand-icon"
            />
          </Tooltip>
        )}
      </Suspense>
    ),
    right: (
      <AddAugmentationTab
        tabs={tabs}
        numInstalledAugmentations={tabs.length}
        active={activeKey === '0'}
        setActiveKey={setActiveKey}
      />
    ),
  };

  const handleLog = useCallback(async (msg) => {
    if (msg.frame.parentFrameId === -1) {
      SidebarLoader.sendLogMessage(EXTENSION_SERP_LINK_CLICKED, {
        query: SidebarLoader.query,
        url: msg.url,
        position_in_serp:
          SidebarLoader.tabDomains['original'].indexOf(extractUrlProperties(msg.url).full) + 1,
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
            position_in_serp:
              SidebarLoader.tabDomains[sourceTab.id][sourceTab.url].indexOf(
                extractUrlProperties(msg.url).hostname,
              ) + 1,
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
          if (msg.page === OPEN_BUILDER_PAGE.GUTTER && msg.augmentations) {
            setPageData({ augmentations: msg.augmentations, domain: msg.domain });
          }
          if (msg.page === OPEN_BUILDER_PAGE.BUILDER && msg.augmentation) {
            setPageData({ augmentation: msg.augmentation, isAdding: msg.create });
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
        activeKey={activeKey}
        tabBarExtraContent={extraContent}
      >
        <TabPane key="0" tab={null} forceRender>
          <Router>
            {(() => {
              switch (showPage) {
                case OPEN_BUILDER_PAGE.ACTIVE:
                  return <ActiveAugmentationsPage />;
                case OPEN_BUILDER_PAGE.BUILDER:
                  return (
                    <EditAugmentationPage
                      augmentation={pageData.augmentation}
                      isAdding={pageData.isAdding}
                    />
                  );
                case OPEN_BUILDER_PAGE.GUTTER:
                  return (
                    <InlineGutterOptionsPage
                      hidingAugmentations={pageData.augmentations}
                      domain={pageData.domain}
                    />
                  );
                default:
                  return null;
              }
            })()}
          </Router>
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
              {tab.augmentation && (
                <>
                  {activeKey === (i + 1).toString() && (
                    <ActionBar tab={tab} setActiveKey={setActiveKey} />
                  )}
                  <SidebarTabMeta tab={tab} />
                </>
              )}
              {tab.readable && <SidebarTabReadable readable={tab.readable} />}
              {tab.url && <SidebarTabContainer tab={tab} currentTab={activeKey} />}
            </TabPane>
          );
        })}
      </Tabs>
    </>
  );
};

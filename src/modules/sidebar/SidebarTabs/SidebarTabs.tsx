/**
 * @module modules:sidebar
 * @version 1.0.0
 * @license (C) Insight
 */

import React, { useState, useEffect, useCallback } from 'react';
import Tabs from 'antd/lib/tabs';
import message from 'antd/lib/message';
import SidebarLoader from 'lib/sidebar';
import AugmentationManager from 'lib/augmentations';
import UserManager from 'lib/user';
import { ActivePage, BuilderPage, GutterPage, SettingsPage, FeaturePage } from 'modules/pages';
import {
  ActionBar,
  SidebarHeader,
  SidebarTabContainer,
  SidebarTabMeta,
  SidebarTabTitle,
} from 'modules/sidebar';
import { extractUrlProperties, removeProtocol } from 'lib/helpers';
import { flipSidebar } from 'lib/flip';
import {
  OPEN_AUGMENTATION_BUILDER_MESSAGE,
  SEND_FRAME_INFO_MESSAGE,
  EXTENSION_SERP_LINK_CLICKED,
  EXTENSION_SERP_FILTER_LINK_CLICKED,
  UPDATE_SIDEBAR_TABS_MESSAGE,
  SWITCH_TO_TAB,
  USE_COUNT_PREFIX,
  SIDEBAR_PAGE,
  PRERENDER_TABS,
} from 'constant';
import 'antd/lib/message/style/index.css';
import 'antd/lib/button/style/index.css';
import 'antd/lib/tabs/style/index.css';
import './SidebarTabs.scss';

const { TabPane } = Tabs;

export const SidebarTabs: SidebarTabs = ({ activeKey, setActiveKey, tabs }) => {
  const [showPage, setShowPage] = useState<SidebarPage>(SIDEBAR_PAGE.ACTIVE);
  const [pageData, setPageData] = useState<Record<string, any>>();

  const handleLog = useCallback(
    async (msg) => {
      if (msg.frame.parentFrameId === -1) {
        SidebarLoader.sendLogMessage(EXTENSION_SERP_LINK_CLICKED, {
          query: SidebarLoader.query,
          url: msg.url,
          license_keys: UserManager.user.licenses,
          position_in_serp:
            SidebarLoader.publicationSlices['original']?.indexOf(
              extractUrlProperties(msg.url).full ?? '',
            ) + 1,
        });
      } else {
        const sourceTab = tabs.find(
          (i) => unescape(i.url.href) === msg.frame.url.replace('www.', ''),
        );
        if (!sourceTab) return null;
        const statId = `${USE_COUNT_PREFIX}-${sourceTab.augmentation.id}`;
        const existingStat =
          (await new Promise<Record<string, number>>((resolve) =>
            chrome.storage.sync.get(statId, resolve),
          ).then((value) => value?.[statId])) ?? 0;
        const newStat = Number(existingStat) + 1;
        chrome.storage.sync.set({ [statId]: newStat });
        SidebarLoader.augmentationStats[sourceTab.augmentation.id] = newStat;
        setTimeout(
          () =>
            SidebarLoader.sendLogMessage(EXTENSION_SERP_FILTER_LINK_CLICKED, {
              query: SidebarLoader.query,
              url: msg.url,
              license_keys: UserManager.user.licenses,
              filter_name: sourceTab.augmentation.name,
              position_in_serp:
                SidebarLoader.publicationSlices[sourceTab.augmentation.id][
                  sourceTab.url.href
                ].indexOf(extractUrlProperties(msg.url).hostname ?? '') + 1,
            }),
          250,
        );
        chrome.runtime.sendMessage({ type: UPDATE_SIDEBAR_TABS_MESSAGE });
      }
    },
    [tabs],
  );

  useEffect(() => {
    chrome.runtime.onMessage.addListener((msg) => {
      switch (msg.type) {
        // Set up listener for expanding sidebar with the augmentation builder page,
        // when the extension toolbar icon is clicked by the user.
        case OPEN_AUGMENTATION_BUILDER_MESSAGE:
          if (msg.augmentation && !AugmentationManager.isAugmentationEnabled(msg.augmentation)) {
            message.error({
              top: 30,
              content: 'This extension is not supported!',
              maxCount: 3,
            });
            setTimeout(() => message.destroy(), 2500);
            break;
          }
          flipSidebar(document, 'show', tabs?.length, SidebarLoader.maxAvailableSpace, true);
          setActiveKey('0');
          if (msg.page === SIDEBAR_PAGE.GUTTER && msg.augmentations) {
            setPageData({ augmentations: msg.augmentations, publication: msg.publication });
          }
          if (msg.page === SIDEBAR_PAGE.BUILDER && msg.augmentation) {
            setPageData({ augmentation: msg.augmentation, isAdding: msg.create });
          }
          if (msg.page === SIDEBAR_PAGE.SETTINGS && msg.email) {
            setPageData({ email: msg.email });
          }
          msg.page && setShowPage(msg.page);
          break;
        // LOGGING
        case SEND_FRAME_INFO_MESSAGE:
          handleLog(msg);
          break;
        case SWITCH_TO_TAB:
          if (msg.index) {
            setActiveKey(msg.index);
          }
          if (msg.url) {
            if (
              msg.event?.isResultHover /* && SidebarLoader.userData.altHover */ &&
              !msg.event.shift
            ) {
              break;
            }
            const index = tabs.findIndex(({ url }) =>
              escape(removeProtocol(url.href)).includes(
                escape(removeProtocol(msg.url).split('#')[0]),
              ),
            );
            if (index !== -1) {
              flipSidebar(
                document,
                'show',
                tabs.length,
                SidebarLoader.maxAvailableSpace,
                SidebarLoader.isPreview,
              );
              SidebarLoader.isPreview ??= true;
              setActiveKey(String(index + 1));
            }
          }
          break;
        default:
          break;
      }
    });
  }, [tabs, handleLog, setActiveKey]);

  useEffect(() => {
    SidebarLoader.currentTab = activeKey;
  }, [activeKey]);

  const TabBar: TabBar = (props, DefaultTabBar) => (
    <>
      <SidebarHeader tabs={tabs} />
      <DefaultTabBar {...props} className="insight-tab-bar" />
    </>
  );

  return (
    <>
      <Tabs className="insight-tab-container" renderTabBar={TabBar} activeKey={activeKey}>
        <TabPane key="0" tab={null} className="sidebar-tab-panel" forceRender>
          {(() => {
            switch (showPage) {
              case SIDEBAR_PAGE.ACTIVE:
                return <ActivePage />;
              case SIDEBAR_PAGE.BUILDER:
                return (
                  <BuilderPage
                    augmentation={pageData?.augmentation}
                    isAdding={pageData?.isAdding}
                  />
                );
              case SIDEBAR_PAGE.GUTTER:
                return (
                  <GutterPage
                    hidingAugmentations={pageData?.augmentations}
                    domain={pageData?.publication}
                  />
                );
              case SIDEBAR_PAGE.SETTINGS:
                return <SettingsPage email={pageData?.email} />;
              case SIDEBAR_PAGE.FEATURE:
                return <FeaturePage />;
              default:
                return null;
            }
          })()}
        </TabPane>
        {tabs?.map((tab, i) => {
          const tabTitle = (
            <SidebarTabTitle
              tab={tab}
              index={i}
              setActiveKey={setActiveKey}
              activeKey={activeKey}
            />
          );
          return (
            <TabPane
              key={i + 1}
              tab={tabTitle}
              forceRender={i <= PRERENDER_TABS}
              className="sidebar-tab-panel"
            >
              {tab.augmentation && (
                <>
                  {activeKey === (i + 1).toString() && (
                    <ActionBar tab={tab} setActiveKey={setActiveKey} />
                  )}
                  <SidebarTabMeta tab={tab} />
                </>
              )}
              {/* {tab.readable && <SidebarTabReadable readable={tab.readable} />} */}
              {tab.url && <SidebarTabContainer tab={tab} currentTab={activeKey} />}
              {/* tab.url.searchParams.get(URL_PARAM_POSSIBLE_SERP_RESULT) && <SidebarFooter /> */}
            </TabPane>
          );
        })}
      </Tabs>
    </>
  );
};

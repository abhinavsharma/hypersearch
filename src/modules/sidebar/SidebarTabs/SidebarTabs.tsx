/**
 * @module SidebarTabs
 * @author Matyas Angyal<matyas@laso.ai>
 * @license (C) Insight
 * @version 1.0.0
 */
import React, { useState, useEffect } from 'react';
import Tabs from 'antd/lib/tabs';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import {
  AddAugmentationTab,
  ActiveAugmentationsPage,
  ExternalAddAugmentationButton,
} from 'modules/augmentations/';
import {
  SearchNeedsImprovementPage,
  SuggestedTabPopup,
  SidebarTabReadable,
  SidebarTabContainer,
  SidebarTabDomains,
} from 'modules/sidebar';
import { extractHostnameFromUrl } from 'utils/helpers';
import { flipSidebar } from 'utils/flipSidebar/flipSidebar';
import {
  OPEN_AUGMENTATION_BUILDER_MESSAGE,
  ENABLE_AUGMENTATION_BUILDER,
  SEND_LOG_MESSAGE,
  SEND_FRAME_INFO_MESSAGE,
  EXTENSION_SERP_LINK_CLICKED,
  EXTENSION_SERP_FILTER_LINK_CLICKED,
} from 'utils/constants';
import 'antd/lib/button/style/index.css';
import 'antd/lib/tabs/style/index.css';
import './SidebarTabs.scss';

const { TabPane } = Tabs;

export const SidebarTabs: SidebarTabs = ({ forceTab }) => {
  const [activeKey, setActiveKey] = useState<string>(
    !!SidebarLoader.sidebarTabs.length ? '1' : '0',
  );

  useEffect(() => {
    chrome.runtime.onMessage.addListener((msg) => {
      switch (msg.type) {
        // Set up listener for expanding sidebar with the augmentation builder page,
        // when the extension toolbar icon is clicked by the user.
        case OPEN_AUGMENTATION_BUILDER_MESSAGE:
          flipSidebar(document, 'show', SidebarLoader.sidebarTabs?.length);
          setActiveKey(!SidebarLoader.sidebarTabs?.length ? '100' : '0');
          break;
        // LOGGING
        case SEND_FRAME_INFO_MESSAGE:
          if (msg.frame.parentFrameId === -1) {
            chrome.runtime.sendMessage({
              type: SEND_LOG_MESSAGE,
              event: EXTENSION_SERP_LINK_CLICKED,
              properties: {
                query: SidebarLoader.query,
                url: msg.url,
                position_in_serp:
                  SidebarLoader.domains.indexOf(extractHostnameFromUrl(msg.url).hostname) + 1,
              },
            });
          } else {
            const sourceTab = SidebarLoader.sidebarTabs.find(
              (i) => i.url.href === msg.frame.url.replace('www.', ''),
            );
            setTimeout(
              () =>
                chrome.runtime.sendMessage({
                  type: SEND_LOG_MESSAGE,
                  event: EXTENSION_SERP_FILTER_LINK_CLICKED,
                  properties: {
                    query: SidebarLoader.query,
                    url: msg.url,
                    filter_name: sourceTab.title,
                    position_in_serp: SidebarLoader.tabDomains[sourceTab.id].indexOf(msg.url) + 1,
                  },
                }),
              250,
            );
          }
          break;
        default:
          break;
      }
    });
  }, [SidebarLoader.sidebarTabs]);

  const TabBar: TabBar = (props, DefaultTabBar) => (
    <DefaultTabBar {...props} className="insight-tab-bar" />
  );

  const TabTitle = ({ tab, index }) => {
    const handleClick = () => setActiveKey((index + 1).toString());
    return (
      <div onClick={handleClick} className="insight-tab-pill">
        <span
          className={`insight-tab-title ${activeKey === (index + 1).toString() ? 'active' : ''} ${
            activeKey === '0' ? 'hidden' : ''
          }`}
        >
          {tab.isSuggested ? tab.title : `${tab.title} ◾`}
        </span>
      </div>
    );
  };

  const extraContent = {
    left: ENABLE_AUGMENTATION_BUILDER ? (
      <AddAugmentationTab
        numInstalledAugmentations={SidebarLoader.sidebarTabs.length}
        active={(forceTab ?? activeKey) === '0'}
        setActiveKey={setActiveKey}
        onClick={() => (activeKey !== '0' || forceTab !== '0') && setActiveKey('0')}
      />
    ) : (
      <ExternalAddAugmentationButton>➕</ExternalAddAugmentationButton>
    ),
  };

  return (
    <Tabs
      className="insight-tab-container"
      renderTabBar={TabBar}
      activeKey={forceTab ?? activeKey}
      tabBarExtraContent={extraContent}
    >
      <TabPane key="0" tab={null} forceRender>
        <ActiveAugmentationsPage />
      </TabPane>
      {SidebarLoader.sidebarTabs?.map((tab, i) => {
        const showPopup = tab.isSuggested && activeKey === (i + 1).toString();
        return (
          <TabPane
            key={i + 1}
            tab={<TabTitle tab={tab} index={i} />}
            forceRender
            className={`insight-full-tab`}
          >
            {tab.url && <SidebarTabDomains tab={tab} domains={SidebarLoader.tabDomains[tab.id]} />}
            {showPopup && <SuggestedTabPopup tab={tab} setActiveKey={setActiveKey} />}
            {tab.readable && <SidebarTabReadable readable={tab.readable} />}
            {tab.url && <SidebarTabContainer tab={tab} />}
          </TabPane>
        );
      })}
      <TabPane key="100" tab={null} className={`insight-full-tab`}>
        <SearchNeedsImprovementPage setActiveKey={setActiveKey} />
      </TabPane>
    </Tabs>
  );
};

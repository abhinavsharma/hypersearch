/**
 * @module SidebarTabs
 * @author Matyas Angyal<matyas@laso.ai>
 * @license (C) Insight
 * @version 1.0.0
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'route-lite';
import Tabs from 'antd/lib/tabs';
import Button from 'antd/lib/button';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import {
  AddAugmentationTab,
  ActiveAugmentationsPage,
  ExternalAddAugmentationButton,
  EditAugmentationPage,
} from 'modules/augmentations/';
import { SearchNeedsImprovementPage } from 'modules/sidebar';
import ampRemover from 'utils/ampRemover';
import { flipSidebar } from 'utils/flipSidebar/flipSidebar';
import {
  OPEN_AUGMENTATION_BUILDER_MESSAGE,
  ENABLE_AUGMENTATION_BUILDER,
  UPDATE_SIDEBAR_TABS_MESSAGE,
  SEND_LOG_MESSAGE,
  EXTENSION_SERP_FILTER_LOADED,
  SEND_FRAME_INFO_MESSAGE,
  EXTENSION_SERP_LINK_CLICKED,
  EXTENSION_SERP_FILTER_LINK_CLICKED,
} from 'utils/constants';
import 'antd/lib/button/style/index.css';
import 'antd/lib/tabs/style/index.css';
import './SidebarTabs.scss';
import { extractHostnameFromUrl } from 'utils/helpers';

const { TabPane } = Tabs;

export const SidebarTabs: SidebarTabs = ({ forceTab }) => {
  const [activeKey, setActiveKey] = useState<string>(
    !!SidebarLoader.sidebarTabs.length ? '1' : '0',
  );
  // SIDE EFFECTS
  useEffect(() => {
    // Set up listener for expanding sidebar with the augmentation builder page,
    // when the extension toolbar icon is clicked by the user.
    chrome.runtime.onMessage.addListener((msg) => {
      switch (msg.type) {
        case OPEN_AUGMENTATION_BUILDER_MESSAGE:
          flipSidebar(document, 'show', SidebarLoader.sidebarTabs?.length);
          setActiveKey(!SidebarLoader.sidebarTabs?.length ? '100' : '0');
          break;
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
  // Remove Accelerated Modile Page references and make them open in a new browser tab.
  // This script will be injected in the parent document as well as the sidebar.
  const injectAmpRemover = async (el: HTMLIFrameElement) => {
    const currentDocument = el.contentWindow.document;
    const ampRemoverScript = currentDocument.createElement('script');
    ampRemoverScript.type = 'text/javascript';
    ampRemoverScript.innerHTML = ampRemover;
    currentDocument.getElementsByTagName('head')[0].appendChild(ampRemoverScript);
  };

  const handleAddSuggested = () => {
    chrome.runtime.sendMessage({ type: OPEN_AUGMENTATION_BUILDER_MESSAGE });
  };

  const handleHideSuggested = (tab: SidebarTab) => {
    const augmentation = SidebarLoader.suggestedAugmentations.find((i) => i.id === tab.id);
    SidebarLoader.ignoredAugmentations.push(augmentation);
    chrome.storage.local.set({
      [`ignored-${tab.id}`]: augmentation,
    });
    SidebarLoader.suggestedAugmentations = SidebarLoader.suggestedAugmentations.filter(
      (i) => i.id !== augmentation.id,
    );
    const numInstalledAugmentations = SidebarLoader.installedAugmentations.filter(
      (i) => !!i.enabled,
    ).length;
    const numSuggestedAugmentations = SidebarLoader.suggestedAugmentations.length;
    !numSuggestedAugmentations && !numInstalledAugmentations
      ? setActiveKey('100')
      : setActiveKey('1');
    chrome.runtime.sendMessage({ type: UPDATE_SIDEBAR_TABS_MESSAGE });
  };

  // Overwrite the default Ant Design tab bar to be able to style it.
  const TabBar: TabBar = (props, DefaultTabBar) => (
    <DefaultTabBar {...props} className="insight-tab-bar" />
  );

  return (
    <>
      <Tabs
        className="insight-tab-container"
        renderTabBar={TabBar}
        activeKey={forceTab ?? activeKey}
        tabBarExtraContent={{
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
        }}
      >
        <TabPane key="0" tab={null} forceRender>
          <ActiveAugmentationsPage />
        </TabPane>
        {SidebarLoader.sidebarTabs?.map((tab, i) => (
          <TabPane
            key={i + 1}
            tab={
              <div onClick={() => setActiveKey((i + 1).toString())} className="insight-tab-pill">
                <span
                  className={`insight-tab-title ${
                    activeKey === (i + 1).toString() ? 'active' : ''
                  } ${activeKey === '0' ? 'hidden' : ''}`}
                >
                  {tab.isSuggested ? tab.title : `${tab.title} ◾`}
                </span>
              </div>
            }
            forceRender
            className={`insight-full-tab`}
          >
            {tab.isSuggested && activeKey === (i + 1).toString() ? (
              <div className="insight-suggested-tab-popup">
                <div className="insight-suggested-text">Suggested filter:</div>
                <Link
                  component={EditAugmentationPage}
                  componentProps={{
                    augmentation: {
                      ...SidebarLoader.suggestedAugmentations.find((i) => i.id === tab.id),
                      installed: false,
                    },
                    isAdding: true,
                  }}
                  key={tab.id}
                >
                  <Button type="link" onClick={handleAddSuggested}>
                    ➕ Customize
                  </Button>
                </Link>
                <Button type="link" onClick={() => handleHideSuggested(tab)}>
                  ❌ Hide
                </Button>
              </div>
            ) : null}
            {tab.readable && (
              <div
                className="insight-readable-content"
                dangerouslySetInnerHTML={{ __html: tab.readable }}
              />
            )}
            {tab.url && (
              <iframe
                src={tab.url.href}
                className="insight-tab-iframe"
                onLoad={(e) => {
                  injectAmpRemover(e.currentTarget);
                  SidebarLoader.tabDomains[tab.id] = SidebarLoader.getDomains(
                    e.currentTarget.contentWindow.document,
                    'phone',
                    true,
                  );
                  console.log(SidebarLoader.tabDomains[tab.id]);
                  chrome.runtime.sendMessage({
                    type: SEND_LOG_MESSAGE,
                    event: EXTENSION_SERP_FILTER_LOADED,
                    properties: {
                      query: SidebarLoader.query,
                      filter_name: tab.title,
                      domains_to_search: SidebarLoader.domainsToSearch,
                    },
                  });
                }}
              />
            )}
            {tab.isCse && !tab.id.startsWith('cse-custom-') && (
              <div className="insight-tab-bottom-message">
                <a
                  target="blank"
                  href={
                    'http://share.insightbrowser.com/14?prefill_Search%20Engine%20Name=' +
                    tab.title +
                    '&prefill_sample_query=' +
                    new URLSearchParams(window.location.search).get('q')
                  }
                >
                  🤔 Filter needs improvement?
                </a>
              </div>
            )}
          </TabPane>
        ))}
        <TabPane key="100" tab={null} className={`insight-full-tab`}>
          <SearchNeedsImprovementPage setActiveKey={setActiveKey} />
        </TabPane>
      </Tabs>
    </>
  );
};

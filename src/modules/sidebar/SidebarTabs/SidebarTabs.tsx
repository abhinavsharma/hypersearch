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
import ampRemover from 'utils/ampRemover';
import { flipSidebar } from 'utils/flipSidebar/flipSidebar';
import {
  OPEN_AUGMENTATION_BUILDER_MESSAGE,
  ENABLE_AUGMENTATION_BUILDER,
  UPDATE_SIDEBAR_TABS_MESSAGE,
} from 'utils/constants';
import 'antd/lib/button/style/index.css';
import 'antd/lib/tabs/style/index.css';
import './SidebarTabs.scss';

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
      if (msg.type === OPEN_AUGMENTATION_BUILDER_MESSAGE) {
        flipSidebar(document, 'show', SidebarLoader.sidebarTabs?.length);
        setActiveKey('0');
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
    if (
      !SidebarLoader.suggestedAugmentations.length &&
      !SidebarLoader.installedAugmentations.filter((i) => !!i.enabled).length
    ) {
      setActiveKey('0');
    }
    chrome.runtime.sendMessage({ type: UPDATE_SIDEBAR_TABS_MESSAGE });
  };

  // Overwrite the default Ant Design tab bar to be able to style it.
  const TabBar: TabBar = (props, DefaultTabBar) => (
    <DefaultTabBar {...props} className="insight-tab-bar" />
  );

  return (
    <Tabs className="insight-tab-container" renderTabBar={TabBar} activeKey={forceTab ?? activeKey}>
      <TabPane
        key="0"
        tab={
          ENABLE_AUGMENTATION_BUILDER ? (
            <AddAugmentationTab
              numInstalledAugmentations={SidebarLoader.sidebarTabs.length}
              active={(forceTab ?? activeKey) === '0'}
              setActiveKey={setActiveKey}
              onClick={() => (activeKey !== '0' || forceTab !== '0') && setActiveKey('0')}
            />
          ) : (
            <ExternalAddAugmentationButton>➕</ExternalAddAugmentationButton>
          )
        }
        forceRender
      >
        <ActiveAugmentationsPage />
      </TabPane>
      {SidebarLoader.sidebarTabs?.map((tab, i) => (
        <TabPane
          key={i + 1}
          tab={
            <div onClick={() => setActiveKey((i + 1).toString())} className="insight-tab-pill">
              <span
                className={`insight-tab-title ${activeKey === (i + 1).toString() ? 'active' : ''} ${
                  activeKey === '0' ? 'hidden' : ''
                }`}
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
                  ➕ Install Extension
                </Button>
              </Link>
              <Button type="link" onClick={() => handleHideSuggested(tab)}>
                ❌ Hide Extension
              </Button>
            </div>
          ) : null}
          {tab.readable ? (
            <div
              className="insight-readable-content"
              dangerouslySetInnerHTML={{ __html: tab.readable }}
            />
          ) : tab.url ? (
            <iframe
              src={tab.url.href}
              className="insight-tab-iframe"
              id={`insight-tab-frame-${encodeURIComponent(tab.url?.href ?? i)}`}
              onLoad={(e) => injectAmpRemover(e.currentTarget)}
            />
          ) : (
            <></>
          )}
          {tab.isCse && (
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
    </Tabs>
  );
};

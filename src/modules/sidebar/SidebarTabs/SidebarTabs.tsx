import React, { useState, useEffect } from 'react';
import Tabs from 'antd/lib/tabs';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import { AddAugmentationTab, ActiveAugmentationsPage } from 'modules/augmentations/';
import ampRemover from 'utils/ampRemover';
import { flipSidebar } from 'utils/flipSidebar/flipSidebar';
import { OPEN_AUGMENTATION_BUILDER_MESSAGE } from 'utils/constants';
import 'antd/lib/tabs/style/index.css';
import './SidebarTabs.scss';

const { TabPane } = Tabs;

// !DEV Toggle rendering augmentation tab
export const SHOW_AUGMENTATION_TAB = true;

export const ExternalAddAugmentationButton: ExternalAddAugmentationButton = ({
  className,
  children,
}) => (
  <div
    className={`add-augmentation-tab ${className}`}
    onClick={() =>
      window.open(
        'https://share.insightbrowser.com/13?prefill_sample_query=' +
          new URLSearchParams(window.location.search).get('q'),
      )
    }
  >
    {children}
  </div>
);

const TabTitle: TabTitle = ({ title, active, onClick, hide }) => (
  <div onClick={onClick} className="insight-tab-pill">
    <span className={`insight-tab-title ${active ? 'active' : ''} ${hide ? 'hidden' : ''}`}>
      {title}
    </span>
  </div>
);

const TabBar: TabBar = (props, DefaultTabBar) => (
  <DefaultTabBar {...props} className="insight-tab-bar" />
);

export const SidebarTabs: SidebarTabs = ({ forceTab }) => {
  const tabs = SidebarLoader.sidebarTabs;

  const [activeKey, setActiveKey] = useState<string>(!!tabs.length ? '1' : '0');

  useEffect(() => {
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.type === OPEN_AUGMENTATION_BUILDER_MESSAGE) {
        flipSidebar(document, 'show', tabs?.length);
        setActiveKey('0');
      }
    });
  }, [SidebarLoader.sidebarTabs]);

  const injectAmpRemover = async (el: HTMLIFrameElement) => {
    const currentDocument = el.contentWindow.document;
    const ampRemoverScript = currentDocument.createElement('script');
    ampRemoverScript.type = 'text/javascript';
    ampRemoverScript.innerHTML = ampRemover;
    currentDocument.getElementsByTagName('head')[0].appendChild(ampRemoverScript);
  };

  return (
    <Tabs className="insight-tab-container" renderTabBar={TabBar} activeKey={forceTab ?? activeKey}>
      <TabPane
        key="0"
        tab={
          SHOW_AUGMENTATION_TAB ? (
            <AddAugmentationTab
              installedAugmentationsNum={tabs.length}
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
      {tabs?.map((tab, i) => {
        const tabId = `insight-tab-frame-${encodeURIComponent(tab.url?.href ?? i)}`;
        return (
          <TabPane
            key={i + 1}
            tab={
              <TabTitle
                title={tab.title}
                active={activeKey === (i + 1).toString()}
                length={tabs.length}
                onClick={() => setActiveKey((i + 1).toString())}
                hide={activeKey === '0'}
              />
            }
            forceRender
            className={`insight-full-tab`}
          >
            {tab.readable ? (
              <div
                className="insight-readable-content"
                dangerouslySetInnerHTML={{ __html: tab.readable }}
              />
            ) : tab.url ? (
              <iframe
                src={tab.url.href}
                className="insight-tab-iframe"
                id={tabId}
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
                    'http://share.insightbrowser.com/14?prefill_Search%20Engine%20Name=' + tab.title + '&prefill_sample_query=' + new URLSearchParams(window.location.search).get('q')
                  }
                >
                  🤔 Filter needs improvement?
                </a>
              </div>
            )}
          </TabPane>
        );
      })}
    </Tabs>
  );
};

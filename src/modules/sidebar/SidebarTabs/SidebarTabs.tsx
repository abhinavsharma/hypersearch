import React, { useState, useEffect, useCallback } from 'react';
import ampRemover from 'utils/ampRemover';
import { flipSidebar } from 'lib/flipSidebar/flipSidebar';
import Tabs from 'antd/lib/tabs';
import { AddAugmentationTab, ActiveAugmentationsPage } from 'modules/augmentations/';
import { EDIT_AUGMENTATION_SUCCESS, OPEN_AUGMENTATION_BUILDER_MESSAGE } from 'utils/messages';
import 'antd/lib/tabs/style/index.css';
import './SidebarTabs.scss';
import { getLocalAugmentations } from 'lib/getLocalAugmentations/getLocalAugmentations';

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

export const SidebarTabs: SidebarTabs = ({ tabs, forceTab }) => {
  const [activeKey, setActiveKey] = useState<string>(forceTab ?? tabs.length === 0 ? '0' : '1');
  const [installedAugmentations, setInstalledAugmentations] = useState<SidebarTab[]>([]);

  const loadAugmentations = useCallback(async () => {
    const results = await getLocalAugmentations();
    const newTabs = tabs.filter((i) => !i.isCse || results.includes(i.id));
    setInstalledAugmentations(newTabs);
    !newTabs.length && setActiveKey('0');
  }, []);

  useEffect(() => {
    chrome.runtime.onMessage.addListener((msg) => {
      switch (msg.type) {
        case OPEN_AUGMENTATION_BUILDER_MESSAGE:
          flipSidebar(document, 'show', tabs.length);
          setActiveKey('0');
          break;
        case EDIT_AUGMENTATION_SUCCESS:
          loadAugmentations();
          break;
        default:
          break;
      }
    });
  }, []);

  useEffect(() => {
    loadAugmentations();
  }, [loadAugmentations]);

  const injectAmpRemover = async (el: HTMLIFrameElement) => {
    const currentDocument = el.contentWindow.document;
    const ampRemoverScript = currentDocument.createElement('script');
    ampRemoverScript.type = 'text/javascript';
    ampRemoverScript.innerHTML = ampRemover;
    currentDocument.getElementsByTagName('head')[0].appendChild(ampRemoverScript);
  };

  return (
    <Tabs
      defaultActiveKey={installedAugmentations.length ? '1' : '0'}
      className="insight-tab-container"
      renderTabBar={TabBar}
      activeKey={forceTab ?? activeKey}
    >
      {/* First tab is always the augmentation page */}
      <TabPane
        key="0"
        tab={
          SHOW_AUGMENTATION_TAB ? (
            <AddAugmentationTab
              installedAugmentationsNum={installedAugmentations.length}
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

      {installedAugmentations.map((tab, i) => {
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
            ) : (
              <iframe
                src={tab.url.href}
                className="insight-tab-iframe"
                id={tabId}
                onLoad={(e) => injectAmpRemover(e.currentTarget)}
              />
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

import React, { useState } from 'react';
import ampRemover from 'utils/ampRemover';
import Tabs from 'antd/lib/tabs';
import { AddAugmentationTab } from 'components/AddAugmentationTab/AddAugmentationTab';
import { ActiveAugmentationsPage } from 'components/ActiveAugmentationsPage/ActiveAugmentationsPage';
import 'antd/lib/tabs/style/index.css';
import './SidebarTabs.scss';

const { TabPane } = Tabs;

// !DEV Toggle rendering augmentation tab
const SHOW_AUGMENTATION_TAB = false;

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
  const [activeKey, setActiveKey] = useState<string>('1');

  const injectAmpRemover = async (el: HTMLIFrameElement) => {
    const currentDocument = el.contentWindow.document;
    const ampRemoverScript = currentDocument.createElement('script');
    ampRemoverScript.type = 'text/javascript';
    ampRemoverScript.innerHTML = ampRemover;
    currentDocument.getElementsByTagName('head')[0].appendChild(ampRemoverScript);
  };

  return (
    <Tabs
      defaultActiveKey={'1'}
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
              active={activeKey === '0'}
              setActiveKey={setActiveKey}
              onClick={() => activeKey !== '0' && setActiveKey('0')}
            />
          ) : (
            ''
          )
        }
        forceRender
      >
        <ActiveAugmentationsPage />
      </TabPane>

      {tabs.map((tab, i) => {
        const tabId = `insight-tab-frame-${encodeURIComponent(tab.url.href)}`;
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
            <iframe
              src={tab.url.href}
              className="insight-tab-iframe"
              id={tabId}
              onLoad={(e) => injectAmpRemover(e.currentTarget)}
            />
            <div className="insight-tab-bottom-message">
              <a
                target="blank"
                href={
                  'https://airtable.com/shrUcWah2XxEM1YLl?prefill_Search%20Engine%20Name=' +
                  tab.title
                }
              >
                Improve this search filter
              </a>
            </div>
          </TabPane>
        );
      })}
    </Tabs>
  );
};

import React, { useState } from 'react';
import ampRemover from 'utils/ampRemover';
import Tabs from 'antd/lib/tabs';
import { AddAugmentationTab } from 'components/AddAugmentationTab/AddAugmentationTab';
import 'antd/lib/tabs/style/index.css';
import './SidebarTabs.scss';

const { TabPane } = Tabs;

const TabTitle: TabTitle = ({ title, active, length, onClick }) => {
  const style = {
    width: `${(100 / length) | 0}%`,
  };

  return (
    <span className={`insight-tab-title ${active ? 'active' : ''}`} style={style} onClick={onClick}>
      {title}
    </span>
  );
};

const TabBar: TabBar = (props, DefaultTabBar) => (
  <DefaultTabBar {...props} className="insight-tab-bar" />
);

export const SidebarTabs: SidebarTabs = ({ tabs }) => {
  const [activeKey, setActiveKey] = useState<string>('1');

  const handleChange = (e: string) => {
    setActiveKey((tabs.findIndex((i) => i.title === e) + 1).toString());
  };

  const injectAmpRemover = async (el: HTMLIFrameElement) => {
    const currentDocument = el.contentWindow.document;
    const scriptTag = currentDocument.createElement('script');
    scriptTag.type = 'text/javascript';
    scriptTag.innerHTML = ampRemover;
    currentDocument.getElementsByTagName('head')[0].appendChild(scriptTag);
  };

  return (
    <Tabs
      defaultActiveKey="1"
      className="insight-tab-container"
      renderTabBar={TabBar}
      activeKey={activeKey}
    >
      <TabPane
        key="0"
        tab={
          <AddAugmentationTab
            active={activeKey === '0'}
            setActiveKey={setActiveKey}
            onClick={() => activeKey !== '0' && setActiveKey('0')}
          />
        }
      >
        <h1>Add Augmentation Page</h1>
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
              />
            }
            className="insight-full-tab"
            forceRender
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

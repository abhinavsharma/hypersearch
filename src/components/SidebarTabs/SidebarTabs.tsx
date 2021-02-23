import React, { useState } from 'react';
import ampRemover from 'utils/ampRemover';
import Tabs from 'antd/lib/tabs';
import 'antd/lib/tabs/style/index.css';
import './SidebarTabs.scss';

const { TabPane } = Tabs;

const TabTitle: TabTitle = ({ title, active }) => (
  <div className={`insight-tab-title ${active ? 'active' : ''}`}>{title}</div>
);

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
      onChange={handleChange}
    >
      {tabs.map((tab, i) => {
        const tabId = `insight-tab-frame-${encodeURIComponent(tab.url.href)}`;
        return (
          <TabPane
            key={tab.title}
            tab={<TabTitle title={tab.title} active={activeKey === (i + 1).toString()} />}
            className="insight-full-tab"
            forceRender
          >
            <iframe
              src={tab.url.href}
              className="insight-tab-iframe"
              id={tabId}
              onLoad={(e) => injectAmpRemover(e.currentTarget)}
            />
          </TabPane>
        );
      })}
    </Tabs>
  );
};

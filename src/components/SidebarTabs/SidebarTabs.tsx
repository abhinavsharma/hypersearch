import React, { useState } from 'react';
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

  return (
    <Tabs
      defaultActiveKey="1"
      className="insight-tab-container"
      renderTabBar={TabBar}
      onChange={handleChange}
    >
      {tabs.map((tab, i) => {
        return (
          <TabPane
            key={tab.title}
            tab={<TabTitle title={tab.title} active={activeKey === (i + 1).toString()} />}
            className="insight-full-tab"
          >
            <iframe src={tab.url.href} className="insight-tab-iframe" />
          </TabPane>
        );
      })}
    </Tabs>
  );
};

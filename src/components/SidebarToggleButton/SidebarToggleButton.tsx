import React from 'react';
import List from 'antd/lib/list';
import { flipSidebar } from 'lib/flipSidebar/flipSidebar';
import './SidebarToggleButton.scss';

const ListItem = (item: SidebarTab) => (
  <List.Item>
    <List.Item.Meta title={item.title} />
  </List.Item>
);

export const SidebarToggleButton: SidebarToggleButton = ({ tabs }) => {
  const handleClick = () => {
    flipSidebar(document, 'show');
  };

  return (
    <div onClick={handleClick} className="insight-sidebar-toggle-button">
      <List itemLayout="horizontal" dataSource={tabs} renderItem={ListItem} />
    </div>
  );
};

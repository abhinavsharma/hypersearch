import React from 'react';
import List from 'antd/lib/list';
import { flipSidebar } from 'lib/flipSidebar/flipSidebar';
import { ExternalAddAugmentationButton, SHOW_AUGMENTATION_TAB } from 'modules/sidebar';
import './SidebarToggleButton.scss';

const ListItem = (item: SidebarTab) => (
  <List.Item>
    <List.Item.Meta title={item.title} />
  </List.Item>
);

export const SidebarToggleButton: SidebarToggleButton = ({ tabs }) => {
  const handleClick = () => {
    flipSidebar(document, 'show', tabs.length);
  };

  return !!tabs.length ? (
    <div onClick={handleClick} className="insight-sidebar-toggle-button">
      <List itemLayout="horizontal" dataSource={tabs} renderItem={ListItem} />
    </div>
  ) : (
    <>
      {SHOW_AUGMENTATION_TAB ? (
        <div
          className="add-augmentation-button insight-sidebar-toggle-button"
          onClick={handleClick}
        >
          I
        </div>
      ) : (
        <ExternalAddAugmentationButton className="insight-sidebar-toggle-button add-augmentation-button external">
          🤔
        </ExternalAddAugmentationButton>
      )}
    </>
  );
};

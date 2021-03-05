/**
 * @module SidebarToggleButton
 * @author Matyas Angyal<matyas@laso.ai>
 * @license (C) Insight
 * @version 1.0.0
 */
import React from 'react';
import List from 'antd/lib/list';
import { flipSidebar } from 'utils/flipSidebar/flipSidebar';
import { ENABLE_AUGMENTATION_BUILDER, OPEN_AUGMENTATION_BUILDER_MESSAGE } from 'utils/constants';
import { ExternalAddAugmentationButton } from 'modules/augmentations';
import './SidebarToggleButton.scss';

export const SidebarToggleButton: SidebarToggleButton = ({ tabs }) => {
  const handleClick = () => {
    !tabs.length
      ? chrome.runtime.sendMessage({ type: OPEN_AUGMENTATION_BUILDER_MESSAGE })
      : flipSidebar(document, 'show', tabs?.length);
  };

  const ListItem = (item: SidebarTab) => (
    <List.Item>
      <List.Item.Meta title={item.title} />
    </List.Item>
  );

  return !!tabs?.length ? (
    <div onClick={handleClick} className="insight-sidebar-toggle-button">
      <List itemLayout="horizontal" dataSource={tabs} renderItem={ListItem} />
    </div>
  ) : (
    <>
      {ENABLE_AUGMENTATION_BUILDER ? (
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

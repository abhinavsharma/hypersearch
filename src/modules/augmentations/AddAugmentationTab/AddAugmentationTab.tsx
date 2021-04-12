import React, { useEffect, useState } from 'react';
import Button from 'antd/lib/button';
import { goBack } from 'route-lite';
import { flipSidebar, getFirstValidTabIndex, OPEN_AUGMENTATION_BUILDER_MESSAGE } from 'utils';
import 'antd/lib/button/style/index.css';
import './AddAugmentationTab.scss';

export const AddAugmentationTab: AddAugmentationTab = ({ tabs, active, setActiveKey }) => {
  const handleClose = () => {
    if (getFirstValidTabIndex(tabs) === '0') {
      flipSidebar(window.top.document, 'hide', 0);
    } else {
      setActiveKey(getFirstValidTabIndex(tabs));
      goBack();
    }
  };

  const handleOpenBuilder = () =>
    chrome.runtime.sendMessage({ type: OPEN_AUGMENTATION_BUILDER_MESSAGE });

  return (
    <div id="add-augmentation-tab">
      {!active ? (
        <div className="open-builder-button">
          <Button
            icon="☰"
            type="text"
            onClick={handleOpenBuilder}
            className={getFirstValidTabIndex(tabs) !== '0' ? '' : 'hidden'}
          />
        </div>
      ) : (
        <div className={`builder-header ${active ? 'active' : ''}`}>
          <Button type="link" onClick={handleClose}>
            Close
          </Button>
          <span>Lenses</span>
        </div>
      )}
    </div>
  );
};

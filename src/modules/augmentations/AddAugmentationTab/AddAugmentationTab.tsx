import React, { Suspense } from 'react';
import Button from 'antd/lib/button';
import {
  flipSidebar,
  getFirstValidTabIndex,
  OPEN_AUGMENTATION_BUILDER_MESSAGE,
  OPEN_BUILDER_PAGE,
  OPEN_SETTINGS_PAGE_MESSAGE,
} from 'utils';
import 'antd/lib/button/style/index.css';
import './AddAugmentationTab.scss';

const SettingOutlined = React.lazy(
  async () => await import('@ant-design/icons/SettingOutlined').then((mod) => mod),
);

export const AddAugmentationTab: AddAugmentationTab = ({ tabs, active, setActiveKey }) => {
  const handleClose = () => {
    if (getFirstValidTabIndex(tabs) === '0') {
      flipSidebar(window.top.document, 'hide', 0, true);
    } else {
      setActiveKey(getFirstValidTabIndex(tabs));
    }
  };

  const handleOpenSettings = () => {
    chrome.runtime.sendMessage({ type: OPEN_SETTINGS_PAGE_MESSAGE });
  };

  const handleOpenBuilder = () =>
    chrome.runtime.sendMessage({
      type: OPEN_AUGMENTATION_BUILDER_MESSAGE,
      page: OPEN_BUILDER_PAGE.ACTIVE,
    } as OpenActivePageMessage);

  return (
    <div id="add-augmentation-tab">
      {!active ? (
        <Button
          icon="☰"
          type="text"
          onClick={handleOpenBuilder}
          className={`tab-button ${getFirstValidTabIndex(tabs) !== '0' ? '' : 'hidden'}`}
        />
      ) : (
        <header className={active ? 'active' : ''}>
          <Button type="link" className="close-button" onClick={handleClose}>
            Close
          </Button>
          <span className="title">Lenses</span>
          <Button type="text" className="setting-button" onClick={handleOpenSettings}>
            <Suspense fallback={null}>
              <SettingOutlined />
            </Suspense>
          </Button>
        </header>
      )}
    </div>
  );
};

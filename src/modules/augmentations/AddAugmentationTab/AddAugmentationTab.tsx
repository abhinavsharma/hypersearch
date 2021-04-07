import React, { Suspense } from 'react';
import Button from 'antd/lib/button';
import { Dropdown } from 'modules/shared';
import { goBack } from 'route-lite';
import { getFirstValidTabIndex, OPEN_AUGMENTATION_BUILDER_MESSAGE } from 'utils';
import './AddAugmentationTab.scss';
import 'antd/lib/button/style/index.css';

const ZoomInOutlined = React.lazy(
  async () => await import('@ant-design/icons/ZoomInOutlined').then((mod) => mod),
);

const UnorderedListOutlined = React.lazy(
  async () => await import('@ant-design/icons/UnorderedListOutlined').then((mod) => mod),
);

export const AddAugmentationTab: AddAugmentationTab = ({ tabs, active, setActiveKey }) => {
  const handleClose = () => {
    setActiveKey(getFirstValidTabIndex(tabs));
    goBack();
  };

  const items = [
    <Button
      className="dropdown-button"
      type="link"
      onClick={() => chrome.runtime.sendMessage({ type: OPEN_AUGMENTATION_BUILDER_MESSAGE })}
    >
      <Suspense fallback={null}><UnorderedListOutlined /></Suspense> List All Lenses
    </Button>,
    <Button
      className="dropdown-button"
      type="link"
      onClick={() =>
        chrome.runtime.sendMessage({ type: OPEN_AUGMENTATION_BUILDER_MESSAGE, create: true })
      }
    >
      <Suspense fallback={null}><ZoomInOutlined /></Suspense> Create New Lens
    </Button>,
  ];

  return !active ? (
    <div className="add-augmentation-tab">
      <Dropdown button="☰" items={items} />
    </div>
  ) : (
    <div className={`add-augmentation-tab-header ${active ? 'active' : ''}`}>
      <Button
        type="link"
        onClick={handleClose}
        className={getFirstValidTabIndex(tabs) !== '0' ? '' : 'hidden'}
      >
        Close
      </Button>
      <span>Lenses</span>
    </div>
  );
};

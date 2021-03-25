import React from 'react';
import Button from 'antd/lib/button';
import { Dropdown } from 'modules/shared';
import { goBack } from 'route-lite';
import { AIRTABLE_IMPROVE_SEARCH_LINK, OPEN_AUGMENTATION_BUILDER_MESSAGE } from 'utils/constants';
import './AddAugmentationTab.scss';
import 'antd/lib/button/style/index.css';

export const AddAugmentationTab: AddAugmentationTab = ({
  active,
  setActiveKey,
  numInstalledAugmentations,
}) => {
  const handleClose = () => {
    setActiveKey('1');
    goBack();
  };

  const items = [
    <Button
      className="dropdown-button"
      type="link"
      onClick={() => chrome.runtime.sendMessage({ type: OPEN_AUGMENTATION_BUILDER_MESSAGE })}
    >
      🔍 List All Lenses
    </Button>,
    <Button
    className="dropdown-button"
    type="link"
    onClick={() =>
      chrome.runtime.sendMessage({ type: OPEN_AUGMENTATION_BUILDER_MESSAGE, create: true })
    }
    >
      ➕ Add Lens
    </Button>,
    <Button
      className="dropdown-button"
      type="link"
      onClick={() => window.open(AIRTABLE_IMPROVE_SEARCH_LINK)}
    >
      🤔 Send Feedback
    </Button>,
  ];

  return !active ? (
    <div className="add-augmentation-tab">
      <Dropdown button="…" items={items} />
    </div>
  ) : (
    <div className={`add-augmentation-tab-header ${active ? 'active' : ''}`}>
      <Button
        type="link"
        onClick={handleClose}
        className={numInstalledAugmentations ? '' : 'hidden'}
      >
        Close
      </Button>
      <span>Lenses</span>
    </div>
  );
};

import React from 'react';
import Button from 'antd/lib/button';
import { goBack } from 'route-lite';
import 'antd/lib/button/style/index.css';
import './AddAugmentationTab.scss';

export const AddAugmentationTab: AddAugmentationTab = ({
  active,
  setActiveKey,
  onClick,
  numInstalledAugmentations,
}) => {
  const handleClose = () => {
    goBack();
    setActiveKey(numInstalledAugmentations ? '1' : '0');
  };

  return !active ? (
    <div className="add-augmentation-tab" onClick={onClick}>
      🚀
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
      <span>Extensions</span>
    </div>
  );
};

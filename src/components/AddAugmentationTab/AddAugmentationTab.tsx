import React from 'react';
import Button from 'antd/lib/button';
import { goBack } from 'route-lite';
import 'antd/lib/button/style/index.css';
import './AddAugmentationTab.scss';

export const AddAugmentationTab: AddAugmentationTab = ({ active, setActiveKey, onClick }) => {
  const handleClose = () => {
    goBack();
    setActiveKey('1');
  };

  return !active ? (
    <div className="add-augmentation-tab" onClick={onClick}>
      🚀
    </div>
  ) : (
    <div className="add-augmentation-tab-header">
      <Button type="link" onClick={handleClose}>
        Close
      </Button>
      <span>Extensions</span>
    </div>
  );
};

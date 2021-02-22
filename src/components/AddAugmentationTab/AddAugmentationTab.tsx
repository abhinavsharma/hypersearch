import React from 'react';
import Button from 'antd/lib/button';
import 'antd/lib/button/style/index.css';
import './AddAugmentationTab.scss';

export const AddAugmentationTab: AddAugmentationTab = ({ active, setActiveKey, onClick }) => {
  const handleClose = () => {
    setActiveKey('1');
  };

  return !active ? (
    <div className="add-augmentation-tab insight-tab-title" onClick={onClick}>
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

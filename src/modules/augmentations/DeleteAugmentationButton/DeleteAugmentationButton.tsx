import React, { Suspense } from 'react';
import { goBack } from 'route-lite';
import Button from 'antd/lib/button';
import { MY_BLOCKLIST_ID } from 'utils/constants';
import AugmentationManager from 'lib/AugmentationManager/AugmentationManager';
import 'antd/lib/button/style/index.css';

const DeleteOutlined = React.lazy(
  async () => await import('@ant-design/icons/DeleteOutlined').then((mod) => mod),
);

export const DeleteAugmentationButton: DeleteAugmentationButton = ({ augmentation, disabled }) => {
  const handleDelete = () => {
    if (disabled || augmentation.id === MY_BLOCKLIST_ID) return null;
    AugmentationManager.removeInstalledAugmentation(augmentation);
    setTimeout(() => goBack(), 100);
  };

  return (
    <div className="button-container">
      <Button
        onClick={handleDelete}
        type="link"
        danger
        size="large"
        className="insight-augmentation-delete-button"
      >
        <div
          className={`insight-augmentation-delete-button-content ${
            disabled || augmentation.id === MY_BLOCKLIST_ID ? 'disabled' : ''
          }`}
        >
          <Suspense fallback={null}>
            <DeleteOutlined />
          </Suspense>
          <span>Delete Lens</span>
        </div>
      </Button>
    </div>
  );
};

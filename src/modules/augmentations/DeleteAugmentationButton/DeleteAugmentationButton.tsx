import React, { Suspense } from 'react';
import { goBack } from 'route-lite';
import Button from 'antd/lib/button';
import { SEARCH_HIDE_DOMAIN_ACTION } from 'utils/constants';
import AugmentationManager from 'lib/AugmentationManager/AugmentationManager';
import 'antd/lib/button/style/index.css';

const DeleteOutlined = React.lazy(
  async () => await import('@ant-design/icons/DeleteOutlined').then((mod) => mod),
);

export const DeleteAugmentationButton: DeleteAugmentationButton = ({ augmentation, disabled }) => {
  const handleDelete = () => {
    if (disabled) return null;
    AugmentationManager.removeInstalledAugmentation(augmentation);
    setTimeout(() => goBack(), 100);
  };

  return (
    <Button
      onClick={handleDelete}
      type="link"
      danger
      size="large"
      className="insight-augmentation-delete-button"
    >
      <div className={`insight-augmentation-delete-button-content ${disabled ? 'disabled' : ''}`}>
        <Suspense fallback={null}>
          <DeleteOutlined />
        </Suspense>
        <span>Delete Lens</span>
      </div>
    </Button>
  );
};

import React, { Suspense } from 'react';
import Button from 'antd/lib/button';
import AugmentationManager from 'lib/AugmentationManager/AugmentationManager';
import {
  MY_BLOCKLIST_ID,
  OPEN_AUGMENTATION_BUILDER_MESSAGE,
  OPEN_BUILDER_PAGE,
  PROTECTED_AUGMENTATIONS,
} from 'utils/constants';
import 'antd/lib/button/style/index.css';

const DELETE_TEXT = 'Delete Lens';

const DeleteOutlined = React.lazy(
  async () => await import('@ant-design/icons/DeleteOutlined').then((mod) => mod),
);

export const DeleteAugmentationButton: DeleteAugmentationButton = ({ augmentation, disabled }) => {
  const handleDelete = (): void => {
    if (disabled || augmentation.id === MY_BLOCKLIST_ID) return null;
    AugmentationManager.removeInstalledAugmentation(augmentation);
    chrome.runtime.sendMessage({
      type: OPEN_AUGMENTATION_BUILDER_MESSAGE,
      page: OPEN_BUILDER_PAGE.ACTIVE,
    } as OpenActivePageMessage);
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
            disabled || PROTECTED_AUGMENTATIONS.includes(augmentation.id) ? 'disabled' : ''
          }`}
        >
          <Suspense fallback={null}>
            <DeleteOutlined />
          </Suspense>
          <span>{DELETE_TEXT}</span>
        </div>
      </Button>
    </div>
  );
};

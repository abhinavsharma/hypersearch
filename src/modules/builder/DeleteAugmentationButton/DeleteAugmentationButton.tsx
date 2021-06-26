/**
 * @module modules:builder
 * @version 1.0.0
 * @license (C) Insight
 */

import React, { Suspense } from 'react';
import Button from 'antd/lib/button';
import AugmentationManager from 'lib/augmentations';
import { AUGMENTATION_ID, MESSAGE, PAGE, PROTECTED_AUGMENTATIONS } from 'constant';
import 'antd/lib/button/style/index.css';

const DeleteOutlined = React.lazy(
  async () => await import('@ant-design/icons/DeleteOutlined').then((mod) => mod),
);

//-----------------------------------------------------------------------------------------------
// ! Magics
//-----------------------------------------------------------------------------------------------
const DELETE_TEXT = 'Delete Lens';

//-----------------------------------------------------------------------------------------------
// ! Component
//-----------------------------------------------------------------------------------------------
export const DeleteAugmentationButton: DeleteAugmentationButton = ({ augmentation, disabled }) => {
  //-----------------------------------------------------------------------------------------------
  // ! Handlers
  //-----------------------------------------------------------------------------------------------
  const handleDelete = (): void => {
    if (disabled || augmentation.id === AUGMENTATION_ID.BLOCKLIST) return;
    AugmentationManager.removeInstalledAugmentation(augmentation);
    chrome.runtime.sendMessage({
      type: MESSAGE.OPEN_PAGE,
      page: PAGE.ACTIVE,
    });
  };

  //-----------------------------------------------------------------------------------------------
  // ! Render
  //-----------------------------------------------------------------------------------------------
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
            disabled || (PROTECTED_AUGMENTATIONS as readonly string[]).includes(augmentation.id)
              ? 'disabled'
              : ''
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

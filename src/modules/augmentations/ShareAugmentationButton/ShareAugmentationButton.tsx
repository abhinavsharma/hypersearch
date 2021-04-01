import React, { Suspense, useCallback } from 'react';
import Button from 'antd/lib/button';
import AugmentationManager from 'lib/AugmentationManager/AugmentationManager';
import 'antd/lib/button/style/index.css';

const UploadOutlined = React.lazy(
  async () => await import('@ant-design/icons/UploadOutlined').then((mod) => mod),
);

export const ShareAugmentationButton: ShareAugmentationButton = ({ augmentation, disabled }) => {
  const handleShare = useCallback(async () => {
    await AugmentationManager.shareAugmentation(augmentation);
  }, []);

  return (
    <Button
      onClick={handleShare}
      type="link"
      size="large"
      className="insight-augmentation-share-button"
    >
      <div className={`insight-augmentation-share-button-content ${disabled ? 'disabled' : ''}`}>
        <Suspense fallback={null}>
          <UploadOutlined />
        </Suspense>
        <span>Share Lens</span>
      </div>
    </Button>
  );
};

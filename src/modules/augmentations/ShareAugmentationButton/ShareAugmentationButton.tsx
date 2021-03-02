import React, { Suspense } from 'react';
import Button from 'antd/lib/button';
import 'antd/lib/button/style/index.css';

const UploadOutlined = React.lazy(
  async () => await import('@ant-design/icons/UploadOutlined').then((mod) => mod),
);

export const ShareAugmentationButton = () => (
  <Button type="link" size="large" className="insight-augmentation-share-button">
    <div className="insight-augmentation-share-button-content">
      <Suspense fallback={null}>
        <UploadOutlined />
      </Suspense>
      <span>Share Extension</span>
    </div>
  </Button>
);

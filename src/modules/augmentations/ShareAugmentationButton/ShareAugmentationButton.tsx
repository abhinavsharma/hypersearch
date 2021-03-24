import React, { Suspense, useCallback } from 'react';
import Button from 'antd/lib/button';
import 'antd/lib/button/style/index.css';

// TODO: implement share logic
// !DEV Toggle share button status
const DISABLE_SHARE_BUTTON = true;

const UploadOutlined = React.lazy(
  async () => await import('@ant-design/icons/UploadOutlined').then((mod) => mod),
);

export const ShareAugmentationButton: ShareAugmentationButton = ({ augmentation, disabled }) => {
  // TODO: generate base64 hash from augmentation
  /* const base64 = btoa(escape(JSON.stringify(augmentation)))
    .split('')
    .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
    .join('');
  const encodedAugmentation = md5(base64).substr(0, 10);
 */
  const handleShare = useCallback(async () => {
    // TODO: fetch extensions.insightbrowser to store the augmentation
    /* const result = await fetch(`https://extensions.insightbrowser.com/extend?text=${base64}`, {
      mode: 'no-cors',
    });
    const res = await result.text();
    console.log(res); */
  }, []);

  return (
    <Button
      onClick={handleShare}
      type="link"
      size="large"
      className="insight-augmentation-share-button"
    >
      <div
        className={`insight-augmentation-share-button-content ${
          // TODO: switch back disabled state to variable
          /* disabled */ DISABLE_SHARE_BUTTON ? 'disabled' : ''
        }`}
      >
        <Suspense fallback={null}>
          <UploadOutlined />
        </Suspense>
        <span>Share Lens</span>
      </div>
    </Button>
  );
};

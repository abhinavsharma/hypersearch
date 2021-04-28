import React, { Suspense, useEffect, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import Button from 'antd/lib/button';
import Popover from 'antd/lib/popover';
import Typography from 'antd/lib/typography';
import { Share } from 'react-feather';
import AugmentationManager from 'lib/AugmentationManager/AugmentationManager';
import {
  AIRTABLE_PUBLIC_LENSES_CREATE,
  b64EncodeUnicode,
  EXTENSION_SHARE_URL,
  EXTENSION_SHORT_URL_RECEIVED,
  MY_BLOCKLIST_ID,
  SIDEBAR_Z_INDEX,
} from 'utils';
import 'antd/lib/typography/style/index.css';
import 'antd/lib/button/style/index.css';
import 'antd/lib/popover/style/index.css';
import './ShareButton.scss';

const { Paragraph } = Typography;

const CopyOutlined = React.lazy(
  async () => await import('@ant-design/icons/CopyOutlined').then((mod) => mod),
);

const UploadOutlined = React.lazy(
  async () => await import('@ant-design/icons/UploadOutlined').then((mod) => mod),
);

export const ShareButton: ShareButton = ({ icon, disabled, augmentation }) => {
  const encoded = b64EncodeUnicode(
    JSON.stringify({
      ...augmentation,
      id:
        augmentation.id === MY_BLOCKLIST_ID
          ? augmentation.id.concat(`-${uuid()}`)
          : augmentation.id,
    }),
  );

  const [url, setUrl] = useState<string>(EXTENSION_SHARE_URL + encoded);
  const [shared, setShared] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(undefined);
  const tooltipContainer = useRef(null);

  const handleShare = async () => {
    setVisible(undefined);
    if (shared) return;
    await AugmentationManager.shareAugmentation(encoded);
    setShared(true);
  };

  useEffect(() => {
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.type === EXTENSION_SHORT_URL_RECEIVED) {
        setUrl(msg.shortUrl);
      }
    });
  }, []);

  const popoverContent = () => (
    <>
      <Paragraph
        className="copyable-text"
        copyable={{
          icon: [
            <Suspense fallback={null}>
              <CopyOutlined />
            </Suspense>,
            <Suspense fallback={null}>
              <CopyOutlined />
            </Suspense>,
          ],
          tooltips: ['Click to Copy', 'Copied'],
        }}
        ellipsis={{ rows: 3 }}
      >
        {url}
      </Paragraph>
      <div className="popover-button-container">
        <Button
          type="default"
          className="popover-primary-button"
          onClick={() =>
            window.open(
              AIRTABLE_PUBLIC_LENSES_CREATE.replace('<base64>', encoded)
                .replace('<name>', augmentation.name)
                .replace('<description>', augmentation.description),
            )
          }
        >
          Submit to Bazaar
        </Button>
        <Button type="link" target="_blank" href="https://bazaar.insight.so">
          Browse Bazaar
        </Button>
      </div>
    </>
  );

  return (
    <div className="share-button-container  button-container">
      <Popover
        style={{ width: 400 }}
        content={popoverContent}
        title={
          <div className="popover-title">
            {`Share ${augmentation.name}`}
            <Button className="popover-close-button" type="link" onClick={() => setVisible(false)}>
              Close
            </Button>
          </div>
        }
        trigger="hover"
        onVisibleChange={(visible) => visible && !shared && handleShare()}
        visible={!disabled && visible}
        destroyTooltipOnHide={{ keepParent: false }}
        getPopupContainer={() => tooltipContainer.current}
        placement={icon ? 'bottomRight' : 'topLeft'}
      >
        {icon ? (
          <Button type="link" onClick={handleShare} icon={<Share size={15} stroke={'#999'} />} />
        ) : (
          <Button
            type="link"
            size="large"
            onClick={handleShare}
            className="insight-augmentation-share-button"
          >
            <div
              className={`insight-augmentation-share-button-content ${disabled ? 'disabled' : ''}`}
            >
              <Suspense fallback={null}>
                <UploadOutlined />
              </Suspense>
              <span>Share Lens</span>
            </div>
          </Button>
        )}
      </Popover>
      <div
        className="tooltip-container"
        ref={tooltipContainer}
        style={{ zIndex: SIDEBAR_Z_INDEX + 1 }}
      />
    </div>
  );
};

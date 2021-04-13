import React, { Suspense, useRef, useState } from 'react';
import md5 from 'md5';
import Button from 'antd/lib/button';
import Popover from 'antd/lib/popover';
import Typography from 'antd/lib/typography';
import AugmentationManager from 'lib/AugmentationManager/AugmentationManager';
import {
  AIRTABLE_PUBLIC_LENSES_CREATE,
  b64EncodeUnicode,
  EXTENSION_SHORT_SHARE_URL,
  SIDEBAR_Z_INDEX,
} from 'utils';
import 'antd/lib/typography/style/index.css';
import 'antd/lib/button/style/index.css';
import 'antd/lib/popover/style/index.css';
import './ShareButton.scss';
import { Input, Tooltip } from 'antd';

const { Paragraph } = Typography;

const CopyOutlined = React.lazy(
  async () => await import('@ant-design/icons/CopyOutlined').then((mod) => mod),
);


const UploadOutlined = React.lazy(
  async () => await import('@ant-design/icons/UploadOutlined').then((mod) => mod),
);

const ShareAltOutlined = React.lazy(
  async () => await import('@ant-design/icons/ShareAltOutlined').then((mod) => mod),
);

export const ShareButton: ShareButton = ({ icon, disabled, augmentation }) => {
  const [shared, setShared] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(undefined);
  const tooltipContainer = useRef(null);

  const encoded = b64EncodeUnicode(JSON.stringify(augmentation));

  const handleClick = async () => {
    setVisible(undefined);
    if (shared) return;
    await AugmentationManager.shareAugmentation(encoded);
    setShared(true);
  };

  const popoverContent = () => {
    const short = md5(encoded).substr(0, 10);

    const CopyButton = ({ disabled }) => (
      <Button
        type="primary"
        className="popover-primary-button"
        style={{
          position: 'absolute',
          bottom: '12px',
          right: '10px',
        }}
        disabled={disabled}
      >
        {!disabled ? 'Copy to clipboard' : 'Copied to clipboard'}
      </Button>
    );

    const copiable = {
      tooltips: false,
      icon: [<CopyButton disabled={false} />, <CopyButton disabled={true} />],
    };

    return (
      <>
        <Paragraph
          className="copyable-text"
          copyable={{
            icon: [<Suspense fallback={null}>
              <CopyOutlined />
            </Suspense>, <Suspense fallback={null}>
                <CopyOutlined />
              </Suspense>],
            tooltips: ['Click to Copy', 'Copied'],
          }}
        >
          {EXTENSION_SHORT_SHARE_URL + short}
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
        </div>
      </>
    );
  };

  return (
    <div className="share-button-container">
      <Popover
        style={{width: 400}}
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
        visible={!disabled && visible}
        destroyTooltipOnHide={{ keepParent: false }}
        getPopupContainer={() => tooltipContainer.current}
        placement={icon ? 'bottomRight' : 'topLeft'}
      >
        {icon ? (
          <Button
            type="link"
            onClick={handleClick}
            icon={
              <Suspense fallback={null}>
                <ShareAltOutlined />
              </Suspense>
            }
          />
        ) : (
          <Button
            type="link"
            size="large"
            onClick={handleClick}
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

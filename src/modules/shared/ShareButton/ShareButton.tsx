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
  BAZAAR_URL,
  EXTENSION_SHARE_URL,
  EXTENSION_SHORT_URL_RECEIVED,
  MY_BLOCKLIST_ID,
  SIDEBAR_Z_INDEX,
} from 'utils';
import 'antd/lib/typography/style/index.css';
import 'antd/lib/button/style/index.css';
import 'antd/lib/popover/style/index.css';
import './ShareButton.scss';

/** MAGICS **/
const ELLIPSIS_ROWS = 3;
const POPOVER_WIDTH = 400; //px
const SHARE_BUTTON_COLOR = '#999999';
const CLICK_TO_COPY_TEXT = 'Click to Copy';
const COPIED_TEXT = 'Copied';
const SUBMIT_TO_BAZAAR_BUTTON_TEXT = 'Submit to Bazaar';
const BROWSE_BAZAAR_BUTTON_TEXT = 'Browse Bazaar';
const SHARE_AUGMENTATION_BUTTON_TITLE = 'Share Lens';
const POPOVER_TITLE = 'Share <placeholder>';
const POPOVER_CLOSE_BUTTON_TEXT = 'Close';

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
  const [visible, setVisible] = useState<boolean | undefined>(undefined);
  const tooltipContainer = useRef<HTMLDivElement>(null);

  const handleShare = async () => {
    setVisible(undefined);
    if (shared) return;
    await AugmentationManager.shareAugmentation(encoded);
    setShared(true);
  };

  const handleClose = () => setVisible(false);

  const handleVisibleChange = (visible: boolean) => visible && !shared && handleShare();

  useEffect(() => {
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.type === EXTENSION_SHORT_URL_RECEIVED) {
        setUrl(msg.shortUrl);
      }
    });
  }, []);

  const popoverContent = () => {
    const copyable = {
      icon: [
        <Suspense key={1} fallback={null}>
          <CopyOutlined />
        </Suspense>,
        <Suspense key={2} fallback={null}>
          <CopyOutlined />
        </Suspense>,
      ],
      tooltips: [CLICK_TO_COPY_TEXT, COPIED_TEXT],
    };

    const ellipsis = { rows: ELLIPSIS_ROWS };

    const handleSubmitToBazaar = () =>
      window.open(
        AIRTABLE_PUBLIC_LENSES_CREATE.replace('<base64>', encoded)
          .replace('<name>', augmentation.name)
          .replace('<description>', augmentation.description),
      );

    return (
      <>
        <Paragraph className="copyable-text" copyable={copyable} ellipsis={ellipsis}>
          {url}
        </Paragraph>
        <div className="popover-button-container">
          <Button type="default" className="popover-primary-button" onClick={handleSubmitToBazaar}>
            {SUBMIT_TO_BAZAAR_BUTTON_TEXT}
          </Button>
          <Button type="link" target="_blank" href={BAZAAR_URL}>
            {BROWSE_BAZAAR_BUTTON_TEXT}
          </Button>
        </div>
      </>
    );
  };

  const popoverTitle = (
    <div className="popover-title">
      {POPOVER_TITLE.replace('<placeholder>', augmentation.name)}
      <Button className="popover-close-button" type="link" onClick={handleClose}>
        {POPOVER_CLOSE_BUTTON_TEXT}
      </Button>
    </div>
  );

  const popoverWidth = { width: POPOVER_WIDTH };
  const keepParent = { keepParent: false };
  const getPopupContainer = () => tooltipContainer.current as HTMLDivElement;
  const containerStyle: React.CSSProperties = { zIndex: SIDEBAR_Z_INDEX + 1 };

  return (
    <div className="share-button-container  button-container">
      <Popover
        style={popoverWidth}
        content={popoverContent}
        title={popoverTitle}
        trigger="hover"
        onVisibleChange={handleVisibleChange}
        visible={!disabled && visible}
        destroyTooltipOnHide={keepParent}
        getPopupContainer={getPopupContainer}
        placement={icon ? 'bottomRight' : 'topLeft'}
      >
        {icon ? (
          <Button
            type="link"
            onClick={handleShare}
            icon={<Share size={15} stroke={SHARE_BUTTON_COLOR} />}
          />
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
              <span>{SHARE_AUGMENTATION_BUTTON_TITLE}</span>
            </div>
          </Button>
        )}
      </Popover>
      <div className="tooltip-container" ref={tooltipContainer} style={containerStyle} />
    </div>
  );
};

import React, { useContext } from 'react';
import { Helmet } from 'react-helmet';
import Input from 'antd/lib/input';
import Button from 'antd/lib/button';
import Typography from 'antd/lib/typography';
import { StepContext } from 'modules/introduction';
import { APP_NAME, SYNC_LICENSE_KEY } from 'utils';
import 'antd/lib/input/style/index.css';
import 'antd/lib/button/style/index.css';
import 'antd/lib/typography/style/index.css';
import './LicenseFrame.scss';

/** MAGICS **/
const TAB_TITLE = `${APP_NAME} - Enter License Key`;
const PAGE_MAIN_HEADER = 'Enter Your License Key';
const LICENSE_INPUT_PLACEHOLDER = 'If you have a special access key, paste it here';
const USE_LICENSE_BUTTON_TEXT = 'Next';
const USE_UNLICENSED_BUTTON_TEXT = 'Try Unlicensed';
const LICENSE_KEY_LENGTH = 39;
const BUTTON_CONTAINER_STYLE: React.CSSProperties = { width: '400px' };
const USE_UNLICENSED_BUTTON_STYLE: React.CSSProperties = { color: 'white' };

const { Title } = Typography;

export const LicenseFrame = () => {
  const stepContext = useContext(StepContext);

  const handleNext = () => stepContext.setCurrentStep(3);

  const handleLicenseSubmit = async () => {
    stepContext.setLicense((prev) => ({ ...prev, isActivated: true }));
    await new Promise((resolve) =>
      chrome.storage.sync.set({ [SYNC_LICENSE_KEY]: stepContext.license.key }, () => resolve(null)),
    );
    handleNext();
  };

  const handleFreeTier = () => {
    stepContext.setLicense({ isActivated: false, key: undefined });
    handleNext();
  };

  const validateLicense = () => {
    return stepContext.license.key?.length === 39 && stepContext.license.key?.match(/^[\w-]*$/gi);
  };

  const handleLicenseChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    stepContext.setLicense({ key: e.target.value });

  return (
    <div id="license-frame-container">
      <Helmet>
        <title>{TAB_TITLE}</title>
      </Helmet>
      <Title level={2}>{PAGE_MAIN_HEADER}</Title>
      <Input
        type="text"
        minLength={LICENSE_KEY_LENGTH}
        maxLength={LICENSE_KEY_LENGTH}
        value={stepContext.license.key}
        placeholder={LICENSE_INPUT_PLACEHOLDER}
        onChange={handleLicenseChange}
      />
      <div className="horizontal-container" style={BUTTON_CONTAINER_STYLE}>
        <Button
          type="ghost"
          shape="round"
          size="large"
          className="step-button"
          onClick={handleLicenseSubmit}
          disabled={!validateLicense()}
        >
          {USE_LICENSE_BUTTON_TEXT}
        </Button>
        <Button
          type="link"
          size="large"
          style={USE_UNLICENSED_BUTTON_STYLE}
          className="step-button"
          onClick={handleFreeTier}
        >
          {USE_UNLICENSED_BUTTON_TEXT}
        </Button>
      </div>
    </div>
  );
};

import React, { useCallback, useContext, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Input, Button, Typography } from 'antd';
import { StepContext } from 'modules/introduction';
import { APP_NAME, SYNC_LICENSE_KEY } from 'utils';
import './LicenseFrame.scss';

const { Title } = Typography;

export const LicenseFrame = () => {
  const stepContext = useContext(StepContext);

  const handleNext = () => stepContext.setCurrentStep(2);

  const handleLicenseSubmit = async () => {
    stepContext.setLicense((prev) => ({ ...prev, isActivated: true }));
    await new Promise((resolve) =>
      chrome.storage.sync.set({ [SYNC_LICENSE_KEY]: stepContext.license.key }, () => resolve(null)),
    );
    handleNext();
  };

  const handleFreeTier = () => {
    stepContext.setLicense({ isActivated: false, key: null });
    handleNext();
  };

  const validateLicense = () => {
    return stepContext.license.key?.length === 39 && stepContext.license.key?.match(/^[\w-]*$/gi);
  };

  useEffect(() => {
    document.title = `Welcome to ${APP_NAME}`;
  }, []);

  return (
    <div id="license-frame-container">
      <Helmet>
        <title>{APP_NAME} - Enter License Key</title>
      </Helmet>
      <Title level={2}>Enter Your License Key</Title>
      <Input
        type="text"
        minLength={39}
        maxLength={39}
        value={stepContext.license.key}
        placeholder="If you have a special access key, paste it here"
        onChange={(e) => stepContext.setLicense({ key: e.target.value })}
      />
      <div className="horizontal-container" style={{ width: '400px' }}>
        <Button
          type="ghost"
          shape="round"
          size="large"
          className="step-button"
          onClick={handleLicenseSubmit}
          disabled={!validateLicense()}
        >
          Next
        </Button>
        <Button
          type="link"
          size="large"
          style={{ color: 'white' }}
          className="step-button"
          onClick={handleFreeTier}
        >
          Use Unlicensed
        </Button>
      </div>
    </div>
  );
};

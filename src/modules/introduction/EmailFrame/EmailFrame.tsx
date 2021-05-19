import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Input, Button, Typography } from 'antd';
import { StepContext } from 'modules/introduction';
import { APP_NAME, MAILCHIMP_API_KEY, MAILCHIMP_URL, SYNC_EMAIL_KEY, validateEmail } from 'utils';
import './EmailFrame.scss';
import md5 from 'md5';

/** MAGICS **/
const TAB_TITLE = `${APP_NAME} - Email Address`;
const PAGE_MAIN_HEADER = 'Unlock Special Lenses';
const EMAIL_INPUT_PLACEHOLDER = 'your@emailaddress.com';
const PRIVACY_NOTICE = 'Your email address is never linked to your search history';
const USE_LICENSE_BUTTON_TEXT = 'Next';
const USE_UNLICENSED_BUTTON_TEXT = 'Skip';
const BUTTON_CONTAINER_STYLE: React.CSSProperties = { width: '400px' };
const USE_UNLICENSED_BUTTON_STYLE: React.CSSProperties = { color: 'white' };

const { Title } = Typography;

export const EmailFrame = () => {
  const [emailIsValid, setEmailIsValid] = useState<boolean>(false);
  const stepContext = useContext(StepContext);

  const handleNext = () => stepContext.setCurrentStep(2);

  const handleEmailSubmit = async () => {
    await new Promise((resolve) =>
      chrome.storage.sync.set({ [SYNC_EMAIL_KEY]: stepContext.email }, () => resolve(null)),
    );
    handleNext();
    await fetch(MAILCHIMP_URL.replace('<placeholder>', md5(stepContext.email.toLowerCase())), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${MAILCHIMP_API_KEY}`,
      },
      body: JSON.stringify({
        email_address: stepContext.email,
        status_if_new: 'subscribed',
        status: 'subscribed',
      }),
    });
  };

  const handleFreeTier = () => {
    stepContext.setEmail('');
    handleNext();
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    stepContext.setEmail(e.target.value);
  };

  useEffect(() => {
    setEmailIsValid(validateEmail(stepContext.email));
  }, [stepContext.email]);

  return (
    <div id="email-frame-container">
      <Helmet>
        <title>{TAB_TITLE}</title>
      </Helmet>
      <Title level={2}>{PAGE_MAIN_HEADER}</Title>
      <Input
        type="email"
        value={stepContext.email}
        placeholder={EMAIL_INPUT_PLACEHOLDER}
        onChange={handleEmailChange}
      />
      <Title type="secondary" level={4}>
        {PRIVACY_NOTICE}
      </Title>
      <div className="horizontal-container" style={BUTTON_CONTAINER_STYLE}>
        <Button
          type="ghost"
          shape="round"
          size="large"
          className="step-button"
          onClick={handleEmailSubmit}
          disabled={!emailIsValid}
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

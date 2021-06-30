import React, { useCallback, useContext, useEffect, useState } from 'react';
import md5 from 'md5';
import { Helmet } from 'react-helmet';
import { Input, Button, Typography } from 'antd';
import UserManager from 'lib/user';
import { validateEmail } from 'lib/helpers';
import { useFeature } from 'lib/features';
import { StepContext } from 'modules/onboarding';
import {
  APP_NAME,
  EXTENSION_HOST,
  MAILCHIMP_API_KEY,
  MAILCHIMP_URL,
  LEGACY_LOCAL_LICENSE,
} from 'constant';
import './EmailFrame.scss';

/** MAGICS **/
const TAB_TITLE = `${APP_NAME} - Email Address`;
const PAGE_MAIN_HEADER = 'Sign in or sign up';
const EMAIL_INPUT_PLACEHOLDER = 'your@emailaddress.com';
const PRIVACY_NOTICE =
  'Your email address is never linked to your search history. \nAn account lets you share notes, trusted and blocked sources with collaborators.';
const USE_LICENSE_BUTTON_TEXT = 'Next';
const USE_UNLICENSED_BUTTON_TEXT = 'Skip';
const BUTTON_CONTAINER_STYLE: React.CSSProperties = { width: '400px' };
const USE_UNLICENSED_BUTTON_STYLE: React.CSSProperties = { color: 'white' };

const { Title } = Typography;

export const EmailFrame = () => {
  const [emailValue, setEmailValue] = useState<string>(UserManager.user.email ?? '');
  const [emailIsValid, setEmailIsValid] = useState<boolean>(false);
  const stepContext = useContext(StepContext);
  const [loginFeature] = useFeature('desktop_login');

  const handleNext = useCallback(() => stepContext.setCurrentStep(2), [stepContext]);

  const handleEmailSubmit = async () => {
    if (loginFeature) {
      window.open(
        `https://${EXTENSION_HOST}/verify?auth_email=${encodeURIComponent(emailValue)}`,
        '_blank',
      );
    } else {
      await new Promise((resolve) =>
        chrome.storage.sync.set(
          { [LEGACY_LOCAL_LICENSE]: 'ABHINAV-FRIENDS-FAMILY-SPECIAL-ACCESS-K' },
          () => resolve(true),
        ),
      );
    }
    UserManager.setUserEmail(emailValue);
    handleNext();
    fetch(MAILCHIMP_URL.replace('<placeholder>', md5(emailValue.toLowerCase())), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${MAILCHIMP_API_KEY}`,
      },
      body: JSON.stringify({
        email_address: emailValue,
        status_if_new: 'subscribed',
        status: 'subscribed',
      }),
    });
  };

  const handleFreeTier = async () => {
    await UserManager.logout();
    handleNext();
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailValue(e.target.value);
  };

  useEffect(() => {
    setEmailIsValid(validateEmail(emailValue));
  }, [emailValue]);

  return (
    <div id="email-frame-container">
      <Helmet>
        <title>{TAB_TITLE}</title>
      </Helmet>
      <Title level={2}>{PAGE_MAIN_HEADER}</Title>
      <Input
        type="email"
        value={emailValue}
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
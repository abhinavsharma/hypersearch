/**
 * @module modules:settings
 * @version 1.0.0
 * @license (C) Insight
 */

import React, { useContext, useEffect, useState } from 'react';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';
import Typography from 'antd/lib/typography';
import { SettingsContext } from 'modules/pages';
import UserManager from 'lib/user';
import { APP_NAME } from 'constant';
import 'antd/lib/input/style/index.css';
import 'antd/lib/button/style/index.css';
import './LoginForm.scss';

const { Text } = Typography;

//-----------------------------------------------------------------------------------------------
// ! Magics
//-----------------------------------------------------------------------------------------------
const EMAIL_INPUT_PLACEHOLDER = 'Email';
const ACTIVATE_INPUT_PLACEHOLDER = 'Enter the code from your email here';
const ACTIVATE_BUTTON_TEXT = 'Activate';
const LOGIN_BUTTON_TEXT = 'Login';
const LOGOUT_BUTTON_TEXT = 'Logout';
const ACTIVATE_EMAIL_TEXT = 'Code sent to <placeholder>';
const REACTIVATION_BUTTON_TEXT = 'Click here to get a new activation code';
const SENT_REACTIVATION_BUTTON_TEXT = 'New activation code sent';
const LOGIN_SECTION_TITLE = 'Login to your account';
const ACTIVATION_SECTION_TITLE = 'Verify Email';
const LOGOUT_SECTION_TITLE = `You are successfully logged in to ${APP_NAME}`;

//-----------------------------------------------------------------------------------------------
// ! Component
//-----------------------------------------------------------------------------------------------
export const LoginForm = () => {
  const {
    email,
    storedEmail,
    storedToken,
    setStoredEmail,
    setStoredToken,
    useServerSuggestions,
    handlePrivacyChange,
  } = useContext(SettingsContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isReadyToActivate, setIsReadyToActivate] = useState<boolean>(false);
  const [emailValue, setEmailValue] = useState<string>('');
  const [activationCode, setActivationCode] = useState<string>('');
  const [sentReactivation, setSentReactivation] = useState<boolean>(false);

  //-----------------------------------------------------------------------------------------------
  // ! Handlers
  //-----------------------------------------------------------------------------------------------
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailValue(e.target.value);
  };

  const handleActivationCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setActivationCode(e.target.value);
  };

  const handleLogin = async () => {
    await UserManager.login(emailValue);
    setIsReadyToActivate(true);
  };

  const handleLogout = async () => {
    // delete stored auth data
    await UserManager.logout();
    setStoredEmail('');
    setStoredToken(undefined);
    setEmailValue('');
    setActivationCode('');
    handlePrivacyChange(undefined);
  };

  const handleActivation = async () => {
    setIsLoading(true);
    // set auth token in window.storage
    const token = await UserManager.activate(activationCode);
    setIsLoading(false);
    setStoredToken(token);
    setStoredEmail(emailValue);
    if (useServerSuggestions === undefined) {
      // enable server suggestions by default. see spec
      handlePrivacyChange(true);
    }
  };

  const handleReactivate = async (_e: any = undefined, email?: string) => {
    // send activation code to given email
    await UserManager.login(email ?? (UserManager.user.email as string));
    !email && setSentReactivation(true);
    setActivationCode('');
    setIsReadyToActivate(true);
  };

  useEffect(() => {
    if (email) {
      handleReactivate(undefined, email);
    }
  }, [email]);

  //-----------------------------------------------------------------------------------------------
  // ! Render
  //-----------------------------------------------------------------------------------------------
  const loginInput = (
    <div className="insight-row insight-full-width">
      <Input
        type="text"
        value={emailValue}
        placeholder={EMAIL_INPUT_PLACEHOLDER}
        onChange={handleEmailChange}
      />
      <Button type="primary" onClick={handleLogin}>
        {LOGIN_BUTTON_TEXT}
      </Button>
    </div>
  );

  const activateInput = (
    <div className="activation-input-form insight-full-width">
      <div className="insight-row insight-full-width">
        <Input
          type="text"
          value={activationCode}
          placeholder={ACTIVATE_INPUT_PLACEHOLDER}
          onChange={handleActivationCodeChange}
        />
        <Button type="primary" onClick={handleActivation} disabled={isLoading}>
          {ACTIVATE_BUTTON_TEXT}
        </Button>
      </div>
      <span className="email-feedback-text">
        {ACTIVATE_EMAIL_TEXT.replace('<placeholder>', UserManager.user.email ?? '')}
      </span>
      <Button type="link" onClick={handleReactivate} disabled={sentReactivation}>
        {sentReactivation ? SENT_REACTIVATION_BUTTON_TEXT : REACTIVATION_BUTTON_TEXT}
      </Button>
    </div>
  );

  const logoutInput = (
    <div className="settings-logout-row">
      <Text strong>{UserManager.user.email}</Text>
      <Button type="primary" onClick={handleLogout}>
        {LOGOUT_BUTTON_TEXT}
      </Button>
    </div>
  );

  return (
    <section>
      <h2 className="title">
        {
          // prettier-ignore
          storedEmail && storedToken
          ? LOGOUT_SECTION_TITLE
          : storedEmail && isReadyToActivate
            ? ACTIVATION_SECTION_TITLE
            : LOGIN_SECTION_TITLE
        }
      </h2>
      <div className="settings-section-content insight-row">
        {
          // prettier-ignore
          storedToken
          ? logoutInput
          : !emailValue
            ? loginInput
            : isReadyToActivate
              ? activateInput
              : loginInput
        }
      </div>
    </section>
  );
};

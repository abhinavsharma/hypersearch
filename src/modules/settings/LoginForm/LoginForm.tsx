import React, { useContext, useState } from 'react';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';
import Typography from 'antd/lib/typography';
import UserManager from 'lib/UserManager';
import { SettingsContext } from 'modules/pages';
import 'antd/lib/input/style/index.css';
import 'antd/lib/button/style/index.css';

const { Text } = Typography;

const EMAIL_INPUT_PLACEHOLDER = 'Email';
const ACTIVATE_INPUT_PLACEHOLDER = 'Place here the activation code...';
const ACTIVATE_BUTTON_TEXT = 'Activate';
const LOGIN_BUTTON_TEXT = 'Login';
const LOGOUT_BUTTON_TEXT = 'Logout';
const REACTIVATION_BUTTON_TEXT = 'Click here to get a new activation code';
const SENT_REACTIVATION_BUTTON_TEXT = 'New activation code sent to <placeholder>';

export const LoginForm = () => {
  const [emailValue, setEmailValue] = useState<string>('');
  const [activationCode, setActivationCode] = useState<string>('');
  const [sentReactivation, setSentReactivation] = useState<boolean>(false);
  const { storedEmail, storedToken, setStoredEmail, setStoredToken } = useContext(SettingsContext);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailValue(e.target.value);
  };

  const handleActivationCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setActivationCode(e.target.value);
  };

  const handleLogin = async () => {
    await UserManager.login(emailValue);
    setStoredEmail(emailValue);
  };

  const handleLogout = async () => {
    await UserManager.logout();
    setStoredEmail('');
    setStoredToken(undefined);
    setEmailValue('');
    setActivationCode('');
  };

  const handleActivation = async () => {
    const token = await UserManager.activate(activationCode);
    setStoredToken(token);
  };

  const handleReactivate = async () => {
    await UserManager.login(UserManager.user.email as string);
    setSentReactivation(true);
    setActivationCode('');
  };

  if (storedToken) {
    return (
      <div className="settings-logout-row">
        <Text strong>{UserManager.user.email}</Text>
        <Button type="primary" onClick={handleLogout}>
          {LOGOUT_BUTTON_TEXT}
        </Button>
      </div>
    );
  } else {
    return !storedEmail ? (
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
    ) : (
      <div className="insight-list insight-full-width">
        <div className="insight-row insight-full-width">
          <Input
            type="text"
            value={activationCode}
            placeholder={ACTIVATE_INPUT_PLACEHOLDER}
            onChange={handleActivationCodeChange}
          />
          <Button type="primary" onClick={handleActivation}>
            {ACTIVATE_BUTTON_TEXT}
          </Button>
        </div>
        <Button type="link" onClick={handleReactivate} disabled={sentReactivation}>
          {sentReactivation
            ? SENT_REACTIVATION_BUTTON_TEXT.replace(
                '<placeholder>',
                UserManager.user.email as string,
              )
            : REACTIVATION_BUTTON_TEXT}
        </Button>
      </div>
    );
  }
};

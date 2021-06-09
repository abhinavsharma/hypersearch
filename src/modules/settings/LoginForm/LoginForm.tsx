import React, { useCallback, useContext, useState } from 'react';
import {
  CognitoUserPool,
  CognitoUser,
  CognitoUserAttribute,
  AuthenticationDetails,
} from 'amazon-cognito-identity-js';
import md5 from 'md5';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';
import Typography from 'antd/lib/typography';
import {
  AWS_COGNITO_CLIENT_ID,
  AWS_COGNITO_POOL_ID,
  debug,
  SYNC_EMAIL_KEY,
  SYNC_LICENSE_KEY,
  SYNC_PRIVACY_KEY,
} from 'utils';
import { SettingsContext } from 'modules/pages';
import 'antd/lib/input/style/index.css';
import 'antd/lib/button/style/index.css';

const { Text } = Typography;

const EMAIL_INPUT_PLACEHOLDER = 'Email';
const ACTIVATE_INPUT_PLACEHOLDER = 'Place here the activation code...';
const ACTIVATE_BUTTON_TEXT = 'Activate';
const LOGIN_BUTTON_TEXT = 'Login';
const LOGOUT_BUTTON_TEXT = 'Logout';

export const LoginForm = () => {
  const [currentUser, setCurrentUser] = useState<CognitoUser>();

  const {
    setEmailValue,
    setActivationCode,
    setIsLoggedIn,
    setHasEmail,
    isLoggedIn,
    hasEmail,
    emailValue,
    activationCode,
  } = useContext(SettingsContext);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailValue(e.target.value);
  };

  const handleActivationCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setActivationCode(e.target.value);
  };

  const getCurrentCognitoPool = useCallback(() => {
    return new CognitoUserPool({
      UserPoolId: AWS_COGNITO_POOL_ID,
      ClientId: AWS_COGNITO_CLIENT_ID,
    });
  }, []);

  const getCurrentCognitoUser = useCallback(() => {
    return new CognitoUser({
      Pool: getCurrentCognitoPool(),
      Username: emailValue,
    });
  }, [emailValue, getCurrentCognitoPool]);

  const handleSignup = useCallback(() => {
    getCurrentCognitoPool().signUp(
      emailValue,
      md5(emailValue),
      [
        new CognitoUserAttribute({
          Name: 'email',
          Value: emailValue,
        }),
      ],
      [],
      (error, result) => {
        result && debug('AWS Cognito Sign Up Success', result);
        error && debug('AWS Cognito Sign Up Error', error);
      },
    );
  }, [emailValue, getCurrentCognitoPool]);

  const handleActivation = useCallback(async () => {
    await new Promise((resolve) =>
      chrome.storage.sync.set(
        { [SYNC_LICENSE_KEY]: 'ABHINAV-FRIENDS-FAMILY-SPECIAL-ACCESS-K' },
        () => resolve(null),
      ),
    );

    currentUser?.sendCustomChallengeAnswer(activationCode, {
      onSuccess: (result) => {
        debug('AWS Cognito Custom Challenge Success', result);
        setIsLoggedIn(true);
      },
      onFailure: (error) => debug('AWS Cognito Custom Challenge Error', error),
    });
  }, [currentUser, activationCode, setIsLoggedIn]);

  const handleLogin = useCallback(async () => {
    await new Promise((resolve) =>
      chrome.storage.sync.set({ [SYNC_EMAIL_KEY]: emailValue }, () => resolve(true)),
    );
    setHasEmail(true);

    const user = getCurrentCognitoUser();
    user.setAuthenticationFlowType('CUSTOM_AUTH');

    if (!user.getUsername()) {
      handleSignup();
    }

    user.initiateAuth(
      new AuthenticationDetails({
        Username: emailValue,
      }),
      {
        onSuccess: (result) => debug('AWS Cognito Initiate Auth Success', result.isValid()),
        onFailure: (error) => debug('AWS Cognito Initiate Auth Error', error),
        customChallenge: function () {
          //
        },
      },
    );

    setCurrentUser(user);
  }, [emailValue, setHasEmail, getCurrentCognitoUser, handleSignup]);

  const handleLogout = useCallback(async () => {
    await new Promise((resolve) =>
      chrome.storage.sync.remove(SYNC_PRIVACY_KEY, () => resolve(true)),
    );
    await new Promise((resolve) => chrome.storage.sync.remove(SYNC_EMAIL_KEY, () => resolve(true)));
    setIsLoggedIn(false);
    setHasEmail(false);
  }, [setIsLoggedIn, setHasEmail]);

  return !isLoggedIn ? (
    !hasEmail ? (
      <>
        <Input
          type="text"
          value={emailValue}
          placeholder={EMAIL_INPUT_PLACEHOLDER}
          onChange={handleEmailChange}
        />
        <Button type="primary" onClick={handleLogin}>
          {LOGIN_BUTTON_TEXT}
        </Button>
      </>
    ) : (
      <>
        <Input
          type="text"
          value={activationCode}
          placeholder={ACTIVATE_INPUT_PLACEHOLDER}
          onChange={handleActivationCodeChange}
        />
        <Button type="primary" onClick={handleActivation}>
          {ACTIVATE_BUTTON_TEXT}
        </Button>
      </>
    )
  ) : (
    <div className="settings-logout-row">
      <Text strong>{emailValue}</Text>
      <Button type="primary" onClick={handleLogout}>
        {LOGOUT_BUTTON_TEXT}
      </Button>
    </div>
  );
};

import React, { useCallback, useEffect, useState } from 'react';
import { RefreshCw } from 'react-feather';
import Button from 'antd/lib/button';
import Typography from 'antd/lib/typography';
import Divider from 'antd/lib/divider';
import Switch from 'antd/lib/switch';
import {
  APP_NAME,
  OPEN_AUGMENTATION_BUILDER_MESSAGE,
  OPEN_BUILDER_PAGE,
  SYNC_EMAIL_KEY,
  SYNC_LICENSE_KEY,
  SYNC_PRIVACY_KEY,
} from 'utils';
import 'antd/lib/switch/style/index.css';
import 'antd/lib/typography/style/index.css';
import 'antd/lib/button/style/index.css';
import './SettingsPage.scss';
import { LoginForm } from 'modules/settings';
import {
  ACTIVE_LICENSE_MAIN_HEADER,
  CHECKED_PRIVACY_EXPLAINER_CONTENT,
  CHECKED_SWITCH_TEXT,
  INACTIVE_LICENSE_MAIN_HEADER,
  INACTIVE_LICENSE_TEXT_CONTENT,
  UNCHECKED_PRIVACY_EXPLAINER_CONTENT,
  UNCHECKED_SWITCH_TEXT,
} from 'modules/introduction';

const { Title } = Typography;

/** MAGICS **/
const HEADER_TITLE = 'Settings';
const HEADER_LEFT_BUTTON_TEXT = 'Close';
const LOGIN_SECTION_TITLE = 'Login to your account';
const ACTIVATION_SECTION_TITLE = 'Activate your account';
const LOGOUT_SECTION_TITLE = `You are successfully logged in to ${APP_NAME}`;
const BOOKMARKS_SYNC_BUTTON_TEXT = 'Sync Bookmarks';

export const SettingsContext = React.createContext<TSettingsContext>(Object.create(null));

export const SettingsPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [hasEmail, setHasEmail] = useState<boolean>(false);
  const [emailValue, setEmailValue] = useState<string>('');
  const [useServerSuggestions, setUseServerSuggestions] = useState<boolean | undefined>(false);
  const [activationCode, setActivationCode] = useState<string>('');

  const handleClose = () => {
    chrome.runtime.sendMessage({
      type: OPEN_AUGMENTATION_BUILDER_MESSAGE,
      page: OPEN_BUILDER_PAGE.ACTIVE,
      create: true,
    });
  };

  const handlePrivacyChange = useCallback(async (value: boolean) => {
    setUseServerSuggestions(value);
    await new Promise((resolve) =>
      chrome.storage.sync.set({ [SYNC_PRIVACY_KEY]: value }, () => resolve(true)),
    );
  }, []);

  const getPrivacy = useCallback(async () => {
    const isServerSuggestionsEnabled = await new Promise<Record<string, boolean>>((resolve) =>
      chrome.storage.sync.get(SYNC_PRIVACY_KEY, resolve),
    ).then((result) => result?.[SYNC_PRIVACY_KEY]);
    setUseServerSuggestions(isServerSuggestionsEnabled);
  }, []);

  const getActivationDetails = useCallback(async () => {
    const storedEmail = await new Promise<Record<string, string>>((resolve) =>
      chrome.storage.sync.get(SYNC_EMAIL_KEY, resolve),
    ).then((result) => result?.[SYNC_EMAIL_KEY] as string);

    if (storedEmail) {
      setHasEmail(true);
      setEmailValue(storedEmail);
    }

    const storedLicense = await new Promise<Record<string, string>>((resolve) =>
      chrome.storage.sync.get(SYNC_LICENSE_KEY, resolve),
    ).then((result) => result?.[SYNC_LICENSE_KEY] as string);
    setIsLoggedIn(!!(storedLicense && storedEmail));
  }, []);

  useEffect(() => {
    getActivationDetails();
  }, [getActivationDetails]);

  useEffect(() => {
    getPrivacy();
  }, [getPrivacy]);

  const CONTEXT_VALUE = {
    setEmailValue,
    setActivationCode,
    setIsLoggedIn,
    setHasEmail,
    isLoggedIn,
    hasEmail,
    emailValue,
    activationCode,
  };

  return (
    <SettingsContext.Provider value={CONTEXT_VALUE}>
      <div id="settings-page" className="sidebar-page">
        <header className="sidebar-page-header">
          <Button type="link" className="left-button" onClick={handleClose}>
            {HEADER_LEFT_BUTTON_TEXT}
          </Button>
          <span className="page-title">{HEADER_TITLE}</span>
        </header>
        <div className="sidebar-page-wrapper">
          {/* login */}
          <section>
            <h2 className="title">
              {
                // prettier-ignore
                isLoggedIn
              ? LOGOUT_SECTION_TITLE
              : hasEmail
                ? ACTIVATION_SECTION_TITLE
                : LOGIN_SECTION_TITLE
              }
            </h2>
            <div className="settings-section-content insight-row">
              <LoginForm />
            </div>
            <Divider />
          </section>
          {/* change privacy */}
          <section>
            {isLoggedIn && <h2 className="title">{ACTIVE_LICENSE_MAIN_HEADER}</h2>}
            <div className="settings-section-content">
              {isLoggedIn && (
                <>
                  <Switch
                    className="privacy-toggle-button"
                    checked={useServerSuggestions}
                    onChange={handlePrivacyChange}
                  />
                </>
              )}
              {
                //prettier-ignore
                !isLoggedIn && useServerSuggestions === undefined ? (
                  <>
                    <Title level={2}>{INACTIVE_LICENSE_MAIN_HEADER}</Title>
                    <div className="privacy-explainer">{INACTIVE_LICENSE_TEXT_CONTENT}</div>
                  </>
                ) :
                  !useServerSuggestions ? (
                    <>
                      <Title level={2}>{UNCHECKED_SWITCH_TEXT}</Title>
                      <div className="privacy-explainer">{UNCHECKED_PRIVACY_EXPLAINER_CONTENT}</div>
                    </>
                  ) : (
                    <>
                      <Title level={2}>{CHECKED_SWITCH_TEXT}</Title>
                      <div className="privacy-explainer">{CHECKED_PRIVACY_EXPLAINER_CONTENT}</div>
                    </>
                  )
              }
            </div>
          </section>
          {/* force sync bookmarks */}
          <section>
            <div className="settings-section-content">
              <Button type="primary" block onClick={handleClose}>
                <span className="insight-row">
                  <RefreshCw />
                  &nbsp;{BOOKMARKS_SYNC_BUTTON_TEXT}
                </span>
              </Button>
            </div>
            <Divider />
          </section>
        </div>
      </div>
    </SettingsContext.Provider>
  );
};

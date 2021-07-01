/**
 * @module modules:pages
 * @version 1.0.0
 * @license (C) Insight
 */

import React, { useCallback, useEffect, useState } from 'react';
import Button from 'antd/lib/button';
import Typography from 'antd/lib/typography';
import Divider from 'antd/lib/divider';
import Switch from 'antd/lib/switch';
import UserManager from 'lib/user';
import { useFeature } from 'lib/features';
import {
  ACTIVE_LICENSE_MAIN_HEADER,
  CHECKED_PRIVACY_EXPLAINER_CONTENT,
  CHECKED_SWITCH_TEXT,
  INACTIVE_LICENSE_MAIN_HEADER,
  INACTIVE_LICENSE_TEXT_CONTENT,
  UNCHECKED_PRIVACY_EXPLAINER_CONTENT,
  UNCHECKED_SWITCH_TEXT,
} from 'modules/onboarding';
import { BookmarksSyncButton, LicenseForm, LoginForm } from 'modules/settings';
import { MESSAGE, PAGE, SYNC_PRIVACY_KEY } from 'constant';
import 'antd/lib/switch/style/index.css';
import 'antd/lib/typography/style/index.css';
import 'antd/lib/button/style/index.css';
import './SettingsPage.scss';

const { Title } = Typography;

export const SettingsContext = React.createContext<SettingsContext>(Object.create(null));

//-----------------------------------------------------------------------------------------------
// ! Magics
//-----------------------------------------------------------------------------------------------
const HEADER_TITLE = 'Settings';
const HEADER_LEFT_BUTTON_TEXT = 'Close';
const LICENSE_SECTION_HEADER = 'Manage Licenses';

//-----------------------------------------------------------------------------------------------
// ! Component
//-----------------------------------------------------------------------------------------------
export const SettingsPage: SettingsPage = ({ email }) => {
  const [storedEmail, setStoredEmail] = useState<string>(UserManager.user.email ?? '');
  const [storedToken, setStoredToken] = useState<TAccessToken | undefined>(UserManager.user.token);
  const [useServerSuggestions, setUseServerSuggestions] = useState<boolean | undefined>(false);

  const [loginFeature] = useFeature('desktop_login');

  //-----------------------------------------------------------------------------------------------
  // ! Handlers
  //-----------------------------------------------------------------------------------------------
  const handleClose = () => {
    chrome.runtime.sendMessage({
      type: MESSAGE.OPEN_PAGE,
      page: PAGE.ACTIVE,
      create: true,
    });
  };

  const handlePrivacyChange = useCallback(async (value: boolean | undefined) => {
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

  useEffect(() => {
    getPrivacy();
  }, [getPrivacy]);

  useEffect(() => {
    setStoredEmail(UserManager.user.email ?? '');
    // Singleton instance not reinitialized on rerender.
    // ! Be careful when updating the dependency list!
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [UserManager.user.email]);

  useEffect(() => {
    setStoredToken(UserManager.user.token);
    // Singleton instance not reinitialized on rerender.
    // ! Be careful when updating the dependency list!
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [UserManager.user.token]);

  const context = {
    email,
    storedEmail,
    storedToken,
    useServerSuggestions,
    setStoredEmail,
    setStoredToken,
    handlePrivacyChange,
  };

  //-----------------------------------------------------------------------------------------------
  // ! Render
  //-----------------------------------------------------------------------------------------------
  const LoginSection = () => (loginFeature ? <LoginForm /> : null);

  const PrivacySection = () => (
    <section>
      <Divider />
      {(storedToken || !loginFeature) && <h2 className="title">{ACTIVE_LICENSE_MAIN_HEADER}</h2>}
      <div className="settings-section-content">
        {(storedToken || !loginFeature) && (
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
          (!storedToken && loginFeature) ? (
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
  );

  const LicenseSection = () => (
    <section>
      <h2 className="title">{LICENSE_SECTION_HEADER}</h2>
      <div className="settings-section-content">
        <LicenseForm />
      </div>
    </section>
  );

  const BookmarksSection = () => (
    <section>
      <div className="settings-section-content">
        <BookmarksSyncButton token={storedToken} />
      </div>
      <Divider />
    </section>
  );

  const Header = () => (
    <header className="sidebar-page-header">
      <Button type="link" className="left-button" onClick={handleClose}>
        {HEADER_LEFT_BUTTON_TEXT}
      </Button>
      <span className="page-title">{HEADER_TITLE}</span>
    </header>
  );

  return (
    <SettingsContext.Provider value={context}>
      <div id="settings-page" className="sidebar-page">
        <Header />
        <div className="sidebar-page-wrapper">
          <LoginSection />
          {(storedToken || !loginFeature) && <LicenseSection />}
          {!storedEmail || (storedToken && <PrivacySection />)}
          {storedToken && <BookmarksSection />}
        </div>
      </div>
    </SettingsContext.Provider>
  );
};

import React, { useCallback, useEffect, useState } from 'react';
import { RefreshCw } from 'react-feather';
import Button from 'antd/lib/button';
import Typography from 'antd/lib/typography';
import Divider from 'antd/lib/divider';
import Switch from 'antd/lib/switch';
import UserManager from 'lib/UserManager';
import { LoginForm } from 'modules/settings';
import {
  APP_NAME,
  OPEN_AUGMENTATION_BUILDER_MESSAGE,
  OPEN_BUILDER_PAGE,
  SYNC_END_MESSAGE,
  SYNC_START_MESSAGE,
  SYNC_PRIVACY_KEY,
} from 'utils';
import {
  ACTIVE_LICENSE_MAIN_HEADER,
  CHECKED_PRIVACY_EXPLAINER_CONTENT,
  CHECKED_SWITCH_TEXT,
  INACTIVE_LICENSE_MAIN_HEADER,
  INACTIVE_LICENSE_TEXT_CONTENT,
  UNCHECKED_PRIVACY_EXPLAINER_CONTENT,
  UNCHECKED_SWITCH_TEXT,
} from 'modules/introduction';
import 'antd/lib/switch/style/index.css';
import 'antd/lib/typography/style/index.css';
import 'antd/lib/button/style/index.css';
import './SettingsPage.scss';

const { Title } = Typography;

/** MAGICS **/
const HEADER_TITLE = 'Settings';
const HEADER_LEFT_BUTTON_TEXT = 'Close';
const LOGIN_SECTION_TITLE = 'Login to your account';
const ACTIVATION_SECTION_TITLE = 'Activate your account';
const LOGOUT_SECTION_TITLE = `You are successfully logged in to ${APP_NAME}`;
const BOOKMARKS_SYNC_BUTTON_TEXT = 'Sync Bookmarks';
const BOOKMARKS_SYNCING_BUTTON_TEXT = 'Syncing Bookmarks';
const BOOKMARKS_SYNC_BUTTON_LOGIN_TEXT = 'Login to sync Bookmarks';

export const SettingsContext = React.createContext<SettingsContext>(Object.create(null));

export const SettingsPage: SettingsPage = ({ email }) => {
  const [storedEmail, setStoredEmail] = useState<string>(UserManager.user.email ?? '');
  const [storedToken, setStoredToken] = useState<TAccessToken | undefined>(UserManager.user.token);
  const [useServerSuggestions, setUseServerSuggestions] = useState<boolean | undefined>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  useEffect(() => {
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.type === SYNC_END_MESSAGE) {
        setIsSyncing(false);
      }
    });
  }, []);

  const handleClose = () => {
    chrome.runtime.sendMessage({
      type: OPEN_AUGMENTATION_BUILDER_MESSAGE,
      page: OPEN_BUILDER_PAGE.ACTIVE,
      create: true,
    });
  };

  const handleForceSync = async () => {
    setIsSyncing(true);
    chrome.runtime.sendMessage({
      type: SYNC_START_MESSAGE,
      token: (await UserManager.getUserToken())?.getJwtToken(),
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

  const bookmarksStatus = () => {
    if (isSyncing) {
      return BOOKMARKS_SYNCING_BUTTON_TEXT;
    }

    return !storedToken ? BOOKMARKS_SYNC_BUTTON_LOGIN_TEXT : BOOKMARKS_SYNC_BUTTON_TEXT;
  };

  const context = {
    email,
    storedEmail,
    storedToken,
    useServerSuggestions,
    setStoredEmail,
    setStoredToken,
    handlePrivacyChange,
  };

  return (
    <SettingsContext.Provider value={context}>
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
                storedEmail && storedToken
                ? LOGOUT_SECTION_TITLE
                : storedEmail
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
            {storedToken && <h2 className="title">{ACTIVE_LICENSE_MAIN_HEADER}</h2>}
            <div className="settings-section-content">
              {storedToken && (
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
                !storedToken && useServerSuggestions === undefined ? (
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
              <Button
                block
                type="primary"
                onClick={handleForceSync}
                disabled={!storedToken || isSyncing}
              >
                <span className="insight-row">
                  <RefreshCw className={isSyncing ? 'spin' : ''} />
                  &nbsp;{bookmarksStatus()}
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

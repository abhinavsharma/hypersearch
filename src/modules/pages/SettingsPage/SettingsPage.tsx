/**
 * @module modules:pages
 * @version 1.0.0
 * @license (C) Insight
 */

import React, { useCallback, useEffect, useState } from 'react';
import Button from 'antd/lib/button';
import Divider from 'antd/lib/divider';
import Switch from 'antd/lib/switch';
import UserManager from 'lib/user';
import { MESSAGE, PAGE, SYNC_PRIVACY_KEY } from 'constant';
import 'antd/lib/switch/style/index.css';
import 'antd/lib/typography/style/index.css';
import 'antd/lib/button/style/index.css';
import './SettingsPage.scss';

export const SettingsContext = React.createContext<SettingsContext>(Object.create(null));

//-----------------------------------------------------------------------------------------------
// ! Magics
//-----------------------------------------------------------------------------------------------
const HEADER_TITLE = 'Settings';
const HEADER_LEFT_BUTTON_TEXT = 'Close';

//-----------------------------------------------------------------------------------------------
// ! Component
//-----------------------------------------------------------------------------------------------
export const SettingsPage: SettingsPage = () => {
  const [useServerSuggestions, setUseServerSuggestions] = useState<boolean | undefined>(false);

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
    UserManager.updateUserPrivacy(value === false);
  }, []);

  const getPrivacy = useCallback(async () => {
    const isStrongPrivacy = await new Promise<Record<string, boolean>>((resolve) =>
      chrome.storage.sync.get(SYNC_PRIVACY_KEY, resolve),
    ).then((result) => result?.[SYNC_PRIVACY_KEY]);
    setUseServerSuggestions(!isStrongPrivacy);
  }, []);

  useEffect(() => {
    getPrivacy();
  }, [getPrivacy]);

  const context = {
    useServerSuggestions,
    handlePrivacyChange,
  };

  //-----------------------------------------------------------------------------------------------
  // ! Render
  //-----------------------------------------------------------------------------------------------

  const PrivacySection = () => (
    <section>
      <Divider />
      <div className="settings-section-content">
        <Switch
          className="privacy-toggle-button"
          checked={useServerSuggestions}
          onChange={handlePrivacyChange}
        />
      </div>
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
          <PrivacySection />
        </div>
      </div>
    </SettingsContext.Provider>
  );
};

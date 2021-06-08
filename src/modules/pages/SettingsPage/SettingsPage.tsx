import React, { useState } from 'react';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';
import Typography from 'antd/lib/typography';
import Divider from 'antd/lib/divider';
import Switch from 'antd/lib/switch';
import { OPEN_AUGMENTATION_BUILDER_MESSAGE, OPEN_BUILDER_PAGE } from 'utils';
import { RefreshCw } from 'react-feather';
import 'antd/lib/switch/style/index.css';
import 'antd/lib/input/style/index.css';
import 'antd/lib/button/style/index.css';
import './SettingsPage.scss';

const { Title } = Typography;

/** MAGICS **/
const HEADER_TITLE = 'Settings';
const HEADER_LEFT_BUTTON_TEXT = 'Close';
const EMAIL_INPUT_PLACEHOLDER = 'Email';
const LOGIN_SECTION_TITLE = 'Login to your account';
const PRIVACY_SECTION_TITLE = 'Choose your privacy settings';
/* const BOOKMARKS_SECTION_TITLE = 'Enable bookmarks sync'; */
const LOGIN_BUTTON_TEXT = 'Login';
const BOOKMARKS_SYNC_BUTTON_TEXT = 'Sync Bookmarks';
const INACTIVE_LICENSE_MAIN_HEADER = 'Maximum Privacy Enabled';
const INACTIVE_LICENSE_TEXT_CONTENT = (
  <>
    <p>Unlicensed usage never sends any information about the page you visit to our servers.</p>
    <p>However, the suggestions we can make are limited.</p>
  </>
);

export const SettingsPage = () => {
  const [emailValue, setEmailValue] = useState<string>('');

  const handleClose = () => {
    chrome.runtime.sendMessage({
      type: OPEN_AUGMENTATION_BUILDER_MESSAGE,
      page: OPEN_BUILDER_PAGE.ACTIVE,
      create: true,
    });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailValue(e.target.value);
  };

  return (
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
          <h2 className="title">{LOGIN_SECTION_TITLE}</h2>
          <div className="settings-section-content insight-row">
            <Input
              type="text"
              value={emailValue}
              placeholder={EMAIL_INPUT_PLACEHOLDER}
              onChange={handleEmailChange}
            />
            <Button type="primary" onClick={handleClose}>
              {LOGIN_BUTTON_TEXT}
            </Button>
          </div>
          <Divider />
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
        {/* change privacy */}
        <section>
          <h2 className="title">{PRIVACY_SECTION_TITLE}</h2>
          <div className="settings-section-content">
            <Switch className="privacy-toggle-button" />
            <Title level={2}>{INACTIVE_LICENSE_MAIN_HEADER}</Title>
            <div className="privacy-explainer">{INACTIVE_LICENSE_TEXT_CONTENT}</div>
          </div>
        </section>
      </div>
    </div>
  );
};

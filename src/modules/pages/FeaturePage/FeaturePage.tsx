import React from 'react';
import Button from 'antd/lib/button';
import Divider from 'antd/lib/divider';
import Switch from 'antd/lib/switch';
import { OPEN_AUGMENTATION_BUILDER_MESSAGE, SIDEBAR_PAGE } from 'constant';
import { useFeature } from 'lib/features';
import 'antd/lib/switch/style/index.css';
import 'antd/lib/button/style/index.css';

/** MAGICS **/
const HEADER_TITLE = 'Settings';
const HEADER_LEFT_BUTTON_TEXT = 'Close';

export const FeaturePage: FeaturePage = () => {
  const [bookmarksFeature, toggleBookmarksFeature] = useFeature('desktop_bookmarks');
  const [loginFeature, toggleLoginFeature] = useFeature('desktop_login');

  const handleToggleLogin = () => toggleLoginFeature();
  const handleToggleBookmarks = () => toggleBookmarksFeature();

  const handleClose = () => {
    chrome.runtime.sendMessage({
      type: OPEN_AUGMENTATION_BUILDER_MESSAGE,
      page: SIDEBAR_PAGE.SETTINGS,
    });
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
        <section>
          <h2 className="title">Temporarily Enable/Disable Development Features</h2>
          <div className="settings-section-content insight-row">
            <h2>Toggle Login Feature</h2>
            <Switch
              style={{ marginLeft: '50px' }}
              className="privacy-toggle-button"
              checked={loginFeature}
              onChange={handleToggleLogin}
            />
          </div>
          <div className="settings-section-content insight-row">
            <h2>Toggle Bookmarks Feature</h2>
            <Switch
              style={{ marginLeft: '50px' }}
              className="privacy-toggle-button"
              checked={bookmarksFeature}
              onChange={handleToggleBookmarks}
            />
          </div>
          <Divider />
        </section>
      </div>
    </div>
  );
};

import React from 'react';
import Button from 'antd/lib/button';
import Divider from 'antd/lib/divider';
import Switch from 'antd/lib/switch';
import { MESSAGE, PAGE } from 'constant';
import { useFeature } from 'lib/features';
import 'antd/lib/switch/style/index.css';
import 'antd/lib/button/style/index.css';

/** MAGICS **/
const HEADER_TITLE = 'Settings';
const HEADER_LEFT_BUTTON_TEXT = 'Close';

export const FeaturePage: FeaturePage = () => {
  const [bookmarksFeature, toggleBookmarksFeature] = useFeature('desktop_bookmarks');
  const [loginFeature, toggleLoginFeature] = useFeature('desktop_login');
  const [ratingFeature, toggleRatingFeature] = useFeature('desktop_ratings');

  const handleToggleLogin = () => toggleLoginFeature();
  const handleToggleBookmarks = () => toggleBookmarksFeature();

  const handleClose = () => {
    chrome.runtime.sendMessage({
      type: MESSAGE.OPEN_PAGE,
      page: PAGE.SETTINGS,
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
            <Switch
              style={{ marginRight: '20px' }}
              className="privacy-toggle-button"
              checked={ratingFeature}
              onChange={toggleRatingFeature}
            />
            <h2>Toggle Publication Review Feature</h2>
          </div>
          <div className="settings-section-content insight-row">
            <Switch
              style={{ marginRight: '20px' }}
              className="privacy-toggle-button"
              checked={loginFeature}
              onChange={handleToggleLogin}
            />
            <h2>Toggle Login Feature</h2>
          </div>
          <div className="settings-section-content insight-row">
            <Switch
              style={{ marginRight: '20px' }}
              className="privacy-toggle-button"
              checked={bookmarksFeature}
              onChange={handleToggleBookmarks}
            />
            <h2>Toggle Bookmarks Feature</h2>
          </div>
          <Divider />
        </section>
      </div>
    </div>
  );
};

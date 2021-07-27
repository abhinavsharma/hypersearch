/**
 * @module modules:settings
 * @version 1.0.0
 * @license (C) Insight
 */

import React, { useEffect, useState } from 'react';
import Button from 'antd/lib/button';
import { RefreshCw } from 'react-feather';
import UserManager from 'lib/user';
import { FeatureGate } from 'lib/features';
import { SYNC_END_MESSAGE, SYNC_TRIGGER_START_MESSAGE } from 'constant';

//-----------------------------------------------------------------------------------------------
// ! Magics
//-----------------------------------------------------------------------------------------------
const BOOKMARKS_SYNC_BUTTON_TEXT = 'Sync Bookmarks';
const BOOKMARKS_SYNCING_BUTTON_TEXT = 'Syncing Bookmarks';
const BOOKMARKS_SYNC_BUTTON_LOGIN_TEXT = 'Login to sync Bookmarks';

//-----------------------------------------------------------------------------------------------
// ! Component
//-----------------------------------------------------------------------------------------------
export const BookmarksSyncButton: BookmarksSyncButton = ({ token }) => {
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  //-----------------------------------------------------------------------------------------------
  // ! Handlers
  //-----------------------------------------------------------------------------------------------
  const handleSync = async () => {
    setIsSyncing(true);
    UserManager.startSync(true);
  };

  useEffect(() => {
    chrome.runtime.onMessage.addListener((msg) => {
      switch (msg.type) {
        case SYNC_TRIGGER_START_MESSAGE:
          setIsSyncing(true);
          break;
        case SYNC_END_MESSAGE:
          setIsSyncing(false);
          break;
      }
    });
  }, []);

  //-----------------------------------------------------------------------------------------------
  // ! Render
  //-----------------------------------------------------------------------------------------------
  const Content = () => (
    <span className="insight-row">
      <RefreshCw className={isSyncing ? 'spin' : ''} />
      {`\u00a0${
        isSyncing
          ? BOOKMARKS_SYNCING_BUTTON_TEXT
          : // prettier-ignore
          !token
            ? BOOKMARKS_SYNC_BUTTON_LOGIN_TEXT
            : BOOKMARKS_SYNC_BUTTON_TEXT
      }`}
    </span>
  );

  const component = (
    <Button block type="primary" onClick={handleSync} disabled={!token || isSyncing}>
      <Content />
    </Button>
  );

  return <FeatureGate feature="desktop_bookmarks" component={component} fallback={null} />;
};

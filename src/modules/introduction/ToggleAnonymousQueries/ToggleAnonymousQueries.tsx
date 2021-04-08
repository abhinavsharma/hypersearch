import React, { useCallback, useEffect, useState } from 'react';
import { Switch, Typography } from 'antd';
import { SYNC_PRIVACY_KEY } from 'utils';
import './ToggleAnonymousQueries.scss';

const { Title } = Typography;

export const ToggleAnonymousQueries = () => {
  const [checked, setChecked] = useState<boolean>();

  const getStorageValue = useCallback(async () => {
    const isAnonymous = await new Promise((resolve) =>
      chrome.storage.sync.get(SYNC_PRIVACY_KEY, resolve),
    ).then((result) => result[SYNC_PRIVACY_KEY]);
    setChecked(isAnonymous);
  }, []);

  useEffect(() => {
    getStorageValue();
  }, [getStorageValue]);

  const handleToggle = (value: boolean) => {
    setChecked(value);
    chrome.storage.sync.set({ [SYNC_PRIVACY_KEY]: value });
  };

  return (
    <div id="privacy-toggle-container">
      <Switch className="privacy-toggle-button" checked={checked} onChange={handleToggle} />
      <Title level={3}>{checked ? 'Anonymized Server Calls' : '100% Local'}</Title>
      {checked ? (
        <>
          <p>Allows us to make more suggestions on more sites.</p>
          <p>We don't log any identifiable data, not even your IP address.</p>
        </>
      ) : (
        <>
          <p>No data is ever sent to our servers.</p>
          <p>Suggestions are limited to Google, DuckDuckGo and Bing.</p>
        </>
      )}
    </div>
  );
};

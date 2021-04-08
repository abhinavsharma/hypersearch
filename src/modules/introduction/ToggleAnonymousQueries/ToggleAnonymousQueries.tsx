import React, { useCallback, useEffect, useState } from 'react';
import { Switch, Typography } from 'antd';
import './ToggleAnonymousQueries.scss';

const { Title } = Typography;

export const ToggleAnonymousQueries = () => {
  const [checked, setChecked] = useState<boolean>();

  const getStorageValue = useCallback(async () => {
    const isAnonymous = await new Promise((resolve) =>
      chrome.storage.local.get('anonymousQueries', resolve),
    ).then(({ anonymousQueries }) => anonymousQueries);
    setChecked(isAnonymous);
  }, []);

  useEffect(() => {
    getStorageValue();
  }, [getStorageValue]);

  const handleToggle = (anonymousQueries: boolean) => {
    setChecked(anonymousQueries);
    chrome.storage.local.set({ anonymousQueries });
  };

  return (
    <div id="privacy-toggle-container">
      <Switch className="privacy-toggle-button" checked={checked} onChange={handleToggle} />
      <Title level={3}>{checked ? 'Anonymized Server Calls' : '100% Local'}</Title>
      {checked ? (
        <>
          <p>No data is ever sent to our servers.</p>
          <p>Suggestions are limited on non-Google sites.</p>
        </>
      ) : (
        <>
          <p>Allows us to make more suggestions on more sites.</p>
          <p>We don't log any identifiable data, not even your IP address.</p>
        </>
      )}
    </div>
  );
};

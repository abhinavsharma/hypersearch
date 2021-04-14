import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { Switch, Typography } from 'antd';
import { SYNC_PRIVACY_KEY } from 'utils';
import './ToggleAnonymousQueries.scss';

const CheckCircleFilled = React.lazy(
  async () => await import('@ant-design/icons/CheckCircleFilled').then((mod) => mod),
);

const WarningOutlined = React.lazy(
  async () => await import('@ant-design/icons/WarningOutlined').then((mod) => mod),
);

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
      <Title level={3}>{checked ? 
      <>
        <Suspense fallback={null}>
          <CheckCircleFilled />
        </Suspense>
        &nbsp;Use server suggestions
      </> : <>
        <Suspense fallback={null}>
          <WarningOutlined />
        </Suspense>
        &nbsp;Do not use sever suggestions
      </>}</Title>
      {checked ? (
        <div className="privacy-explainer">
          <p>Recommended for most people, even very privacy sensitive users.</p>
          <p>Search is computationally complex. 
            While we allow for 100% client side processing, in order to get the best results, we (like any major search engine, even DuckDuckGo) need to process queries on a server and see which results were clicked on.
          </p>
          <p>
          Our logging standards are stricter than any search engine. We only log dictionary word queries, have no trackers, don't log IP addresses, and delete all logs after 1 month.
          </p>
        </div>
      ) : (
        <div className="privacy-explainer">
          <p>Only recommended for local use.</p>
          <p>The URLs you visit are never shared with our servers. This limits the suggestions we can make.</p>
        </div>
      )}
    </div>
  );
};

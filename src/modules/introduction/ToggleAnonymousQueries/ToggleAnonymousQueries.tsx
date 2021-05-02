import React, { Suspense, useCallback, useContext, useEffect, useState } from 'react';
import { Switch, Typography } from 'antd';
import { SYNC_PRIVACY_KEY } from 'utils';
import { StepContext } from 'modules/introduction';
import './ToggleAnonymousQueries.scss';

const CheckCircleFilled = React.lazy(
  async () => await import('@ant-design/icons/CheckCircleFilled').then((mod) => mod),
);

const WarningOutlined = React.lazy(
  async () => await import('@ant-design/icons/WarningOutlined').then((mod) => mod),
);

const { Title } = Typography;

export const ToggleAnonymousQueries = () => {
  const stepContext = useContext(StepContext);
  const [checked, setChecked] = useState<boolean>();

  const getStorageValue = useCallback(async () => {
    const isAnonymous = await new Promise((resolve) =>
      chrome.storage.sync.get(SYNC_PRIVACY_KEY, resolve),
    ).then((result) => result[SYNC_PRIVACY_KEY]);
    if (isAnonymous === undefined && stepContext.license.isActivated) {
      chrome.storage.sync.set({ [SYNC_PRIVACY_KEY]: true });
      setChecked(true);
    } else {
      stepContext.license.isActivated && setChecked(isAnonymous);
    }
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
      <Title level={3}>
        {checked ? (
          <>
            <Suspense fallback={null}>
              <CheckCircleFilled />
            </Suspense>{' '}
            Use server suggestions
          </>
        ) : (
          <>
            <Suspense fallback={null}>
              <WarningOutlined />
            </Suspense>{' '}
            Do not use sever suggestions
          </>
        )}
      </Title>
      {checked ? (
        <div className="privacy-explainer">
          <p>Recommended for most people, even very privacy sensitive users.</p>
          <p>
            <b>What data do we log?</b>
          </p>

          <ul>
            <li>
              Only dictionary words. For example, if the query was "felicia mountain view" we don't
              log it at all.
            </li>
            <li>
              We <b>do not log anything that can link users to queries</b>. Your IP, license key,
              cookie information, device information does not get logged.{' '}
            </li>
            <li>We also delete all query logs after 1 month.</li>
          </ul>

          <p>
            <b>Why send data to servers at all?</b> Search is computationally complex. While we have
            a local mode, in order to get the best results, we (like any major search engine, even
            DuckDuckGo) need to process queries on a server.
          </p>
        </div>
      ) : (
        <div className="privacy-explainer">
          <p>Only recommended for local use.</p>
          <p>
            <b>What data do we log?</b>
          </p>

          <ul>
            <li>The number of times lenses were used so we can track license key usage.</li>
            <li>
              We <b>do not send URLs visited to our servers</b>. There's no way we can know what
              pages were visited.
            </li>
          </ul>

          <p>
            <b>What are the drawbacks?</b> With this mode we can only suggest simpler lenses that
            don't use data-intensive algorithms.
          </p>
        </div>
      )}
    </div>
  );
};

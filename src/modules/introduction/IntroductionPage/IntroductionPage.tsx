import React, { useCallback, useEffect, useState } from 'react';
import { Collapse, Input, Button, List, Typography } from 'antd';
import { APP_NAME } from 'utils/constants';
import { ToggleAnonymousQueries } from 'modules/introduction';

const { Panel } = Collapse;
const { Paragraph } = Typography;

const listData = {
  'Startups: sources trusted by top founders & investors': [
    { text: 'how to raise a seed round' },
    { text: 'how to hire engineers' },
    { text: 'how to hire marketers' },
  ],

  'Dev: see sources trusted by engineers, designers, data scientists': [
    { text: 'best js framework' },
    { text: 'best machine learning books' },
  ],

  "eCommerce: see real people's perspectives and trusted review sites": [
    { text: 'best car insurance' },
    { text: 'best baby monitor' },
    { text: 'best ev to buy 2021' },
  ],

  'News: see different perspectives': [{ text: 'will trump run in 2024' }],

  'Misc: learn new things better & faster with insider trusted sources': [
    { text: 'how to build a bunker' },
    { text: 'best crypto books' },
    { text: 'best red wines for beginners' },
  ],
};

export const IntroductionPage = () => {
  const [activeKeys, setActiveKeys] = useState<string[]>(['1', '2']);
  const [license, setLicense] = useState<Record<string, any>>(Object.create(null));

  const getStored = useCallback(async () => {
    const stored = await new Promise((resolve) =>
      chrome.storage.local.get('licenseActivated', resolve),
    ).then(({ licenseActivated }) => licenseActivated as string);
    if (stored) {
      setLicense({ isActivated: true, key: stored });
      setActiveKeys(['2']);
    }
  }, []);

  useEffect(() => {
    document.title = `Welcome to ${APP_NAME}`;
    getStored();
  }, [getStored]);

  const handleLicenseSubmit = async () => {
    setLicense((prev) => ({ ...prev, isActivated: true }));
    setActiveKeys(['2', '3']);
    await new Promise((resolve) =>
      chrome.storage.local.set({ licenseActivated: license.key }, () => resolve(null)),
    );
  };

  const validateLicense = () => {
    return license.key?.length === 39 && license.key?.match(/^[\w-]*$/gi);
  };

  const LicenseHeader = () => {
    return (
      <span
        className="intro-panel-header"
        dangerouslySetInnerHTML={{
          __html: !license.isActivated
            ? `Step 1. Enter your license to activate ${APP_NAME}`
            : `Step 1. You have successfully activated <strong>${license.key}</strong> license key!`,
        }}
      />
    );
  };

  const ExamplesHeader = () => {
    return <span className="intro-panel-header">Step 2. Try some queries</span>;
  };

  const PrivacyHeader = () => {
    return <span className="intro-panel-header">Step 3. Share anonymized data to improve {APP_NAME}</span>;
  };

  return (
    <>
      <div className="insight-intro-title">
        <h1>Hello. Welcome to {APP_NAME}</h1>
        <div className="insight-intro-subtitle">
          <div className="insight-intro-privacy-note">🔒 Your privacy is paramount.</div>
          <Typography.Text>All processing is client-side and never log your visit data unless you opt-in to anonymous sharing.</Typography.Text>
        </div>
      </div>
      <Collapse
        accordion
        activeKey={activeKeys}
        onChange={(e) =>
          setActiveKeys(Array.isArray(e) ? [...e.filter((i) => i !== '2'), '2'] : [e, '2'])
        }
      >
        <Panel header={<LicenseHeader />} key="1">
          <div className="license-panel">
            <Input
              type="text"
              minLength={39}
              maxLength={39}
              value={license.key}
              onChange={(e) => setLicense({ key: e.target.value })}
              disabled={license.isActivated}
            />
            <Button
              type="primary"
              onClick={handleLicenseSubmit}
              disabled={!validateLicense() || license.isActivated}
            >
              Activate
            </Button>
          </div>
          <div style={{ marginTop: 20 }}>
            <ul>
              <li>You should have received this in your welcome email</li>
              <li>
                Your license is <b>not connected to your identity</b>. You can share it if you wish.
              </li>
              <li>Each license is limited to a monthly usage limit</li>
              <li>Some licenses unlock secret features</li>
            </ul>
          </div>
        </Panel>
        <Panel header={<ExamplesHeader />} key="2">
          {Object.entries(listData).map(([key, value]) => (
            <React.Fragment key={key}>
              <List
                header={<div>{key}</div>}
                bordered
                dataSource={value}
                renderItem={(item) => (
                  <List.Item>
                    <a target="_blank" href={'https://www.google.com/search?q=' + item.text}>
                      {item.text}
                    </a>
                  </List.Item>
                )}
              />
              <div style={{ marginBottom: 20 }}></div>
            </React.Fragment>
          ))}
        </Panel>
        <Panel header={<PrivacyHeader />} key="3">
          <div className="privacy-panel">
            <ToggleAnonymousQueries />
            <Paragraph
              className="privacy-explainer"
            >
              Logging some data can massively improve everyone's user experience. With your permission, we would like to log:
              <ul>
                <li>Search queries that contain dictionary words only</li>
                <li>Position of search results clicked</li>
              </ul>
              More context:
              <ul>
                <li> We need to know what searches you were not satisifed with</li>
                <li> We DO NOT SELL this data to anyone.</li>
                <li> We delete this data every 3 months.</li>
              </ul>
            </Paragraph>
          </div>
        </Panel>
      </Collapse>
    </>
  );
};

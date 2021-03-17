import React, { useEffect, useState } from 'react';
import { Collapse, Input, Button, Switch, List, Typography } from 'antd';
import { APP_NAME } from 'utils/constants';
import Paragraph from 'antd/lib/typography/Paragraph';
import { ToggleAnonymousQueries } from 'modules/introduction';

const { Panel } = Collapse;

const listData = {
  'Startups: sources trusted by top founders & investors': [
    { text: 'how to raise a seed round' },
    { text: 'how to hire engineers' },
    { text: 'how to hire marketers' },
  ],

  'Tech: see sources trusted by engineers, designers, data scientists': [
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
  const [licenseKey, setLicenseKey] = useState<string>('');
  const [isLicenseActivated, setIsLicenseActivated] = useState<boolean>(false);
  const [activeKeys, setActiveKeys] = useState<string[]>(['1', '2', '3']);

  useEffect(() => {
    document.title = `Welcome to ${APP_NAME}`;
  }, []);

  const handleToggle = (prev, key) =>
    prev.find((i) => i === key) ? [...prev.filter((i) => i !== key)] : [...prev, key];

  const handleLicenseSubmit = () => {
    setIsLicenseActivated(true);
    setActiveKeys(['3']);
  };

  const validateLicense = () => {
    return licenseKey.length === 39 && licenseKey.match(/^[\w-]*$/gi);
  };

  const LicenseHeader = () => {
    return (
      <span
        className="intro-panel-header"
        onClick={() => setActiveKeys((prev) => handleToggle(prev, '1'))}
        dangerouslySetInnerHTML={{
          __html: !isLicenseActivated
            ? `Step 1. Enter your license to activate ${APP_NAME}`
            : `Step 1. You have successfully activated <strong>${licenseKey}</strong> license key!`,
        }}
      />
    );
  };

  const PrivacyHeader = () => {
    return (
      <span
        className="intro-panel-header"
        onClick={() => setActiveKeys((prev) => handleToggle(prev, '2'))}
      >
        Step 2. Choose your privacy setting
      </span>
    );
  };

  return (
    <>
      <div className="insight-intro-title">
        <h1>Welcome to {APP_NAME}</h1>
        <Typography.Text>Let's get you started</Typography.Text>
      </div>
      <Collapse accordion activeKey={activeKeys}>
        <Panel header={<LicenseHeader />} key="1">
          <div className="license-panel">
            <Input
              type="text"
              minLength={39}
              maxLength={39}
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
              disabled={isLicenseActivated}
            />
            <Button
              type="primary"
              onClick={handleLicenseSubmit}
              disabled={!validateLicense() || isLicenseActivated}
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
        <Panel header={<PrivacyHeader />} key="2">
          <div className="privacy-panel">
            <div className="privacy-panel-lr">
              <Switch className="privacy-toggle" />
              <span>Enable anonymous & obfuscated logging.</span>
            </div>
            <Paragraph
              ellipsis={{ rows: 1, expandable: true, symbol: 'more' }}
              className="privacy-explainer"
            >
              Logging some data is critical to improving your user experience.
              <br />
              We log
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
            <ToggleAnonymousQueries />
          </div>
        </Panel>
        <Panel header="Step 2. Try some queries" key="3">
          {Object.entries(listData).map(([key, value]) => (
            <>
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
            </>
          ))}
        </Panel>
      </Collapse>
    </>
  );
};

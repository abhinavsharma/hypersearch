import React, { useEffect, useState } from 'react';
import { Collapse, Input, Button, Switch } from 'antd';
import { APP_NAME } from 'utils/constants';

const { Panel } = Collapse;

export const IntroductionPage = () => {
  const [licenseKey, setLicenseKey] = useState<string>('');
  const [licenseIsValid, setIsLicenseValid] = useState<boolean>(false);
  const [isLicenseActivated, setIsLicenseActivated] = useState<boolean>(false);
  const [activeKeys, setActiveKeys] = useState<string[]>(['1', '2', '3']);

  useEffect(() => {
    document.title = `Welcome to ${APP_NAME}`;
  }, []);

  const handleToggle = (prev, key) =>
    prev.find((i) => i === key) ? [...prev.filter((i) => i !== key)] : [...prev, key];

  const handleLicenseSubmit = () => {
    setIsLicenseValid(true);
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
            ? `Enter your license to activate ${APP_NAME}`
            : `You have successfully activated <strong>${licenseKey}</strong> license key!`,
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
        Choose your privacy setting
      </span>
    );
  };

  return (
    <>
      <h1>Welcome to {APP_NAME}</h1>
      <Collapse activeKey={activeKeys}>
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
        </Panel>
        <Panel header={<PrivacyHeader />} key="2">
          <div className="privacy-panel">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat quos tempore hic sequi
            laudantium omnis perspiciatis sapiente mollitia illum vel praesentium, labore voluptates
            ullam sit veniam fuga quia! Veniam, error! Lorem ipsum dolor sit amet, consectetur
            adipisicing elit. Minus explicabo sed vitae, maiores optio velit tempora doloremque!
            Vero reiciendis officia nam atque quae, dolorum, eos ea, nulla adipisci laudantium
            libero! Lorem ipsum, dolor sit amet consectetur adipisicing elit. Modi inventore aut
            laborum labore tempora eveniet laudantium, hic ducimus voluptate quis? Dolorum nemo
            inventore eligendi non quasi voluptatibus consectetur aut voluptate.Lorem ipsum dolor
            sit amet consectetur adipisicing elit. Molestias natus excepturi, voluptatem animi
            officiis quasi facilis doloribus optio recusandae nisi placeat veniam autem ut
            blanditiis labore iste minus, expedita dolores.
            <Switch className="privacy-toggle" />
          </div>
        </Panel>
        <Panel header="Try some queries" key="3" collapsible="header">
          list
        </Panel>
      </Collapse>
    </>
  );
};

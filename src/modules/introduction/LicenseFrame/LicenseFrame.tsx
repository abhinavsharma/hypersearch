import React, { useContext } from 'react';
import { Helmet } from 'react-helmet';
import Button from 'antd/lib/button';
import Typography from 'antd/lib/typography';
import { LicenseForm } from 'modules/settings';
import { StepContext } from 'modules/introduction';
import UserManager from 'lib/user';
import { APP_NAME } from 'constant';
import 'antd/lib/input/style/index.css';
import 'antd/lib/button/style/index.css';
import 'antd/lib/typography/style/index.css';
import './LicenseFrame.scss';

const { Title } = Typography;

//-----------------------------------------------------------------------------------------------
// ! Magics
//-----------------------------------------------------------------------------------------------
const TAB_TITLE = `${APP_NAME} - Enter License Key`;
const PAGE_MAIN_HEADER = 'Enter Your License Key';
const USE_UNLICENSED_BUTTON_TEXT = 'Try Unlicensed';
const USE_UNLICENSED_BUTTON_STYLE: React.CSSProperties = { color: 'white' };

//-----------------------------------------------------------------------------------------------
// ! Component
//-----------------------------------------------------------------------------------------------
export const LicenseFrame = () => {
  const { setCurrentStep } = useContext(StepContext);

  //-----------------------------------------------------------------------------------------------
  // ! Handlers
  //-----------------------------------------------------------------------------------------------
  const handleNext = () => setCurrentStep(2);

  const handleFreeTier = () => {
    UserManager.replaceUserLicenses([]);
    handleNext();
  };

  //-----------------------------------------------------------------------------------------------
  // ! Render
  //-----------------------------------------------------------------------------------------------
  const UseUnlicensedButton = () => (
    <Button
      type="link"
      size="large"
      shape="round"
      style={USE_UNLICENSED_BUTTON_STYLE}
      className="step-button"
      onClick={handleFreeTier}
    >
      {USE_UNLICENSED_BUTTON_TEXT}
    </Button>
  );

  return (
    <div id="license-frame-container">
      <Helmet>
        <title>{TAB_TITLE}</title>
      </Helmet>
      <Title level={2}>{PAGE_MAIN_HEADER}</Title>
      <LicenseForm />
      <Button className="step-button" shape="round" onClick={handleNext}>
        Next
      </Button>
      <UseUnlicensedButton />
    </div>
  );
};

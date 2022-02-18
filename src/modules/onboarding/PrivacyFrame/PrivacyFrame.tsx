/**
 * @module module:onboarding
 * @version 1.0.0
 * @license (C) Insight
 */

import React, { useContext } from 'react';
import { Helmet } from 'react-helmet';
import Button from 'antd/lib/button';
import Typography from 'antd/lib/typography';
import { StepContext } from 'modules/onboarding';
import { APP_NAME } from 'constant';
import 'antd/lib/button/style/index.css';
import 'antd/lib/typography/style/index.css';
import './PrivacyFrame.scss';

//-----------------------------------------------------------------------------------------------
// ! Magics
//-----------------------------------------------------------------------------------------------
const TAB_TITLE = `${APP_NAME} - Privacy Setting`;
const NEXT_BUTTON_TEXT = 'Next';
export const ACTIVE_LICENSE_MAIN_HEADER = 'Choose a Privacy Setting';
export const INACTIVE_LICENSE_MAIN_HEADER = 'Maximum Privacy Enabled';

export const INACTIVE_LICENSE_TEXT_CONTENT = (
  <>
    <p>Unlicensed usage never sends any information about the page you visit to our servers.</p>
    <p>However, the suggestions we can make are limited.</p>
  </>
);

const { Title } = Typography;

//-----------------------------------------------------------------------------------------------
// ! Component
//-----------------------------------------------------------------------------------------------
export const PrivacyFrame = () => {
  const { setCurrentStep } = useContext(StepContext);
  const handleNext = () => setCurrentStep(2);

  //-----------------------------------------------------------------------------------------------
  // ! Render
  //-----------------------------------------------------------------------------------------------
  return (
    <>
      <Helmet>
        <title>{TAB_TITLE}</title>
      </Helmet>
      <div id="privacy-frame-container">
        <Title level={2}>{INACTIVE_LICENSE_MAIN_HEADER}</Title>
        <div className="privacy-explainer">{INACTIVE_LICENSE_TEXT_CONTENT}</div>
        <div>
          <Button
            type="ghost"
            shape="round"
            size="large"
            className="step-button"
            onClick={handleNext}
          >
            {NEXT_BUTTON_TEXT}
          </Button>
        </div>
      </div>
    </>
  );
};

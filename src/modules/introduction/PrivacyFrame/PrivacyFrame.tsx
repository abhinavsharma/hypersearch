import React, { useContext } from 'react';
import { Helmet } from 'react-helmet';
import { Button, Typography } from 'antd';
import { StepContext, ToggleAnonymousQueries } from 'modules/introduction';
import { APP_NAME } from 'utils';
import './PrivacyFrame.scss';

const { Title } = Typography;

export const PrivacyFrame = () => {
  const stepContext = useContext(StepContext);

  const handleNext = () => stepContext.setCurrentStep(3);

  return (
    <>
      <Helmet>
        <title>{APP_NAME} - Privacy Setting</title>
      </Helmet>
      <div id="privacy-frame-container">
        {stepContext.license.isActivated ? (
          <>
            <Title level={2}>Choose a Privacy Setting</Title>
            <ToggleAnonymousQueries />
          </>
        ) : (
          <>
            <Title level={2}>Maximum Privacy Enabled</Title>
            <div className="privacy-explainer">
              <p>
                Unlicensed usage never sends any information about the page you visit to our servers.
              </p>
              <p>However, the suggestions we can make are limited.</p>
            </div>
          </>
        )}
        <Button
          type="ghost"
          shape="round"
          size="large"
          className="step-button"
          onClick={handleNext}
        >
          Next
        </Button>
      </div>
    </>
  );
};

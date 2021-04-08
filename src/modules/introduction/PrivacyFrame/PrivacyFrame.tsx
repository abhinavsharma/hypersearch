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
        <Title level={2}>Choose a Privacy Setting</Title>
        <ToggleAnonymousQueries />
        <Button
          type="ghost"
          shape="round"
          size="large"
          className="step-button"
          onClick={handleNext}
        >
          Next Step
        </Button>
      </div>
    </>
  );
};

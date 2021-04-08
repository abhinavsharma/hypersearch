import React, { useContext, useState } from 'react';
import { Typography, Button } from 'antd';
import Typist from 'react-typist';
import { StepContext } from 'modules/introduction';
import 'antd/dist/antd.dark.min.css';
import './WelcomeFrame.scss';

const { Title } = Typography;

export const WelcomeFrame = () => {
  const [titleLoaded, setTitleLoaded] = useState<boolean>(false);
  const stepContext = useContext(StepContext);

  const handleTyped = () => setTitleLoaded(true);

  const handleNext = () => stepContext.setCurrentStep(1);

  return (
    <div id="welcome-frame-container">
      <Title level={1} className="main-title">
        <Typist cursor={{ show: false }} avgTypingDelay={80} onTypingDone={handleTyped}>
          Hello
        </Typist>
      </Title>
      <div id="fade-section" className={titleLoaded ? 'fade-section-visible' : ''}>
        <Title level={2}>Ready to supercharge search?</Title>
        <Button
          type="ghost"
          shape="round"
          size="large"
          className="step-button"
          onClick={handleNext}
        >
          Yes
        </Button>
      </div>
    </div>
  );
};

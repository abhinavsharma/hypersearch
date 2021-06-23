import React, { useContext, useState } from 'react';
import Typography from 'antd/lib/typography';
import Button from 'antd/lib/button';
import { Helmet } from 'react-helmet';
import Typist from 'react-typist';
import { StepContext } from 'modules/introduction';
import { APP_NAME } from 'constant';
import 'antd/lib/typography/style/index.css';
import 'antd/lib/button/style/index.css';
import './WelcomeFrame.scss';

const TAB_TITLE = `Welcome to ${APP_NAME}`;
const PAGE_MAIN_HEADER = 'Ready to supercharge search?';
const NEXT_BUTTON_TEXT = 'Yes';
const TYPIST_TEXT = 'Hello';
// ! See: https://www.npmjs.com/package/react-typist#typist-props
const TYPIST_CONFIG = {
  cursor: { show: false },
  avgTypingDelay: 80,
};

const { Title } = Typography;

export const WelcomeFrame = () => {
  const [titleLoaded, setTitleLoaded] = useState<boolean>(false);
  const stepContext = useContext(StepContext);
  const handleTyped = () => setTitleLoaded(true);
  const handleNext = () => stepContext.setCurrentStep(1);

  return (
    <>
      <Helmet>
        <title>{TAB_TITLE}</title>
      </Helmet>
      <div id="welcome-frame-container">
        <Title level={1} className="main-title">
          <Typist {...TYPIST_CONFIG} onTypingDone={handleTyped}>
            {TYPIST_TEXT}
          </Typist>
        </Title>
        <div id="fade-section" className={titleLoaded ? 'fade-section-visible' : ''}>
          <Title level={2}>{PAGE_MAIN_HEADER}</Title>
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

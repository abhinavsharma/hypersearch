import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Steps from 'antd/lib/steps';
import { WelcomeFrame, PrivacyFrame, QueriesFrame } from 'modules/introduction';
import { IntroStepContext } from 'types/introduction';
import { EmailFrame } from '../EmailFrame/EmailFrame';
import { APP_NAME, SYNC_FINISHED_KEY } from 'utils';
import 'antd/lib/steps/style/index.css';
import './IntroductionPage.scss';

/** MAGICS **/
const TAB_TITLE = `Welcome to ${APP_NAME}`;
const WELCOME_SECTION_TITLE = 'Welcome';
const EMAIL_SECTION_TITLE = 'Email';
const PRIVACY_SECTION_TITLE = 'Privacy';
const FINISHED_SECTION_TITLE = 'Done';

const { Step } = Steps;

export const StepContext = React.createContext<IntroStepContext>(Object.create(null));

export const IntroductionPage = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [finished, setFinished] = useState<boolean>(false);

  const checkFinished = useCallback(async () => {
    const stored = await new Promise<Record<string, boolean>>((resolve) =>
      chrome.storage.sync.get(SYNC_FINISHED_KEY, resolve),
    ).then((result) => !!result?.[SYNC_FINISHED_KEY]);
    setFinished(stored);
    if (stored) {
      setCurrentStep(3);
    }
  }, []);

  useEffect(() => {
    checkFinished();
  }, [checkFinished]);

  const contextValue = {
    currentStep,
    setCurrentStep,
    finished,
    setFinished,
  };

  const STEPS = [
    <WelcomeFrame key={0} />,
    <EmailFrame key={1} />,
    <PrivacyFrame key={2} />,
    <QueriesFrame key={3} />,
  ];

  return (
    <div id="insight-intro-container">
      <Helmet>
        <title>{TAB_TITLE}</title>
      </Helmet>
      <StepContext.Provider value={contextValue}>
        <Steps current={currentStep} onChange={setCurrentStep}>
          <Step title={WELCOME_SECTION_TITLE} />
          <Step title={EMAIL_SECTION_TITLE} />
          <Step title={PRIVACY_SECTION_TITLE} />
          <Step title={FINISHED_SECTION_TITLE} disabled={currentStep !== 2 && !finished} />
        </Steps>
        {STEPS[currentStep]}
      </StepContext.Provider>
    </div>
  );
};

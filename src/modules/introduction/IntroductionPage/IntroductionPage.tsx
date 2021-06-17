import React, { SetStateAction, useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Steps from 'antd/lib/steps';
import { WelcomeFrame, PrivacyFrame, QueriesFrame, LicenseFrame } from 'modules/introduction';
import { EmailFrame } from '../EmailFrame/EmailFrame';
import { APP_NAME, SYNC_FINISHED_KEY } from 'utils';
import 'antd/lib/steps/style/index.css';
import './IntroductionPage.scss';
import { useFeature } from 'lib/FeatureGate/FeatureGate';
import UserManager from 'lib/UserManager';

/** MAGICS **/
const TAB_TITLE = `Welcome to ${APP_NAME}`;
const WELCOME_SECTION_TITLE = 'Welcome';
const LICENSE_SECTION_TITLE = 'License';
const EMAIL_SECTION_TITLE = 'Email';
const PRIVACY_SECTION_TITLE = 'Privacy';
const FINISHED_SECTION_TITLE = 'Done';

const { Step } = Steps;

type TStepContext = {
  currentStep: number;
  setCurrentStep: React.Dispatch<SetStateAction<number>>;
  finished: boolean;
  license: string | undefined;
  setLicense: React.Dispatch<SetStateAction<string | undefined>>;
  setFinished: React.Dispatch<SetStateAction<boolean>>;
};

export const StepContext = React.createContext<TStepContext>(Object.create(null));

export const IntroductionPage = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [license, setLicense] = useState<string | undefined>(UserManager.user.license);
  const [finished, setFinished] = useState<boolean>(false);
  const [loginFeature] = useFeature('desktop_login');

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
    license,
    setLicense,
  };

  const STEPS = [
    <WelcomeFrame key={0} />,
    loginFeature ? <EmailFrame key={1} /> : <LicenseFrame key={1} />,
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
          {loginFeature ? (
            <Step title={EMAIL_SECTION_TITLE} />
          ) : (
            <Step title={LICENSE_SECTION_TITLE} />
          )}
          <Step title={PRIVACY_SECTION_TITLE} />
          <Step title={FINISHED_SECTION_TITLE} disabled={currentStep !== 2 && !finished} />
        </Steps>
        {STEPS[currentStep]}
      </StepContext.Provider>
    </div>
  );
};

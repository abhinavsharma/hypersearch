import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Steps from 'antd/lib/steps';
import { LicenseFrame, WelcomeFrame, PrivacyFrame, QueriesFrame } from 'modules/introduction';
import { IntroStepContext, StoredLicense } from 'types/introduction';
import { APP_NAME, SYNC_FINISHED_KEY, SYNC_LICENSE_KEY } from 'utils';
import 'antd/lib/steps/style/index.css';
import './IntroductionPage.scss';

/** MAGICS **/
const TAB_TITLE = `Welcome to ${APP_NAME}`;
const WELCOME_SECTION_TITLE = 'Welcome';
const LICENSE_SECTION_TITLE = 'License';
const PRIVACY_SECTION_TITLE = 'Privacy';
const FINISHED_SECTION_TITLE = 'Done';

const { Step } = Steps;

export const StepContext = React.createContext<IntroStepContext>(Object.create(null));

export const IntroductionPage = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [license, setLicense] = useState<StoredLicense>(Object.create(null));
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

  const getStoredLicense = useCallback(async () => {
    const stored = await new Promise<Record<string, string>>((resolve) =>
      chrome.storage.sync.get(SYNC_LICENSE_KEY, resolve),
    ).then((result) => result?.[SYNC_LICENSE_KEY] as string);
    if (stored) {
      setLicense({ isActivated: true, key: stored });
    }
  }, []);

  useEffect(() => {
    checkFinished();
  }, [checkFinished]);

  useEffect(() => {
    getStoredLicense();
  }, [getStoredLicense]);

  const contextValue = {
    currentStep,
    setCurrentStep,
    license,
    setLicense,
    finished,
    setFinished,
  };

  const STEPS = [
    <WelcomeFrame key={0} />,
    <LicenseFrame key={1} />,
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
          <Step title={LICENSE_SECTION_TITLE} />
          <Step title={PRIVACY_SECTION_TITLE} />
          <Step title={FINISHED_SECTION_TITLE} disabled={currentStep !== 3 && !finished} />
        </Steps>
        {STEPS[currentStep]}
      </StepContext.Provider>
    </div>
  );
};

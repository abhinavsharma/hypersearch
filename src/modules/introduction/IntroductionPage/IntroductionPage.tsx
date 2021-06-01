import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Steps from 'antd/lib/steps';
import { LicenseFrame, WelcomeFrame, PrivacyFrame, QueriesFrame } from 'modules/introduction';
import { IntroStepContext, StoredLicense } from 'types/introduction';
import { EmailFrame } from '../EmailFrame/EmailFrame';
import { APP_NAME, SYNC_EMAIL_KEY, SYNC_FINISHED_KEY, SYNC_LICENSE_KEY } from 'utils';
import 'antd/lib/steps/style/index.css';
import './IntroductionPage.scss';

/** MAGICS **/
const TAB_TITLE = `Welcome to ${APP_NAME}`;
const WELCOME_SECTION_TITLE = 'Welcome';
const EMAIL_SECTION_TITLE = 'Email';
const LICENSE_SECTION_TITLE = 'License';
const PRIVACY_SECTION_TITLE = 'Privacy';
const FINISHED_SECTION_TITLE = 'Done';

const { Step } = Steps;

export const StepContext = React.createContext<IntroStepContext>(Object.create(null));

export const IntroductionPage = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [email, setEmail] = useState<string>('');
  const [license, setLicense] = useState<StoredLicense>(Object.create(null));
  const [finished, setFinished] = useState<boolean>(false);

  const checkFinished = useCallback(async () => {
    const stored = await new Promise<Record<string, boolean>>((resolve) =>
      chrome.storage.sync.get(SYNC_FINISHED_KEY, resolve),
    ).then((result) => !!result?.[SYNC_FINISHED_KEY]);
    setFinished(stored);
    if (stored) {
      setCurrentStep(4);
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

  const getStoredEmail = useCallback(async () => {
    const stored = await new Promise<Record<string, string>>((resolve) =>
      chrome.storage.sync.get(SYNC_EMAIL_KEY, resolve),
    ).then((result) => result?.[SYNC_EMAIL_KEY] as string);
    if (stored) {
      setEmail(stored);
    }
  }, []);

  useEffect(() => {
    checkFinished();
  }, [checkFinished]);

  useEffect(() => {
    getStoredLicense();
    getStoredEmail();
  }, [getStoredLicense, getStoredEmail]);

  const contextValue = {
    currentStep,
    setCurrentStep,
    email,
    setEmail,
    license,
    setLicense,
    finished,
    setFinished,
  };

  const STEPS = [
    <WelcomeFrame key={0} />,
    <EmailFrame key={1} />,
    <LicenseFrame key={2} />,
    <PrivacyFrame key={3} />,
    <QueriesFrame key={4} />,
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
          <Step title={LICENSE_SECTION_TITLE} />
          <Step title={PRIVACY_SECTION_TITLE} />
          <Step title={FINISHED_SECTION_TITLE} disabled={currentStep !== 3 && !finished} />
        </Steps>
        {STEPS[currentStep]}
      </StepContext.Provider>
    </div>
  );
};

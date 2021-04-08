import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Steps } from 'antd';
import { LicenseFrame, WelcomeFrame, PrivacyFrame, QueriesFrame } from 'modules/introduction';
import { APP_NAME, SYNC_FINISHED_KEY } from 'utils';
import './IntorductionPage.scss';

const { Step } = Steps;

export const StepContext = React.createContext(null);

export const IntroductionPage = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [license, setLicense] = useState<Record<string, any>>(Object.create(null));
  const [finished, setFinished] = useState<boolean>(false);

  const checkFinished = useCallback(async () => {
    const stored = await new Promise((resolve) =>
      chrome.storage.sync.get(SYNC_FINISHED_KEY, resolve),
    ).then((result) => !!result[SYNC_FINISHED_KEY]);
    setFinished(stored);
    if (stored) {
      setCurrentStep(3);
    }
  }, []);

  useEffect(() => {
    checkFinished();
  }, [checkFinished]);

  return (
    <div id="insight-intro-container">
      <Helmet>
        <title>Welcome to {APP_NAME}</title>
      </Helmet>
      <StepContext.Provider
        value={{ currentStep, setCurrentStep, license, setLicense, finished, setFinished }}
      >
        <Steps current={currentStep} onChange={setCurrentStep}>
          <Step title="Welcome" />
          <Step title="License" disabled={license.isActivated} />
          <Step title="Privacy" />
          <Step title="Finish" disabled={currentStep !== 3 && !finished} />
        </Steps>
        {(() => {
          switch (currentStep) {
            case 0:
              return <WelcomeFrame />;
            case 1:
              return <LicenseFrame />;
            case 2:
              return <PrivacyFrame />;
            case 3:
              return <QueriesFrame />;
            default:
              return null;
          }
        })()}
      </StepContext.Provider>
    </div>
  );
};

/**
 * @module modules:introduction
 * @version 1.0.0
 * @license (C) Insight
 */

import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Steps from 'antd/lib/steps';
import {
  WelcomeFrame,
  PrivacyFrame,
  QueriesFrame,
} from 'modules/onboarding';
import { APP_NAME, SYNC_FINISHED_KEY } from 'constant';
import 'antd/lib/steps/style/index.css';
import './IntroductionPage.scss';

const { Step } = Steps;

//-----------------------------------------------------------------------------------------------
// ! Magics
//-----------------------------------------------------------------------------------------------
const TAB_TITLE = `Welcome to ${APP_NAME}`;
const WELCOME_SECTION_TITLE = 'Welcome';
const PRIVACY_SECTION_TITLE = 'Privacy';
const FINISHED_SECTION_TITLE = 'Done';

//-----------------------------------------------------------------------------------------------
// ! Context
//-----------------------------------------------------------------------------------------------
type TContext = {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  finished: boolean;
  setFinished: React.Dispatch<React.SetStateAction<boolean>>;
};
export const StepContext = React.createContext<TContext>(Object.create(null));

//-----------------------------------------------------------------------------------------------
// ! Component
//-----------------------------------------------------------------------------------------------
export const IntroductionPage: IntroductionPage = () => {
  const CONTEXT_VALUE: TContext = Object.create(null);

  const [currentStep, setCurrentStep] = useState<number>(0);
  CONTEXT_VALUE.currentStep = currentStep;
  CONTEXT_VALUE.setCurrentStep = setCurrentStep;

  const [finished, setFinished] = useState<boolean>(false);
  CONTEXT_VALUE.finished = finished;
  CONTEXT_VALUE.setFinished = setFinished;

  const STEPS = [
    {
      title: WELCOME_SECTION_TITLE,
      component: <WelcomeFrame key={0} />,
      disabled: undefined,
    },
    {
      title: PRIVACY_SECTION_TITLE,
      component: <PrivacyFrame key={1} />,
      disabled: undefined,
    },
    {
      title: FINISHED_SECTION_TITLE,
      component: <QueriesFrame key={2} />,
      disabled: currentStep !== 2 && !finished,
    },
  ];

  //-----------------------------------------------------------------------------------------------
  // ! Handlers
  //-----------------------------------------------------------------------------------------------
  const checkFinished = useCallback(async () => {
    const stored = await new Promise<Record<string, boolean>>((resolve) =>
      chrome.storage.sync.get(SYNC_FINISHED_KEY, resolve),
    ).then((result) => !!result?.[SYNC_FINISHED_KEY]);
    setFinished(stored);
    if (stored) {
      setCurrentStep(2);
    }
  }, []);

  useEffect(() => {
    checkFinished();
  }, [checkFinished]);

  const current = STEPS[currentStep];

  //-----------------------------------------------------------------------------------------------
  // ! Render
  //-----------------------------------------------------------------------------------------------
  return (
    <div id="insight-intro-container">
      <Helmet>
        <title>{TAB_TITLE}</title>
      </Helmet>
      <StepContext.Provider value={CONTEXT_VALUE}>
        <Steps current={currentStep} onChange={setCurrentStep}>
          {STEPS.map((step) => (
            <Step key={step.title} title={step.title} disabled={step.disabled} />
          ))}
        </Steps>
        {current.component}
      </StepContext.Provider>
    </div>
  );
};

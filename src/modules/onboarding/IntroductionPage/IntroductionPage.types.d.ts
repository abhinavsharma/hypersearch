import { FunctionComponent } from 'react';

declare module './IntroductionPage' {
  type StepContext = {
    currentStep: number;
    setCurrentStep: React.Dispatch<SetStateAction<number>>;
    finished: boolean;
    license: string | undefined;
    setLicense: React.Dispatch<SetStateAction<string | undefined>>;
    setFinished: React.Dispatch<SetStateAction<boolean>>;
  };

  type IntroductionPage = FunctionComponent;
}

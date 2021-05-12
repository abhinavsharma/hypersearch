import { Dispatch, SetStateAction } from 'react';

declare type StoredLicense = Partial<Record<'key', string> & Record<'isActivated', boolean>>;

declare type IntroStepContext = {
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  license: StoredLicense;
  setLicense: Dispatch<SetStateAction<StoredLicense>>;
  finished: boolean;
  setFinished: Dispatch<SetStateAction<boolean>>;
};
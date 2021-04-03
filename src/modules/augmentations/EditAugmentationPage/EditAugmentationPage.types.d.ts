import { Dispatch, FunctionComponent, SetStateAction } from 'react';

declare module './EditAugmentationPage' {
  type CustomAugmentationObject<T = AugmentationObject> = T & {
    installed?: boolean;
  };

  type EditAugmentationPageProps = {
    augmentation: AugmentationObject;
    isAdding?: boolean;
    initiatedFromActives: boolean;
    setActiveKey: Dispatch<SetStateAction<string>>;
  };

  type CustomAction = ActionObject & {
    id: string;
  };

  type CustomCondition = ConditionObject & {
    id: string;
  };

  type EditAugmentationPage = FunctionComponent<EditAugmentationPageProps>;

  type Header = FunctionComponent<EditAugmentationPageProps>;
}

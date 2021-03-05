import { FunctionComponent } from 'react';

declare module './EditAugmentationPage' {
  type CustomAugmentationObject<T = AugmentationObject> = T & {
    installed?: boolean;
  };

  type EditAugmentationPageProps = {
    augmentation: CustomAugmentationObject;
    isAdding?: boolean;
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

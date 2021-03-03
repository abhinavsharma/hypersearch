import { FunctionComponent } from 'react';

declare module './EditAugmentationPage' {
  type CustomAugmentationObject<T = AugmentationObject> = T & {
    installed?: boolean;
  };

  type EditAugmentationPageProps = {
    augmentation: CustomAugmentationObject;
    isAdding?: boolean;
  };

  type CustomAction = AugmentationSingleActionObject & {
    id: string;
  };

  type CustomCondition = AugmentationSingleActionObject & {
    id: string;
  };

  type EditAugmentationPage = FunctionComponent<EditAugmentationPageProps>;

  type Header = FunctionComponent<EditAugmentationPageProps>;
}

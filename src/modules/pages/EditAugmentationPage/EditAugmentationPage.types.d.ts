import { FunctionComponent } from 'react';

declare module './EditAugmentationPage' {
  type CustomAugmentationObject<T = AugmentationObject> = T & {
    installed?: boolean;
  };

  type EditAugmentationPageProps = {
    augmentation: AugmentationObject;
    isAdding?: boolean;
  };

  type CustomAction = ActionObject & {
    id: string;
  };

  type CustomCondition = ConditionObject & {
    id: string;
  };

  type SectionHeaderProps = {
    title: string;
    tourTitle: string;
    tourText: string;
  };

  type SectionHeader = FunctionComponent<SectionHeaderProps>;

  type EditAugmentationPage = FunctionComponent<EditAugmentationPageProps>;

  type Header = FunctionComponent<EditAugmentationPageProps>;
}

import { FunctionComponent } from 'react';

declare module './BuilderPage' {
  type CustomAugmentationObject<T = AugmentationObject> = T & {
    installed?: boolean;
  };

  type BuilderPageProps = {
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

  type BuilderPage = FunctionComponent<BuilderPageProps>;

  type Header = FunctionComponent<BuilderPageProps>;
}

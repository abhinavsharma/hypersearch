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

<<<<<<< HEAD:src/modules/pages/EditAugmentationPage/EditAugmentationPage.types.d.ts
  type SectionHeaderProps = {
    title: string;
    tourTitle: string;
    tourText: string;
  };

  type SectionHeader = FunctionComponent<SectionHeaderProps>;

  type EditAugmentationPage = FunctionComponent<EditAugmentationPageProps>;
=======
  type BuilderPage = FunctionComponent<BuilderPageProps>;
>>>>>>> chore: rename builder and page copmponents:src/modules/pages/BuilderPage/BuilderPage.types.d.ts

  type Header = FunctionComponent<BuilderPageProps>;
}

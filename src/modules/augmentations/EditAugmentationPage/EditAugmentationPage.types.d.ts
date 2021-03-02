import { FunctionComponent } from 'react';

declare module './EditAugmentationPage' {
  type EditAugmentationPageProps = {
    augmentation: SuggestedAugmentationObject;
    enabled: boolean;
  };

  type EditAugmentationPage = FunctionComponent<EditAugmentationPageProps>;

  type HeaderProps = {
    augmentation: SuggestedAugmentationObject;
  };

  type Header = FunctionComponent<HeaderProps>;
}

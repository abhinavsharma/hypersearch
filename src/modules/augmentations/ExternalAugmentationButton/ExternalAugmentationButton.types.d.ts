import { FunctionComponent } from 'react';

declare module './ExternalAugmentationButton' {
  type ExternalAddAugmentationButtonProps = {
    className?: string;
  };

  type ExternalAddAugmentationButton = FunctionComponent<ExternalAddAugmentationButtonProps>;
}

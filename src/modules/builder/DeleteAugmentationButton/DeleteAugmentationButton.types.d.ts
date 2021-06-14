import { FunctionComponent } from 'react';

declare module './DeleteAugmentationButton' {
  type DeleteAugmentationButtonProps = {
    augmentation: Augmentation;
    disabled: boolean;
  };

  type DeleteAugmentationButton = FunctionComponent<DeleteAugmentationButtonProps>;
}

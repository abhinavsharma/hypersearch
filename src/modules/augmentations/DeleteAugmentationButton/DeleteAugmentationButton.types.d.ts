import { FunctionComponent } from 'react';

declare module './DeleteAugmentationButton' {
  type DeleteAugmentationButtonProps = {
    augmentation: AugmentationObject;
    disabled: boolean;
  };

  type DeleteAugmentationButton = FunctionComponent<DeleteAugmentationButtonProps>;
}

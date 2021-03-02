import { FunctionComponent } from 'react';

declare module './DeleteAugmentationButton' {
  type DeleteAugmentationButtonProps = {
    augmentation: SuggestedAugmentationObject;
  };

  type DeleteAugmentationButton = FunctionComponent<DeleteAugmentationButtonProps>;
}

import { FunctionComponent } from 'react';

declare module './ShareAugmentationButton' {
  type ShareAugmentationButtonProps = {
    augmentation: AugmentationObject;
    disabled: boolean;
  };

  type ShareAugmentationButton = FunctionComponent<ShareAugmentationButtonProps>;
}

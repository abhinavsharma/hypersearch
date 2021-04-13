import { FunctionComponent } from 'react';

declare module './ShareButton' {
  type ShareButtonProps = {
    augmentation: AugmentationObject;
    icon?: boolean;
    disabled?: boolean;
  };

  type ShareButton = FunctionComponent<ShareButtonProps>;
}

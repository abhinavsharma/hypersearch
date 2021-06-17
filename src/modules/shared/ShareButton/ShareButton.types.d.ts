import { FunctionComponent } from 'react';

declare module './ShareButton' {
  type ShareButtonProps = {
    augmentation: Augmentation;
    icon?: boolean;
    disabled?: boolean;
  };

  type ShareButton = FunctionComponent<ShareButtonProps>;
}

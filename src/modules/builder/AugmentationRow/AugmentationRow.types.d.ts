import { FunctionComponent } from 'react';

declare module './AugmentationRow' {
  type AugmentationRowProps = {
    augmentation: Augmentation;
    ignored?: boolean;
    other?: boolean;
    pinned?: boolean;
  };

  type AugmentationRow = FunctionComponent<AugmentationRowProps>;
}

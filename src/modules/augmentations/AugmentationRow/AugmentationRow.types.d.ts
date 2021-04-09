import { Dispatch, FunctionComponent, SetStateAction } from 'react';

declare module './AugmentationRow' {
  type AugmentationRowProps = {
    augmentation: AugmentationObject;
    setActiveKey: Dispatch<SetStateAction<string>>;
    ignored?: boolean;
    other?: boolean;
    pinned?: boolean;
  };

  type AugmentationRow = FunctionComponent<AugmentationRowProps>;
}

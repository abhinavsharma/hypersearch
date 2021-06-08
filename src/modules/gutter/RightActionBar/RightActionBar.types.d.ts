import { FunctionComponent } from 'react';

declare module './RightActionBar' {
  type RightActionBarProps = {
    url: string;
    container: string;
    searchingAugmentations: AugmentationObject[];
    blockingAugmentations: AugmentationObject[];
    featuringAugmentations: AugmentationObject[];
  };

  type RightActionBar = FunctionComponent<RightActionBarProps>;
}

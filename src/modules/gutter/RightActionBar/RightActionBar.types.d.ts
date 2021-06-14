import { FunctionComponent } from 'react';

declare module './RightActionBar' {
  type RightActionBarProps = {
    url: string;
    container: string;
    searchingAugmentations: Augmentation[];
    blockingAugmentations: Augmentation[];
    featuringAugmentations: Augmentation[];
  };

  type RightActionBar = FunctionComponent<RightActionBarProps>;
}

import { FunctionComponent } from 'react';

declare module './LeftActionBar' {
  type LeftActionBarProps = {
    publication: string;
    container: string;
    searchingAugmentations: Augmentation[];
    blockingAugmentations: Augmentation[];
    featuringAugmentations: Augmentation[];
  };

  type LeftActionBar = FunctionComponent<LeftActionBarProps>;
}

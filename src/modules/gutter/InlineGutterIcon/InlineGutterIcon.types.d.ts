import { FunctionComponent } from 'react';

declare module './InlineGutterIcon' {
  type InlineGutterIconProps = {
    domain: string;
    container: string;
    searchingAugmentations: AugmentationObject[];
    blockingAugmentations: AugmentationObject[];
  };

  type InlineGutterIcon = FunctionComponent<InlineGutterIconProps>;
}

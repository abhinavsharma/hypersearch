import { FunctionComponent } from 'react';

declare module './InlineGutterIcon' {
  type InlineGutterIconProps = {
    publication: string;
    url: string;
    container: string;
    searchingAugmentations: AugmentationObject[];
    blockingAugmentations: AugmentationObject[];
  };

  type InlineGutterIcon = FunctionComponent<InlineGutterIconProps>;
}

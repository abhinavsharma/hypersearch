import { FunctionComponent } from 'react';

declare module './InlineGutterIcon' {
  type InlineGutterIconProps = {
    augmentations: AugmentationObject[];
    domain: string;
    isSearched?: boolean;
  };

  type InlineGutterIcon = FunctionComponent<InlineGutterIconProps>;
}

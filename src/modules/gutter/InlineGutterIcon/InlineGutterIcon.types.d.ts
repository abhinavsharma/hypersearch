import { FunctionComponent } from 'react';

declare module './InlineGutterIcon' {
  type InlineGutterIconProps = {
    augmentations: AugmentationObject[];
    domain: string;
  };

  type InlineGutterIcon = FunctionComponent<InlineGutterIconProps>;
}

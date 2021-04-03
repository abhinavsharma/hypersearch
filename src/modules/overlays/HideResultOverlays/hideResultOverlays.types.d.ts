import { FunctionComponent } from 'react';

declare module './HideResultOverlays' {
  type HideResultOverlaysProps = {
    augmentations: AugmentationObject[];
  };

  type HideResultOverlays = FunctionComponent<HideResultOverlaysProps>;
}

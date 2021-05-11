import { FunctionComponent } from 'react';

declare module './GutterPage' {
  type Section = {
    type: 'block' | 'search' | 'local';
    augmentations: Array<AugmentationObject & { actionIndex?: number }>;
    title: string;
    subtitle: string;
  };

  type GutterPageProps = {
    hidingAugmentations: AugmentationObject[];
    domain: string;
    inline?: boolean;
  };

  type GutterPage = FunctionComponent<GutterPageProps>;
}

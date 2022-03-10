import { FunctionComponent } from 'react';

declare module './GutterPage' {
  type Section = {
    type: 'block' | 'search' | 'local';
    augmentations: Array<Augmentation & { actionIndex?: number }>;
    title: string;
    subtitle: string;
  };

  type GutterPageProps = {
    hidingAugmentations: Augmentation[];
    domain: string;
    inline?: boolean;
  };

  type GutterPage = FunctionComponent<GutterPageProps>;
}

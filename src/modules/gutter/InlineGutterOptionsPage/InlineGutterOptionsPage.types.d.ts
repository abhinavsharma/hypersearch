import { FunctionComponent } from 'react';

declare module './InlineGutterOptionsPage' {
  type Section = {
    type: 'block' | 'search' | 'local';
    augmentations: Array<AugmentationObject & { actionIndex?: number }>;
    title: string;
    subtitle: string;
  };

  type InlineGutterOptionsPageProps = {
    hidingAugmentations: AugmentationObject[];
    domain: string;
  };

  type InlineGutterOptionsPage = FunctionComponent<InlineGutterOptionsPageProps>;
}

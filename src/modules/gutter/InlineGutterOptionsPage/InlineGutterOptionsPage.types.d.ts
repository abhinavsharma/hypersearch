import { FunctionComponent } from 'react';

declare module './InlineGutterOptionsPage' {
  type InlineGutterOptionsPageProps = {
    hidingAugmentations: AugmentationObject[];
    domain: string;
  };

  type InlineGutterOptionsPage = FunctionComponent<InlineGutterOptionsPageProps>;
}

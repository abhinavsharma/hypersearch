import { FunctionComponent } from 'react';

declare module './AllAugmentationsPage' {
  type AllAugmentationsPageProps = {
    suggested: AugmentationObject[];
  };

  type AllAugmentationsPage = FunctionComponent<AllAugmentationsPageProps>;
}

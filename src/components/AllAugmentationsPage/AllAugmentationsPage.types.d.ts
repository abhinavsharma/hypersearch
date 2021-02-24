import { FunctionComponent } from 'react';

declare module './AllAugmentationsPage' {
  type AllAugmentationsPageProps = {
    suggested: SuggestedAugmentationObject[];
  };

  type AllAugmentationsPage = FunctionComponent<AllAugmentationsPageProps>;
}

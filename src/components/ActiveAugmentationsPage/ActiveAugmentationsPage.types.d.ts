import { FunctionComponent } from 'react';

declare module './ActiveAugmentationsPage' {
  type AllAugmentationPage = FunctionComponent;

  type AugmentationContext = {
    url: string;
    installed: SuggestedAugmentationObject[];
    suggested: SuggestedAugmentationObject[];
  };
}

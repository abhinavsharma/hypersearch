import { FunctionComponent } from 'react';

declare module './PublicationTimeTracker' {
  type PublicationTimeTrackerProps = {
    domain: string;
  };

  type PublicationTimeTracker = FunctionComponent<PublicationTimeTrackerProps>;
}

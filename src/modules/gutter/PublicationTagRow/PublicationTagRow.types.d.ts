import { FunctionComponent } from 'react';

declare module './PublicationTagRow' {
  type PublicationTagRowProps = {
    publication: string;
    container: string;
  };

  type PublicationTagRow = FunctionComponent<PublicationTagRowProps>;
}

import { FunctionComponent } from 'react';

declare module './PublicationPage' {
  type PublicationPageProps = {
    rating: number;
    info: PublicationInfo;
  };

  type PublicationPage = FunctionComponent<PublicationPageProps>;
}

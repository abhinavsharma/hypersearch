import { FunctionComponent } from 'react';

declare module './PublicationUserReviewPage' {
  type PublicationUserReviewPageProps = {
    rating: number;
    info: PublicationInfo;
  };

  type PublicationUserReviewPage = FunctionComponent<PublicationUserReviewPageProps>;
}

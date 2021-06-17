import { FunctionComponent } from 'react';

declare module './SidebarNubPublicationRating' {
  type SidebarNubPublicationRatingProps = {
    rating: number;
    info: PublicationInfo;
  };

  type SidebarNubPublicationRating = FunctionComponent<SidebarNubPublicationRatingProps>;
}

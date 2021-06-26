import { FunctionComponent } from 'react';

declare module './SidebarToggleButton' {
  type SidebarToggleButtonProps = {
    tabs: SidebarTab[];
    rating: number;
    info: PublicationInfo;
  };

  type SidebarToggleButton = FunctionComponent<SidebarToggleButtonProps>;
}

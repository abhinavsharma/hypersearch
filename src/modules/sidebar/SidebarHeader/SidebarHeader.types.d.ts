import { FunctionComponent } from 'react';

declare module './SidebarHeader' {
  type SidebarTabDomainsSidebarHeaderProps = {
    tabs: SidebarTab[];
  };

  type SidebarHeader = FunctionComponent<SidebarTabDomainsSidebarHeaderProps>;
}

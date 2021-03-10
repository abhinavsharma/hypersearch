import { FunctionComponent } from 'react';

declare module './SidebarTabContainer' {
  type SidebarTabDomainsSidebarTabContainerProps = {
    tab: SidebarTab;
  };

  type SidebarTabContainer = FunctionComponent<SidebarTabDomainsSidebarTabContainerProps>;
}

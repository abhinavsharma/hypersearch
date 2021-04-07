import { FunctionComponent } from 'react';

declare module './SidebarTabContainer' {
  type SidebarTabDomainsSidebarTabContainerProps = {
    tab: SidebarTab;
    currentTab: string;
  };

  type SidebarTabContainer = FunctionComponent<SidebarTabDomainsSidebarTabContainerProps>;
}

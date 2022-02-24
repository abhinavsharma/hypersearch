import { FunctionComponent } from 'react';

declare module './SidebarTabContainer' {
  type SidebarTabDomainsSidebarTabContainerProps = {
    tab: SidebarTab;
    isSelected: boolean;
  };

  type SidebarTabContainer = FunctionComponent<SidebarTabDomainsSidebarTabContainerProps>;
}

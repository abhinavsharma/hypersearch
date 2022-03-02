import { FunctionComponent } from 'react';

declare module './SidebarTabContainer' {
  type SidebarTabDomainsSidebarTabContainerProps = {
    tab: SidebarTab;
    isSelected: boolean;
    index: string;
  };

  type SidebarTabContainer = FunctionComponent<SidebarTabDomainsSidebarTabContainerProps>;
}

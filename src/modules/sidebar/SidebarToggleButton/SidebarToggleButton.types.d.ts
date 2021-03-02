import { FunctionComponent } from 'react';

declare module './SidebarToggleButton' {
  type SidebarToggleButtonProps = {
    tabs: SidebarTab[];
  };

  type SidebarToggleButton = FunctionComponent<SidebarToggleButtonProps>;
}

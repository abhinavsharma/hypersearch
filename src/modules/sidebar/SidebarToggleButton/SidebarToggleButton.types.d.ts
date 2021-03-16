import { Dispatch, FunctionComponent, SetStateAction } from 'react';

declare module './SidebarToggleButton' {
  type SidebarToggleButtonProps = {
    tabs: SidebarTab[];
    setTab: Dispatch<SetStateAction<string>>;
  };

  type SidebarToggleButton = FunctionComponent<SidebarToggleButtonProps>;
}

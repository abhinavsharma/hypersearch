import { FunctionComponent, Dispatch, SetStateAction } from 'react';

declare module './Sidebar' {
  type SidebarProps = {
    tabs: SidebarTab[];
  };

  type Sidebar = FunctionComponent<SidebarProps>;

  type CloseIconProps = import('antd/lib/button').ButtonProps & {
    setForceTab: Dispatch<SetStateAction<string | null>>;
    numTabs: number;
  };

  type CloseIcon = FunctionComponent<CloseIconProps>;
}

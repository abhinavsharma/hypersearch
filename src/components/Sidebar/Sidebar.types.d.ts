import { FunctionComponent, Dispatch } from 'react';

declare module './Sidebar' {
  type SidebarProps = {
    tabs: SidebarTab[];
  };

  type Sidebar = FunctionComponent<SidebarProps>;

  type XIconProps = import('antd/lib/button').ButtonProps;

  type XIcon = FunctionComponent<XIconProps>;
}

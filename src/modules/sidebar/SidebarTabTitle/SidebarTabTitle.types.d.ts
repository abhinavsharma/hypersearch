import { Dispatch, FunctionComponent, SetStateAction } from 'react';

declare module './SidebarTabTitle' {
  type SidebarTabTitleProps = {
    tab: SidebarTab;
    index: number;
    activeKey: string;
    setActiveKey: Dispatch<SetStateAction<string>>;
  };

  type SidebarTabTitle = FunctionComponent<SidebarTabTitleProps>;
}

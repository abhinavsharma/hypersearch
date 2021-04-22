import { FunctionComponent, ReactElement, MouseEvent, Dispatch, SetStateAction } from 'react';

declare module './SidebarTabs' {
  type SidebarTabsProps = {
    tabs: SidebarTab[];
    activeKey: string | null;
    setActiveKey: Dispatch<SetStateAction<string>>;
  };

  type TabTitleProps = {
    tab: SidebarTab;
    active?: boolean;
    length: number;
    hide: boolean;
    onClick?: (e: MouseEvent<HTMLDivElement, any>) => void;
  };

  type SidebarTabs = FunctionComponent<SidebarTabsProps>;

  type TabTitle = FunctionComponent<TabTitleProps>;

  type _TabsProps = import('antd/lib/tabs').TabsProps;

  type TabBar = (
    props: _TabsProps,
    DefaultTabBar: (props: _TabsProps) => ReactElement,
  ) => ReactElement;
}

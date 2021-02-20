import { FunctionComponent, JSXElement } from 'react';

declare module './SidebarTabs' {
  type SidebarTabsProps = {
    tabs: SidebarTab[];
  };

  type TabTitleProps = {
    title: string;
    active?: boolean;
  };

  type SidebarTabs = FunctionComponent<SidebarTabsProps>;

  type TabTitle = FunctionComponent<TabTitleProps>;

  type _TabsProps = import('antd/lib/tabs').TabsProps;

  type TabBar = (props: _TabsProps, DefaultTabBar: (props: _TabsProps) => JSXElement) => JSXElement;
}

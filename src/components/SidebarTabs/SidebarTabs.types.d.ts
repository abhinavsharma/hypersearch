import { FunctionComponent, ReactElement, MouseEvent } from 'react';

declare module './SidebarTabs' {
  type SidebarTabsProps = {
    tabs: SidebarTab[];
    forceTab: string | null;
  };

  type TabTitleProps = {
    title: string;
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

  type ExternalAddAugmentationButtonProps = {
    className?: string;
  };

  type ExternalAddAugmentationButton = FunctionComponent<ExternalAddAugmentationButtonProps>;
}

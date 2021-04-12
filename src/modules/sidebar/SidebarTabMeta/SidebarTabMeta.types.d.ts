import { FunctionComponent } from 'react';

declare module './SidebarTabMeta' {
  type SidebarTabMetaProps = {
    tab?: SidebarTab;
    domains?: string[];
  };

  type SidebarTabMeta = FunctionComponent<SidebarTabMetaProps>;
}

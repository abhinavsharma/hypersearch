import { FunctionComponent } from 'react';

declare module './SidebarTabMeta' {
  type SidebarTabMetaProps = {
    tab?: SidebarTab;
  };

  type SidebarTabMeta = FunctionComponent<SidebarTabMetaProps>;
}

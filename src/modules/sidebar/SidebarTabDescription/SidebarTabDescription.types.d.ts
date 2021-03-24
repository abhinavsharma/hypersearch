import { FunctionComponent } from 'react';

declare module './SidebarTabDescription' {
  type SidebarTabDescriptionProps = {
    tab: SidebarTab;
  };

  type SidebarTabDescription = FunctionComponent<SidebarTabDescriptionProps>;
}

import { FunctionComponent } from 'react';

declare module './SidebarTabReadable' {
  type SidebarTabReadableProps = {
    readable: string;
  };

  type SidebarTabReadable = FunctionComponent<SidebarTabReadableProps>;
}

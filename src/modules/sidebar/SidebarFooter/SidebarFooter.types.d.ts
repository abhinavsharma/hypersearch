import { FunctionComponent } from 'react';

declare module './SidebarFooter' {
  type SidebarFooterProps = any;

  type SidebarFooter = FunctionComponent<SidebarFooterProps>;
}

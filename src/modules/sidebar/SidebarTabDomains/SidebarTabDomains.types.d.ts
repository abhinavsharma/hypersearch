import { FunctionComponent } from 'react';

declare module './SidebarTabDomains' {
  type SidebarTabDomainsProps = {
    tab: SidebarTab;
  };

  type SidebarTabDomains = FunctionComponent<SidebarTabDomainsProps>;
}

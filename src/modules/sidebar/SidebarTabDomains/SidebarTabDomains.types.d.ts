import { FunctionComponent } from 'react';

declare module './SidebarTabDomains' {
  type SidebarTabDomainsProps = {
    tab?: SidebarTab;
    domains?: string[];
  };

  type SidebarTabDomains = FunctionComponent<SidebarTabDomainsProps>;
}

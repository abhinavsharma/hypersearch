import React, { useEffect, useState } from 'react';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import './SidebarTabDomains.scss';

export const SidebarTabDomains: SidebarTabDomains = ({ tab }) => {
  const [domains, setDomains] = useState<string[]>();

  useEffect(() => {
    setDomains(SidebarLoader.tabDomains[tab.id]);
  }, [SidebarLoader.tabDomains[tab.id]]);

  return (
    <div className="sidebar-tab-domains">
      <span className="domain-list-prefix">Trusted sources include&nbsp;</span>
      {domains?.map((domain, i, a) => (
        <a href={domain} className="sidebar-tab-domain-text" key={domain}>
          {`${!a[i + 1] ? domain : domain + ','}`}&nbsp;
        </a>
      ))}
    </div>
  );
};

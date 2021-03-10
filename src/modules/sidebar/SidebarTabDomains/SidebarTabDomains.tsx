import React, { useContext, useEffect, useState } from 'react';
import { SidebarTabDomainsContext } from 'modules/sidebar';
import { extractHostnameFromUrl } from 'utils/helpers';
import './SidebarTabDomains.scss';

export const SidebarTabDomains: SidebarTabDomains = ({ tab }) => {
  const [domains, setDomains] = useState<string[]>();
  const context = useContext(SidebarTabDomainsContext);
  useEffect(() => {
    setDomains(
      Array.from(new Set(context?.[tab.id]?.map((i) => extractHostnameFromUrl(i).hostname))),
    );
  }, [context?.[tab.id]]);

  return (
    <div className="sidebar-tab-domains">
      <span className="domain-list-prefix">Domains:&nbsp;</span>
      {domains?.map((domain, i, a) => (
        <span key={domain}>{`${!a[i + 1] ? domain : domain + ','}`}&nbsp;</span>
      ))}
    </div>
  );
};

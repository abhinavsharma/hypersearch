import React, { useContext, useEffect, useState } from 'react';
import { SidebarTabDomainsContext } from 'modules/sidebar';
import { extractHostnameFromUrl } from 'utils/helpers';
import './SidebarTabDomains.scss';

export const SidebarTabDomains: SidebarTabDomains = ({ tab }) => {
  const [domains, setDomains] = useState<string[]>();
  const context = useContext(SidebarTabDomainsContext);
  useEffect(() => {
    setDomains(
      Array.from(
        new Set(context?.[tab.id]?.map((i) => extractHostnameFromUrl(i)?.hostname)),
      ).filter((i) => i !== undefined) as string[],
    );
  }, [context?.[tab.id]]);

  return (
    <div className="sidebar-tab-domains">
      <span className="domain-list-prefix">Trusted sources include&nbsp;</span>
      {domains?.map((domain, i, a) => (
        <a href={domain} className="sidebar-tab-domain-text"key={domain}>{`${!a[i + 1] ? domain : domain + ','}`}&nbsp;</a>
      ))}
    </div>
    
  );
};

import React, { useState } from 'react';
import Typography from 'antd/lib/typography';
import Button from 'antd/lib/button';
import 'antd/lib/typography/style/index.css';
import 'antd/lib/button/style/index.css';
import './SidebarTabDomains.scss';
import { SEARCH_DOMAINS_ACTION } from 'utils';

const { Paragraph } = Typography;

export const SidebarTabDomains: SidebarTabDomains = ({ domains, tab }) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  const ellipsis = {
    rows: 1,
  };

  const handleToggle = () => setExpanded((prev) => !prev);

  const showDomains =
    Array.from(new Set(tab.augmentation.actions.action_list.map(({ key }) => key))).indexOf(
      SEARCH_DOMAINS_ACTION,
    ) > -1;

  return showDomains ? (
    <div className="sidebar-tab-domains">
      <Paragraph ellipsis={!expanded && ellipsis} className={expanded ? 'contents-inline' : ''}>
        <span className="domain-list-prefix">Lens&nbsp;sources&nbsp;include&nbsp;</span>
        {domains?.map((domain, index, originalDomainsArray) => (
          <a
            href={`https://${domain}`}
            className="sidebar-tab-domain-text"
            key={domain}
            target="_blank"
          >
            {`${!originalDomainsArray[index + 1] ? domain : domain + ',\u00a0'}`}
          </a>
        ))}
      </Paragraph>
      <Button type="link" onClick={handleToggle}>
        {expanded ? 'Hide' : 'Show All'}
      </Button>
    </div>
  ) : null;
};

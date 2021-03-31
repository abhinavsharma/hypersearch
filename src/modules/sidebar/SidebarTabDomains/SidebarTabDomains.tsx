import React, { useState } from 'react';
import Typography from 'antd/lib/typography';
import Button from 'antd/lib/button';
import 'antd/lib/typography/style/index.css';
import 'antd/lib/button/style/index.css';
import './SidebarTabDomains.scss';

const { Paragraph } = Typography;

export const SidebarTabDomains: SidebarTabDomains = ({ domains }) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  const ellipsis = {
    rows: 1,
  };

  const handleToggle = () => setExpanded((prev) => !prev);

  return !!domains.length ? (
    <div className="sidebar-tab-domains">
      <Paragraph ellipsis={!expanded && ellipsis} className={expanded ? 'contents-inline' : ''}>
        <span className="domain-list-prefix">Lens&nbsp;sources&nbsp;include&nbsp;</span>
        {domains.map((domain, index, originalDomainsArray) => (
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

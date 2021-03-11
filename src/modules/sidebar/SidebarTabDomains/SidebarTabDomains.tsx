import React, { useState } from 'react';
import Typography from 'antd/lib/typography';
import Button from 'antd/lib/button';
import 'antd/lib/typography/style/index.css';
import 'antd/lib/button/style/index.css';
import './SidebarTabDomains.scss';

const { Paragraph } = Typography;

export const SidebarTabDomains: SidebarTabDomains = ({ domains }) => {
  const [hide, setHide] = useState<boolean>(false);

  const ellipsis = {
    rows: 1,
  };

  const handleHide = () => setHide((prev) => !prev);

  return (
    <div className="sidebar-tab-domains">
      <Paragraph ellipsis={!hide && ellipsis}>
        <span className="domain-list-prefix">Trusted&nbsp;sources&nbsp;include&nbsp;</span>
        {domains.map((domain, i, a) => (
          <a
            href={`https://${domain}`}
            className="sidebar-tab-domain-text"
            key={domain}
            target="_blank"
          >
            {`${!a[i + 1] ? domain : domain + ','}`}{' '}
          </a>
        ))}
      </Paragraph>
      {!hide && (
        <Button type="link" onClick={handleHide}>
          Show All
        </Button>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import Typography from 'antd/lib/typography';
import Button from 'antd/lib/button';
import 'antd/lib/typography/style/index.css';
import 'antd/lib/button/style/index.css';
import './SidebarTabDomains.scss';

const { Paragraph } = Typography;

export const SidebarTabDomains: SidebarTabDomains = ({ domains, tab }) => {
  const [hideShowAllButton, setHideShowAllButton] = useState<boolean>(false);

  const ellipsis = {
    rows: 1,
  };

  const handleHide = () => setHideShowAllButton((prev) => !prev);

  return (
    <div className="sidebar-tab-domains">
      {tab.url.href.search(`${tab.title}`) === -1 ? (
        <>
          <Paragraph ellipsis={!hideShowAllButton && ellipsis}>
            <span className="domain-list-prefix">Filter&nbsp;sources&nbsp;include&nbsp;</span>
            {domains.map((domain, index, originalDomainsArray) => (
              <a
                href={`https://${domain}`}
                className="sidebar-tab-domain-text"
                key={domain}
                target="_blank"
              >
                {`${!originalDomainsArray[index + 1] ? domain : domain + ','}`}{' '}
              </a>
            ))}
          </Paragraph>
          {!hideShowAllButton && (
            <Button type="link" onClick={handleHide}>
              Show All
            </Button>
          )}
        </>
      ) : (
        <span>Searching on: {tab.title}</span>
      )}
    </div>
  );
};

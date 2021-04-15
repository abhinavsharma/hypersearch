import React, { useEffect, useState } from 'react';
import Typography from 'antd/lib/typography';
import Button from 'antd/lib/button';
import { SEARCH_DOMAINS_ACTION } from 'utils';
import 'antd/lib/typography/style/index.css';
import 'antd/lib/button/style/index.css';
import './SidebarTabMeta.scss';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';

const { Paragraph } = Typography;

export const SidebarTabMeta: SidebarTabMeta = ({ tab }) => {
  const [currentStat, setCurrentStat] = useState<number>(SidebarLoader.augmentationStats[tab.id]);
  const [domains, setDomains] = useState<string[]>(SidebarLoader.tabDomains[tab.id][tab.url]);
  const [expanded, setExpanded] = useState<boolean>(false);

  const handleToggle = () => setExpanded((prev) => !prev);

  const showDomains =
    Array.from(new Set(tab.augmentation.actions.action_list.map(({ key }) => key))).indexOf(
      SEARCH_DOMAINS_ACTION,
    ) > -1;

  const ellipsis = {
    rows: 1,
  };

  useEffect(() => {
    setCurrentStat(SidebarLoader.augmentationStats[tab.id]);
    setDomains(SidebarLoader.tabDomains[tab.id][tab.url]);
  }, [SidebarLoader.augmentationStats[tab.id], SidebarLoader.tabDomains[tab.id][tab.url]]);

  return (
    <div id="sidebar-tab-meta">
      <Paragraph
        ellipsis={!expanded && ellipsis}
        className={`meta-text ${expanded ? 'expanded' : 'collapsed'}`}
      >
        {<span className="space-right">{currentStat ?? 0} Uses.</span>}
        {tab.description && <span className="space-right">{tab.description}</span>}
        {tab.url && tab.isCse && showDomains && (
          <>
            <span className="space-right">Lens&nbsp;sources&nbsp;include</span>
            {Array.from(new Set(domains))?.map((domain, index, originalDomainsArray) => (
              <a href={`https://${domain}`} className="meta-link" key={domain} target="_blank">
                {`${!originalDomainsArray[index + 1] ? domain : `${domain},\u00a0`}`}
              </a>
            ))}
          </>
        )}
      </Paragraph>
      <Button id="meta-toggle-button" type="link" onClick={handleToggle}>
        {expanded ? 'Hide' : 'Show'}
      </Button>
    </div>
  );
};

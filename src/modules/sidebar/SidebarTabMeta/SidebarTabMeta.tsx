import React, { useEffect, useState } from 'react';
import { Info } from 'react-feather';
import Typography from 'antd/lib/typography';
import Button from 'antd/lib/button';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import { DomainStateCheckbox } from 'modules/gutter';
import { DOMAINS_TO_RELEVANT_SLICE, extractUrlProperties, SEARCH_DOMAINS_ACTION } from 'utils';
import 'antd/lib/typography/style/index.css';
import 'antd/lib/button/style/index.css';
import './SidebarTabMeta.scss';

const { Paragraph, Text } = Typography;

export const SidebarTabMeta: SidebarTabMeta = ({ tab }) => {
  const [currentStat, setCurrentStat] = useState<number>(
    SidebarLoader.augmentationStats[tab.id] ?? 0,
  );
  const [domains, setDomains] = useState<string[]>(SidebarLoader.tabDomains[tab.id][tab.url] ?? []);
  const [expanded, setExpanded] = useState<boolean>(false);

  const handleToggle = () => setExpanded((prev) => !prev);

  const showDomains =
    Array.from(new Set(tab.augmentation?.actions.action_list.map(({ key }) => key))).indexOf(
      SEARCH_DOMAINS_ACTION,
    ) > -1;

  const ellipsis = {
    rows: 2,
    symbol: 'more',
  };

  const handleOpenPage = () => {
    window.open(tab.url.href, '_blank');
  };

  useEffect(() => {
    setCurrentStat(SidebarLoader.augmentationStats[tab.id] ?? 0);
    setDomains(SidebarLoader.tabDomains[tab.id][tab.url]);
  }, [SidebarLoader.augmentationStats[tab.id], SidebarLoader.tabDomains[tab.id][tab.url]]);

  const titleFromDomain = tab.url.searchParams.get('insight-tab-title');

  const urlProps = extractUrlProperties(tab.url.href);
  const publication = DOMAINS_TO_RELEVANT_SLICE[urlProps.hostname]
    ? urlProps.full.match(DOMAINS_TO_RELEVANT_SLICE[urlProps.hostname])?.[0] ?? urlProps.hostname
    : urlProps.hostname;

  const showMeta = currentStat > 0 || !!tab.description.length || !!domains?.length;

  return showMeta || titleFromDomain ? (
    <div id="tab-meta-container">
      <div id="meta-info-icon-container">
        <Info stroke={'#999'} />
      </div>
      <div id="sidebar-tab-meta">
        {titleFromDomain && (
          <div id="domain-title-container">
            <Button type="link" onClick={handleOpenPage}>
              Open in new tab
            </Button>
            <Text strong>{publication.split('/')[1] ?? ''}</Text>
            <DomainStateCheckbox domain={titleFromDomain} />
          </div>
        )}
        {showMeta && (
          <>
            <Paragraph
              ellipsis={!expanded && ellipsis}
              className={`meta-text ${expanded ? 'expanded' : 'collapsed'}`}
            >
              {currentStat > 0 && <span className="space-right">{currentStat} Uses.</span>}
              {tab.description && <span className="space-right">{tab.description}</span>}
              {tab.url && tab.isCse && showDomains && (
                <>
                  <span className="space-right">Lens&nbsp;sources&nbsp;include</span>
                  {Array.from(new Set(domains))?.map((domain, index, originalDomainsArray) => (
                    <a
                      href={`https://${domain}`}
                      className="meta-link"
                      key={domain}
                      target="_blank"
                    >
                      {`${!originalDomainsArray[index + 1] ? domain : `${domain},\u00a0`}`}
                    </a>
                  ))}
                </>
              )}
            </Paragraph>
            <Button id="meta-toggle-button" type="link" onClick={handleToggle}>
              {expanded ? 'Hide' : 'Show'}
            </Button>
          </>
        )}
      </div>
    </div>
  ) : null;
};

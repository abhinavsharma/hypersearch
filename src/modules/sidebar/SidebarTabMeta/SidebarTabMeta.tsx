import React, { useEffect, useState } from 'react';
import { Info } from 'react-feather';
import Typography from 'antd/lib/typography';
import Tooltip from 'antd/lib/tooltip';
import Button from 'antd/lib/button';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import { DomainStateCheckbox } from 'modules/gutter';
import { extractPublication, SEARCH_DOMAINS_ACTION } from 'utils';
import 'antd/lib/typography/style/index.css';
import 'antd/lib/button/style/index.css';
import './SidebarTabMeta.scss';
import 'antd/lib/tooltip/style/index.css';


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

  const showMeta = currentStat > 0 || !!tab.description.length || !!domains?.length;

  return showMeta || titleFromDomain ? (
    <div id="tab-meta-container">
      <div id="meta-info-icon-container">
      <Tooltip
        title={titleFromDomain ? `Some pages may not load properly in the sidebar`: `About this lens`}
        destroyTooltipOnHide={{ keepParent: false }}
        placement="right"
      >
        <Info stroke={'#999'} />
      </Tooltip>
        
      </div>
      <div id="sidebar-tab-meta">
        {titleFromDomain ? (
          <div id="domain-title-container">
            <div className="subtab-open-new-tab">
              <div>Beta feature</div>
              <Button type="link" onClick={handleOpenPage}>
                Open in new tab
              </Button>
            </div>
            
            <div id="publication-meta">
              <Text strong>{extractPublication(tab.url.href)}</Text>
              <DomainStateCheckbox domain={titleFromDomain} />
            </div>
          </div>
        ) : (
          showMeta && (
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
          )
        )}
      </div>
    </div>
  ) : null;
};

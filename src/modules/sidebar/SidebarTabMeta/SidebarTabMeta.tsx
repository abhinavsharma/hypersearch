import React, { useEffect, useState } from 'react';
import { Info } from 'react-feather';
import Typography from 'antd/lib/typography';
import Tooltip from 'antd/lib/tooltip';
import Button from 'antd/lib/button';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import { DomainStateCheckbox } from 'modules/gutter';
import { ACTION_KEY, extractPublication } from 'utils';
import 'antd/lib/typography/style/index.css';
import 'antd/lib/button/style/index.css';
import './SidebarTabMeta.scss';
import 'antd/lib/tooltip/style/index.css';

/** MAGICS **/
const SHOW_ELLIPSIS_BUTTON_TEXT = 'More';
const HIDE_ELLIPSIS_BUTTON_TEXT = 'Hide';
const SEARCH_TAB_INFO_TOOLTIP_TEXT = 'About this lens';
const OPEN_PAGE_INFO_TOOLTIP_TEXT = 'Some pages may not load properly in the sidebar';
const ICON_COLOR = '#999999';

const { Paragraph, Text } = Typography;

export const SidebarTabMeta: SidebarTabMeta = ({ tab }) => {
  const [currentStat, setCurrentStat] = useState<number>(
    SidebarLoader.augmentationStats[tab.augmentation.id] ?? 0,
  );
  const [domains, setDomains] = useState<string[]>(
    SidebarLoader.publicationSlices[tab.augmentation.id][tab.url.href] ?? [],
  );
  const [expanded, setExpanded] = useState<boolean>(false);

  const handleToggle = () => setExpanded((prev) => !prev);

  const showDomains =
    Array.from(new Set(tab.augmentation?.actions.action_list.map(({ key }) => key))).indexOf(
      ACTION_KEY.SEARCH_DOMAINS,
    ) > -1;

  const ellipsis = {
    rows: 2,
  };

  const handleOpenPage = () => {
    window.open(tab.url.href, '_blank');
  };

  useEffect(() => {
    setCurrentStat(SidebarLoader.augmentationStats[tab.augmentation.id] ?? 0);
    setDomains(SidebarLoader.publicationSlices[tab.augmentation.id][tab.url.href]);
  }, [
    // Singleton instance not reinitialized on rerender.
    // ! Be careful when updating the dependency list!
    tab.augmentation.id,
    tab.url.href,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    SidebarLoader.augmentationStats[tab.augmentation.id],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    SidebarLoader.publicationSlices[tab.augmentation.id][tab.url.href],
  ]);

  const titleFromDomain = tab.url.searchParams.get('insight-tab-title');

  const showMeta = currentStat > 0 || !!tab.augmentation.description?.length || !!domains?.length;

  const keepParent = { keepParent: false };

  return showMeta || titleFromDomain ? (
    <div id="tab-meta-container">
      <div id="meta-info-icon-container">
        <Tooltip
          title={titleFromDomain ? OPEN_PAGE_INFO_TOOLTIP_TEXT : SEARCH_TAB_INFO_TOOLTIP_TEXT}
          destroyTooltipOnHide={keepParent}
          placement="right"
        >
          <Info stroke={ICON_COLOR} />
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
              <DomainStateCheckbox domain={extractPublication(tab.url.href)} />
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
                {tab.augmentation.description && (
                  <span className="space-right">{tab.augmentation.description}</span>
                )}
                {tab.url && showDomains && (
                  <>
                    <span className="space-right">Lens&nbsp;sources&nbsp;include</span>
                    {Array.from(new Set(domains))?.map((domain, index, originalDomainsArray) => (
                      <a
                        href={`https://${domain}`}
                        className="meta-link"
                        key={domain}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {`${!originalDomainsArray[index + 1] ? domain : `${domain},\u00a0`}`}
                      </a>
                    ))}
                  </>
                )}
              </Paragraph>
              <Button id="meta-toggle-button" type="link" onClick={handleToggle}>
                {expanded ? HIDE_ELLIPSIS_BUTTON_TEXT : SHOW_ELLIPSIS_BUTTON_TEXT}
              </Button>
            </>
          )
        )}
      </div>
    </div>
  ) : null;
};

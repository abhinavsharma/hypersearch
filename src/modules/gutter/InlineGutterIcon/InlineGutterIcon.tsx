import React, { useCallback, useEffect, useRef } from 'react';
import Button from 'antd/lib/button';
import Tooltip from 'antd/lib/tooltip';
import { EyeOff, Star, MoreHorizontal } from 'react-feather';
import { PublicationTimeTracker } from '../PublicationTimeTracker/PublicationTimeTracker';
import {
  HOVER_EXPAND_REQUIRED_MIN_WIDTH,
  INSIGHT_HAS_CREATED_SUBTAB_SELECTOR,
  MY_BLOCKLIST_ID,
  MY_TRUSTLIST_ID,
  OPEN_AUGMENTATION_BUILDER_MESSAGE,
  OPEN_BUILDER_PAGE,
  SIDEBAR_Z_INDEX,
  SWITCH_TO_TAB,
  TOGGLE_BLOCKED_DOMAIN_MESSAGE,
  TOGGLE_TRUSTED_DOMAIN_MESSAGE,
  TRIGGER_GUTTER_HOVEROPEN_MESSAGE,
} from 'utils/constants';
import 'antd/lib/button/style/index.css';
import 'antd/lib/tooltip/style/index.css';
import './InlineGutterIcon.scss';

/** MAGICS **/
const ADD_TO_TRUSTLIST_TOOLTIP_TITLE = 'Add <placeholder> to my trusted sites.';
const REMOVE_FROM_TRUSTLIST_TOOLTIP_TITLE = `Remove <placeholder> from my muted sites.`;
const ADD_TO_BLOCKLIST_TOOLTIP_TITLE = 'Add <placeholder> to my muted sites.';
const REMOVE_FROM_BLOCKLIST_TOOLTIP_TITLE = 'Remove <placeholder> from my muted sites.';
const BLOCKER_AUGMENTATION_LIST_TEXT = 'Domain hidden by <placeholder>.';
const SEARCHING_AUGMENTATION_LIST_TEXT = `Domain featured in <placeholder>.`;
const ICON_UNSELECTED_COLOR = '#999';
const ICON_SELECTED_COLOR = 'rgb(23, 191, 99)';
const SWITCH_TO_TAB_DELAY = 300; //ms
const TOOLTIP_CONTAINER_STYLE: React.CSSProperties = { zIndex: SIDEBAR_Z_INDEX + 1 };

export const InlineGutterIcon: InlineGutterIcon = ({
  url,
  publication,
  container,
  blockingAugmentations = [],
  searchingAugmentations = [],
}) => {
  const isBlocked = !!blockingAugmentations.length;
  const isSearched = !!searchingAugmentations.length;
  const iconRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const tooltipContainer = useRef(null);
  const timeoutRef = useRef(null);

  const handleOpenBuilder = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    chrome.runtime.sendMessage({
      type: OPEN_AUGMENTATION_BUILDER_MESSAGE,
      page: OPEN_BUILDER_PAGE.GUTTER,
      augmentations: blockingAugmentations,
      publication,
    } as OpenGutterPageMessage);
  };

  const handleToggleBlocked = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    (e.target as HTMLElement).classList.add('bounceIn');
    chrome.runtime.sendMessage({ type: TOGGLE_BLOCKED_DOMAIN_MESSAGE, publication, isBlocked });
    handleOpenBuilder(e);
  };

  const handleToggleTrusted = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    (e.target as HTMLElement).classList.add('bounceIn');
    chrome.runtime.sendMessage({ type: TOGGLE_TRUSTED_DOMAIN_MESSAGE, publication });
    handleOpenBuilder(e);
  };

  const handleMouseEnter = useCallback((): any => {
    if (
      window.innerWidth >= HOVER_EXPAND_REQUIRED_MIN_WIDTH &&
      resultRef.current?.getAttribute(INSIGHT_HAS_CREATED_SUBTAB_SELECTOR) === 'true'
    ) {
      resultRef.current.style.cursor = 'wait';
      timeoutRef.current = setTimeout(() => {
        chrome.runtime.sendMessage({ type: TRIGGER_GUTTER_HOVEROPEN_MESSAGE, url });
        chrome.runtime.sendMessage({ type: SWITCH_TO_TAB, url });
        resultRef.current.style.cursor = 'default';
      }, SWITCH_TO_TAB_DELAY);
    }

    iconRef.current.style.opacity = '1';
    rootRef.current.setAttribute('insight-show-gutter-icon', 'true');
  }, [url]);

  const handleMouseLeave = useCallback((): any => {
    if (
      window.innerWidth >= HOVER_EXPAND_REQUIRED_MIN_WIDTH &&
      resultRef.current?.getAttribute(INSIGHT_HAS_CREATED_SUBTAB_SELECTOR) === 'true'
    ) {
      // ! Known Issue:
      // ! In Chrome with open DevTools, the cursor won't change until moved
      // ! See: https://stackoverflow.com/a/51714827/2826713
      if (resultRef.current) {
        resultRef.current.style.cursor = 'normal';
      }
      clearTimeout(timeoutRef.current);
    }

    if (isSearched || isBlocked) return null;
    iconRef.current.style.opacity = '0';
    rootRef.current.setAttribute('insight-show-gutter-icon', 'false');
  }, [isSearched, isBlocked]);

  useEffect(() => {
    if (iconRef.current) {
      if (isSearched || isBlocked) {
        iconRef.current.style.opacity = '1';
      }

      rootRef.current = rootRef.current ?? iconRef.current.closest('.insight-gutter-button-root');

      resultRef.current =
        resultRef.current ?? window.location.href.search(/duckduckgo\.com/gi) > -1
          ? (rootRef.current?.parentElement as HTMLDivElement)
          : rootRef.current?.closest(container);

      rootRef.current?.setAttribute(
        'style',
        `
        z-index: ${SIDEBAR_Z_INDEX - 2};
        margin-top: -${resultRef.current?.offsetHeight - 10}px;
        `,
      );

      if (resultRef.current) {
        resultRef.current.style.marginLeft = '-100px';
        resultRef.current.style.paddingLeft = '100px';
      }

      resultRef.current?.addEventListener('mouseenter', handleMouseEnter);
      resultRef.current?.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        resultRef.current?.removeEventListener('mouseenter', handleMouseEnter);
        resultRef.current?.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [container, handleMouseEnter, handleMouseLeave, isSearched, isBlocked]);

  const onlyBlockedByBlocklist =
    blockingAugmentations.length === 1 && blockingAugmentations[0].id === MY_BLOCKLIST_ID;

  const onlySearchedByTrustlist =
    searchingAugmentations.length === 1 && searchingAugmentations[0].id === MY_TRUSTLIST_ID;

  const inBlocklist = !!blockingAugmentations.find(({ id }) => id === MY_BLOCKLIST_ID);

  const inTrustlist = !!searchingAugmentations.find(({ id }) => id === MY_TRUSTLIST_ID);

  const getPopupContainer = () => tooltipContainer.current;

  return (
    <div className="gutter-icon-container" ref={iconRef}>
      <PublicationTimeTracker key={publication} domain={publication} />
      <Tooltip
        title={`${
          !!searchingAugmentations.length && !onlySearchedByTrustlist
            ? SEARCHING_AUGMENTATION_LIST_TEXT.replace(
                '<placeholder>',
                searchingAugmentations.map(({ name }) => name).join(', '),
              )
            : ''
        } ${
          inTrustlist
            ? REMOVE_FROM_TRUSTLIST_TOOLTIP_TITLE.replace('<placeholder>', publication)
            : ADD_TO_TRUSTLIST_TOOLTIP_TITLE.replace('<placeholder>', publication)
        }`}
        destroyTooltipOnHide={{ keepParent: false }}
        getPopupContainer={getPopupContainer}
        placement="right"
        overlayClassName="gutter-tooltip"
      >
        <Button
          onClick={handleToggleTrusted}
          icon={
            <Star
              stroke={isSearched ? ICON_SELECTED_COLOR : ICON_UNSELECTED_COLOR}
              fill={isSearched ? ICON_SELECTED_COLOR : 'transparent'}
            />
          }
          type="text"
        />
      </Tooltip>
      <Tooltip
        title={`${
          !!blockingAugmentations.length && !onlyBlockedByBlocklist
            ? BLOCKER_AUGMENTATION_LIST_TEXT.replace(
                '<placeholder>',
                blockingAugmentations.map(({ name }) => name).join(', '),
              )
            : ''
        } ${
          inBlocklist
            ? REMOVE_FROM_BLOCKLIST_TOOLTIP_TITLE.replace('<placeholder>', publication)
            : ADD_TO_BLOCKLIST_TOOLTIP_TITLE.replace('<placeholder>', publication)
        }`}
        destroyTooltipOnHide={{ keepParent: false }}
        getPopupContainer={() => tooltipContainer.current}
        placement="right"
        overlayClassName="gutter-tooltip"
      >
        <Button
          onClick={handleToggleBlocked}
          icon={<EyeOff stroke={isBlocked ? ICON_SELECTED_COLOR : ICON_UNSELECTED_COLOR} />}
          type="text"
        />
      </Tooltip>
      <Button
        onClick={handleOpenBuilder}
        icon={<MoreHorizontal stroke={ICON_UNSELECTED_COLOR} />}
        type="text"
      />
      <div className="tooltip-container" ref={tooltipContainer} style={TOOLTIP_CONTAINER_STYLE} />
    </div>
  );
};

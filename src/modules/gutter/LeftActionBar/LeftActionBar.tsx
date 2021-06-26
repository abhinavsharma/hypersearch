/**
 * @module modules:gutter
 * @version 1.0.0
 * @license (C) Insight
 */

import React, { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import Button from 'antd/lib/button';
import Tooltip from 'antd/lib/tooltip';
import { EyeOff, Star, Menu } from 'react-feather';
import { PublicationTimeTracker } from 'modules/gutter';
import SidebarLoader from 'lib/sidebar';
import {
  AUGMENTATION_ID,
  HOVER_EXPAND_REQUIRED_MIN_WIDTH,
  INSIGHT_GUTTER_ACTION_BAR_LEFT_SELECTOR,
  INSIGHT_HAS_CREATED_SUBTAB_SELECTOR,
  INSIGHT_SHOW_GUTTER_ICON_SELECTOR,
  MESSAGE,
  PAGE,
  SIDEBAR_Z_INDEX,
  TOGGLE_BLOCKED_DOMAIN_MESSAGE,
  TOGGLE_TRUSTED_DOMAIN_MESSAGE,
} from 'constant';
import 'antd/lib/button/style/index.css';
import 'antd/lib/tooltip/style/index.css';
import './LeftActionBar.scss';
import { useFeature } from 'lib/features';

//-----------------------------------------------------------------------------------------------
// ! Magics
//-----------------------------------------------------------------------------------------------
const ADD_TO_TRUSTLIST_TOOLTIP_TITLE =
  'Add <placeholder> to my trusted sites.\nAutomatically previews results from this site.';
const REMOVE_FROM_TRUSTLIST_TOOLTIP_TITLE = `Remove <placeholder> from my trusted sites.`;
const ADD_TO_BLOCKLIST_TOOLTIP_TITLE = 'Add <placeholder> to my muted sites.';
const REMOVE_FROM_BLOCKLIST_TOOLTIP_TITLE = 'Remove <placeholder> from my muted sites.';
const IN_FEATURED_TOOLTIP_TEXT = '<placeholder_1> is highlighted by <placeholder_2>.';
const BLOCKER_AUGMENTATION_LIST_TEXT = 'Domain hidden by <placeholder>.';
const SEARCHING_AUGMENTATION_LIST_TEXT = `Domain featured in <placeholder>.`;
const NOT_SEARCHED_BUTTON_TOOLTIP_TEXT = 'Show publication details';
const ICON_UNSELECTED_COLOR = '#999';
const ICON_SELECTED_COLOR = 'rgb(23, 191, 99)';
const TOOLTIP_CONTAINER_STYLE: React.CSSProperties = { zIndex: SIDEBAR_Z_INDEX + 1 };

//-----------------------------------------------------------------------------------------------
// ! Component
//-----------------------------------------------------------------------------------------------
export const LeftActionBar: LeftActionBar = ({
  publication,
  container,
  blockingAugmentations = [],
  searchingAugmentations = [],
  featuringAugmentations = [],
}) => {
  const [isBlocked, setIsBlocked] = useState<boolean>(!!blockingAugmentations.length);
  const [isTrusted, setIsTrusted] = useState<boolean>(
    !!searchingAugmentations.find(({ id }) => id === AUGMENTATION_ID.TRUSTLIST),
  );
  const [isSearched, _setIsSearched] = useState<boolean>(
    searchingAugmentations.some(({ id }) => id !== AUGMENTATION_ID.TRUSTLIST),
  );

  const onlyBlockedByBlocklist =
    blockingAugmentations.length === 1 && blockingAugmentations[0].id === AUGMENTATION_ID.BLOCKLIST;

  const isFeatured = !!featuringAugmentations.length;
  const inBlocklist = !!blockingAugmentations.find(({ id }) => id === AUGMENTATION_ID.BLOCKLIST);

  const iconRef = useRef<HTMLDivElement>(null) as MutableRefObject<HTMLDivElement>;
  const rootRef = useRef<HTMLDivElement>(null) as MutableRefObject<HTMLDivElement>;
  const resultRef = useRef<HTMLDivElement>(null) as MutableRefObject<HTMLDivElement>;
  const tooltipContainer = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<any>(null);

  const ratingFeature = useFeature('desktop_rating');

  const handleOpenBuilder = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    chrome.runtime.sendMessage({
      type: MESSAGE.OPEN_PAGE,
      page: PAGE.GUTTER,
      augmentations: blockingAugmentations,
      publication,
      fromGutter: true,
    });
  };

  const handleToggleBlocked = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    (e.target as HTMLElement).classList.add('bounceIn');
    setIsBlocked((prev) => !prev);
    chrome.runtime.sendMessage({ type: TOGGLE_BLOCKED_DOMAIN_MESSAGE, publication, isBlocked });
    handleOpenBuilder(e);
  };

  const handleToggleTrusted = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    (e.target as HTMLElement).classList.add('bounceIn');
    setIsTrusted((prev) => !prev);
    chrome.runtime.sendMessage({ type: TOGGLE_TRUSTED_DOMAIN_MESSAGE, publication });
    handleOpenBuilder(e);
  };

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

    if (isSearched || isTrusted || isBlocked || isFeatured) return null;
    if (iconRef.current) {
      iconRef.current.style.opacity = '0';
    }

    if (rootRef.current) {
      rootRef.current.setAttribute(INSIGHT_SHOW_GUTTER_ICON_SELECTOR, 'false');
    }
  }, [isSearched, isTrusted, isBlocked, isFeatured]);

  useEffect(() => {
    const handleMouseEnter = () => {
      if (iconRef.current) {
        iconRef.current.style.opacity = '1';
      }

      if (rootRef.current) {
        rootRef.current.setAttribute(INSIGHT_SHOW_GUTTER_ICON_SELECTOR, 'true');
      }
    };

    if (iconRef.current) {
      if (isSearched || isTrusted || isBlocked || isFeatured) {
        iconRef.current.style.opacity = '1';
      }

      rootRef.current =
        rootRef.current ?? iconRef.current.closest(`.${INSIGHT_GUTTER_ACTION_BAR_LEFT_SELECTOR}`);

      /* eslint-disable */
      const newResult =
        resultRef.current ?? window.location.href.search(/duckduckgo\.com/gi) > -1
          ? (rootRef.current?.parentElement as HTMLDivElement)
          : container
            ? (rootRef.current?.closest(container) as HTMLDivElement)
            : rootRef.current?.parentElement;
      /* eslint-enable */

      if (newResult) {
        resultRef.current = newResult as HTMLDivElement;
      }

      rootRef.current?.setAttribute(
        'style',
        `
        z-index: ${SIDEBAR_Z_INDEX - 2};
        margin-top: -${resultRef.current?.offsetHeight}px;
        height: ${resultRef.current?.offsetHeight}px;
        `,
      );

      const resultMinWidth =
        resultRef.current?.offsetWidth +
        (window.innerWidth - (Number(SidebarLoader.maxAvailableSpace) ?? 0));

      if (resultRef.current) {
        resultRef.current.style.minWidth = resultMinWidth + '';
      }

      resultRef.current?.addEventListener('mouseenter', handleMouseEnter);
      resultRef.current?.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        resultRef.current?.removeEventListener('mouseenter', handleMouseEnter);
        resultRef.current?.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [container, handleMouseLeave, isSearched, isTrusted, isBlocked, isFeatured, ratingFeature]);

  const getPopupContainer = () => tooltipContainer.current as HTMLDivElement;

  const keepParent = { keepParent: false };

  const containerStyle = container
    ? Object.create(null)
    : { display: 'none', visibility: 'hidden' };

  return (
    <>
      <div className="gutter-icon-container" ref={iconRef} style={containerStyle}>
        <PublicationTimeTracker key={publication} domain={publication} />
        <Tooltip
          title={`${
            featuringAugmentations.length
              ? IN_FEATURED_TOOLTIP_TEXT.replace('<placeholder_1>', publication).replace(
                  '<placeholder_2>',
                  featuringAugmentations.map(({ name }) => name).join(', '),
                )
              : ''
          }
          ${
            isTrusted
              ? REMOVE_FROM_TRUSTLIST_TOOLTIP_TITLE.replace('<placeholder>', publication)
              : ADD_TO_TRUSTLIST_TOOLTIP_TITLE.replace('<placeholder>', publication)
          }`}
          destroyTooltipOnHide={keepParent}
          getPopupContainer={getPopupContainer}
          placement="right"
          overlayClassName="gutter-tooltip"
        >
          <Button
            onClick={handleToggleTrusted}
            icon={
              <Star
                stroke={isTrusted || isFeatured ? ICON_SELECTED_COLOR : ICON_UNSELECTED_COLOR}
                fill={isTrusted ? ICON_SELECTED_COLOR : 'transparent'}
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
          destroyTooltipOnHide={keepParent}
          getPopupContainer={getPopupContainer}
          placement="right"
          overlayClassName="gutter-tooltip"
        >
          <Button
            onClick={handleToggleBlocked}
            icon={<EyeOff stroke={isBlocked ? ICON_SELECTED_COLOR : ICON_UNSELECTED_COLOR} />}
            type="text"
          />
        </Tooltip>
        <Tooltip
          title={`${
            isSearched
              ? SEARCHING_AUGMENTATION_LIST_TEXT.replace(
                  '<placeholder>',
                  searchingAugmentations
                    .filter(({ id }) => id !== AUGMENTATION_ID.TRUSTLIST)
                    .map(({ name }) => name)
                    .join(', '),
                )
              : NOT_SEARCHED_BUTTON_TOOLTIP_TEXT
          }`}
          destroyTooltipOnHide={keepParent}
          getPopupContainer={getPopupContainer}
          placement="right"
          overlayClassName="gutter-tooltip"
        >
          <Button
            onClick={handleOpenBuilder}
            icon={
              <Menu
                stroke={isSearched ? ICON_SELECTED_COLOR : ICON_UNSELECTED_COLOR}
                fill={isSearched ? ICON_SELECTED_COLOR : 'transparent'}
              />
            }
            type="text"
          />
        </Tooltip>
        <div className="tooltip-container" ref={tooltipContainer} style={TOOLTIP_CONTAINER_STYLE} />
      </div>
    </>
  );
};

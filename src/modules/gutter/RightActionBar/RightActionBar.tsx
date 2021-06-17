import React, { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import Tooltip from 'antd/lib/tooltip';
import {
  HOVER_EXPAND_REQUIRED_MIN_WIDTH,
  INSIGHT_GUTTER_ACTION_BAR_RIGHT_SELECTOR,
  INSIGHT_HAS_CREATED_SUBTAB_SELECTOR,
  INSIGHT_SHOW_GUTTER_ICON_SELECTOR,
  SIDEBAR_Z_INDEX,
  SWITCH_TO_TAB,
  TRIGGER_GUTTER_HOVEROPEN_MESSAGE,
} from 'constant';
import { HoverOpenIcon } from 'modules/gutter/HoverOpenIcon/HoverOpenIcon';
import 'antd/lib/button/style/index.css';
import 'antd/lib/tooltip/style/index.css';
import './RightActionBar.scss';

/** MAGICS **/
const HOVER_ACTION_TOOLTIP_TITLE = (
  <span>
    {/* &#8288; === word-joiner U+2060 See: https://unicode-table.com/en/2060/ */}
    Hovering here will preview this page in the Insight sidebar if your screen is wider than 1200px.
  </span>
);
const ICON_UNSELECTED_COLOR = '#999';
const TOOLTIP_CONTAINER_STYLE: React.CSSProperties = { zIndex: SIDEBAR_Z_INDEX + 1 };
const SWITCH_TO_TAB_DELAY = 300; //ms

export const RightActionBar: RightActionBar = ({
  url,
  container,
  searchingAugmentations = [],
  featuringAugmentations = [],
  blockingAugmentations = [],
}) => {
  const [hasTab, setHasTab] = useState(false);

  const isFeatured = !!featuringAugmentations.length;
  const isSearched = !!searchingAugmentations.length;
  const iconRef = useRef<HTMLDivElement>(null) as MutableRefObject<HTMLDivElement>;
  const rootRef = useRef<HTMLDivElement>(null) as MutableRefObject<HTMLDivElement>;
  const resultRef = useRef<HTMLDivElement>(null) as MutableRefObject<HTMLDivElement>;
  const tooltipContainer = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<any>(null);

  const handleMouseEnter = useCallback(
    (e: MouseEvent) => {
      if (
        window.innerWidth >= HOVER_EXPAND_REQUIRED_MIN_WIDTH &&
        resultRef.current?.getAttribute(INSIGHT_HAS_CREATED_SUBTAB_SELECTOR) === 'true' &&
        e.shiftKey
      ) {
        resultRef.current.style.cursor = 'wait';
        timeoutRef.current = setTimeout(() => {
          chrome.runtime.sendMessage({ type: TRIGGER_GUTTER_HOVEROPEN_MESSAGE, url });
          chrome.runtime.sendMessage({
            type: SWITCH_TO_TAB,
            url,
            event: {
              shift: e.shiftKey,
              isResultHover: true,
            },
          });
          if (resultRef.current) {
            resultRef.current.style.cursor = 'default';
          }
        }, SWITCH_TO_TAB_DELAY);
      }

      if (iconRef.current) {
        iconRef.current.style.opacity = '1';
      }

      if (rootRef.current) {
        rootRef.current.setAttribute(INSIGHT_SHOW_GUTTER_ICON_SELECTOR, 'true');
      }
    },
    [url],
  );

  const handleMouseLeave = useCallback((): any => {
    if (isSearched || isFeatured) return null;
    if (iconRef.current) {
      iconRef.current.style.opacity = '0';
    }

    if (rootRef.current) {
      rootRef.current.setAttribute(INSIGHT_SHOW_GUTTER_ICON_SELECTOR, 'false');
    }
    clearTimeout(timeoutRef.current);
  }, [isSearched, isFeatured]);

  useEffect(() => {
    const handleAlterOpen = () => {
      const element =
        window.location.href.search(/duckduckgo\.com/gi) > -1
          ? rootRef.current.parentElement?.querySelector(container)
          : resultRef.current;
      if (
        window.innerWidth >= HOVER_EXPAND_REQUIRED_MIN_WIDTH &&
        element?.getAttribute(INSIGHT_HAS_CREATED_SUBTAB_SELECTOR) === 'true'
      ) {
        const element = rootRef.current as HTMLDivElement;
        element.style.cursor = 'wait';
        timeoutRef.current = setTimeout(() => {
          chrome.runtime.sendMessage({ type: TRIGGER_GUTTER_HOVEROPEN_MESSAGE, url });
          chrome.runtime.sendMessage({
            type: SWITCH_TO_TAB,
            url,
          });
          element.style.cursor = 'pointer';
        }, SWITCH_TO_TAB_DELAY);
      }
    };

    const handleClick = (e: MouseEvent) => {
      e.stopPropagation();
      window.open(url, '_blank');
    };

    if (iconRef.current) {
      if (isSearched || isFeatured) {
        iconRef.current.style.opacity = '1';
      }

      rootRef.current =
        rootRef.current ?? iconRef.current.closest(`.${INSIGHT_GUTTER_ACTION_BAR_RIGHT_SELECTOR}`);

      // prettier-ignore
      const newResult =
        resultRef.current ?? window.location.href.search(/duckduckgo\.com/gi) > -1
          ? (rootRef.current?.parentElement as HTMLDivElement)
          : container
            ? (rootRef.current?.closest(container) as HTMLDivElement)
            : rootRef.current?.parentElement;

      if (newResult) {
        resultRef.current = newResult as HTMLDivElement;
      }

      rootRef.current?.setAttribute(
        'style',
        `
        z-index: ${SIDEBAR_Z_INDEX - 2};
        margin-top: -${resultRef.current?.offsetHeight}px;
        height: ${resultRef.current?.offsetHeight}px;
        right: ${
          // prettier-ignore
          window.location.href.search(/duckduckgo\.com/gi) > -1
            ? '-50px'
            : blockingAugmentations.length
              ? '47px'
              : '0'
        };
        cursor: pointer;
        `,
      );

      if (resultRef.current && window.location.href.search(/duckduckgo\.com/gi) === -1) {
        resultRef.current.style.marginRight = '-100px';
        resultRef.current.style.paddingRight = '100px';
      }

      rootRef.current?.addEventListener('click', handleClick);
      rootRef.current?.addEventListener('mouseenter', handleAlterOpen);
      resultRef.current?.addEventListener('mouseenter', handleMouseEnter);
      resultRef.current?.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        rootRef.current?.removeEventListener('click', handleClick);
        rootRef.current?.removeEventListener('mouseenter', handleAlterOpen);
        resultRef.current?.removeEventListener('mouseenter', handleMouseEnter);
        resultRef.current?.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [
    container,
    handleMouseEnter,
    handleMouseLeave,
    isSearched,
    isFeatured,
    url,
    blockingAugmentations.length,
  ]);

  useEffect(() => {
    const { current } = resultRef;
    const element =
      window.location.href.search(/duckduckgo\.com/gi) > -1
        ? rootRef.current.parentElement?.querySelector(container)
        : current;
    setHasTab(element?.getAttribute(INSIGHT_HAS_CREATED_SUBTAB_SELECTOR) === 'true');
  }, [resultRef, container]);

  const getPopupContainer = () => tooltipContainer.current as HTMLDivElement;

  const keepParent = { keepParent: false };

  const containerStyle = container
    ? Object.create(null)
    : { display: 'none', visibility: 'hidden' };

  return (
    <div
      className={`gutter-icon-container ${hasTab ? 'has-overlay' : ''}`}
      ref={iconRef}
      style={containerStyle}
    >
      {hasTab && (
        <>
          {window.innerWidth < HOVER_EXPAND_REQUIRED_MIN_WIDTH ? (
            <Tooltip
              title={HOVER_ACTION_TOOLTIP_TITLE}
              destroyTooltipOnHide={keepParent}
              getPopupContainer={getPopupContainer}
              placement="right"
              overlayClassName="gutter-tooltip"
            >
              <HoverOpenIcon color={ICON_UNSELECTED_COLOR} width={30} />
            </Tooltip>
          ) : (
            <HoverOpenIcon color={ICON_UNSELECTED_COLOR} width={30} />
          )}
        </>
      )}
      <div className="tooltip-container" ref={tooltipContainer} style={TOOLTIP_CONTAINER_STYLE} />
    </div>
  );
};

import React, { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import Tooltip from 'antd/lib/tooltip';
import {
  HOVER_EXPAND_REQUIRED_MIN_WIDTH,
  INSIGHT_HAS_CREATED_SUBTAB_SELECTOR,
  SIDEBAR_Z_INDEX,
  SWITCH_TO_TAB,
  TRIGGER_GUTTER_HOVEROPEN_MESSAGE,
} from 'utils/constants';
import { HoverOpenIcon } from 'modules/gutter/HoverOpenIcon/HoverOpenIcon';
import 'antd/lib/button/style/index.css';
import 'antd/lib/tooltip/style/index.css';
import './RightActionBar.scss';

/** MAGICS **/
const HOVER_ACTION_TOOLTIP_TITLE = (
  <span>
    {/* &#8288; === word-joiner U+2060 See: https://unicode-table.com/en/2060/ */}
    Hover over this or press ⬆<code>&#8288;Shift</code> while hovering over a result to preview
  </span>
);
const ICON_UNSELECTED_COLOR = '#999';
const TOOLTIP_CONTAINER_STYLE: React.CSSProperties = { zIndex: SIDEBAR_Z_INDEX + 1 };
const SWITCH_TO_TAB_DELAY = 300; //ms

export const RightActionBar: RightActionBar = ({
  url,
  container,
  blockingAugmentations = [],
  searchingAugmentations = [],
}) => {
  const [hasTab, setHasTab] = useState(false);

  const isBlocked = !!blockingAugmentations.length;
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
        rootRef.current.setAttribute('insight-show-gutter-icon', 'true');
      }
    },
    [url],
  );

  const handleMouseLeave = useCallback((): any => {
    if (isSearched || isBlocked) return null;
    if (iconRef.current) {
      iconRef.current.style.opacity = '0';
    }

    if (rootRef.current) {
      rootRef.current.setAttribute('insight-show-gutter-icon', 'false');
    }
    clearTimeout(timeoutRef.current);
  }, [isSearched, isBlocked]);

  useEffect(() => {
    const handleAlterOpen = () => {
      if (
        window.innerWidth >= HOVER_EXPAND_REQUIRED_MIN_WIDTH &&
        resultRef.current?.getAttribute(INSIGHT_HAS_CREATED_SUBTAB_SELECTOR) === 'true'
      ) {
        rootRef.current.style.cursor = 'wait';
        timeoutRef.current = setTimeout(() => {
          chrome.runtime.sendMessage({ type: TRIGGER_GUTTER_HOVEROPEN_MESSAGE, url });
          chrome.runtime.sendMessage({
            type: SWITCH_TO_TAB,
            url,
          });
          if (rootRef.current) {
            rootRef.current.style.cursor = 'default';
          }
        }, SWITCH_TO_TAB_DELAY);
      }
    };

    if (iconRef.current) {
      if (isSearched || isBlocked) {
        iconRef.current.style.opacity = '1';
      }

      rootRef.current =
        rootRef.current ?? iconRef.current.closest('.insight-gutter-button-root-right');

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
        margin-top: -${
          isBlocked ? resultRef.current?.offsetHeight : resultRef.current?.offsetHeight
        }px;
        height: ${resultRef.current?.offsetHeight}px;
        cursor: pointer;
        `,
      );

      if (resultRef.current) {
        resultRef.current.style.marginRight = '-100px';
        resultRef.current.style.paddingRight = '100px';
      }

      rootRef.current?.addEventListener('mouseenter', handleAlterOpen);
      resultRef.current?.addEventListener('mouseenter', handleMouseEnter);
      resultRef.current?.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        rootRef.current?.removeEventListener('mouseenter', handleAlterOpen);
        resultRef.current?.removeEventListener('mouseenter', handleMouseEnter);
        resultRef.current?.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [container, handleMouseEnter, handleMouseLeave, isSearched, isBlocked, url]);

  useEffect(() => {
    const { current } = resultRef;
    setHasTab(current?.getAttribute(INSIGHT_HAS_CREATED_SUBTAB_SELECTOR) === 'true');
  }, [resultRef]);

  const getPopupContainer = () => tooltipContainer.current as HTMLDivElement;

  const keepParent = { keepParent: false };

  const containerStyle = container
    ? Object.create(null)
    : { display: 'none', visibility: 'hidden' };

  return (
    <div className="gutter-icon-container" ref={iconRef} style={containerStyle}>
      {hasTab && (
        <Tooltip
          title={HOVER_ACTION_TOOLTIP_TITLE}
          destroyTooltipOnHide={keepParent}
          getPopupContainer={getPopupContainer}
          placement="left"
          overlayClassName="gutter-tooltip"
        >
          <HoverOpenIcon color={ICON_UNSELECTED_COLOR} width={30} />
        </Tooltip>
      )}
      <div className="tooltip-container" ref={tooltipContainer} style={TOOLTIP_CONTAINER_STYLE} />
    </div>
  );
};

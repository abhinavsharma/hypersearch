import React, { MutableRefObject, useEffect, useRef } from 'react';
import { useFeature } from 'lib/features';
import { usePublicationInfo } from 'lib/publication';
import {
  INSIGHT_GUTTER_PUBLICATION_TAG_SELECTOR,
  INSIGHT_SHOW_GUTTER_ICON_SELECTOR,
  SIDEBAR_Z_INDEX,
} from 'constant';
import './PublicationTagRow.scss';

//-----------------------------------------------------------------------------------------------
// ! Magics
//-----------------------------------------------------------------------------------------------
const RATING_SEPARATOR = '\u00a0⭐\u00a0·\u00a0';

//-----------------------------------------------------------------------------------------------
// ! Component
//-----------------------------------------------------------------------------------------------
export const PublicationTagRow: PublicationTagRow = ({ publication, container }) => {
  const { publicationInfo, averageRating } = usePublicationInfo(publication);
  const [ratingFeature] = useFeature('desktop_ratings');

  const containerRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null) as MutableRefObject<HTMLDivElement>;
  const resultRef = useRef<HTMLDivElement>(null) as MutableRefObject<HTMLDivElement>;

  //-----------------------------------------------------------------------------------------------
  // ! Handlers
  //-----------------------------------------------------------------------------------------------

  useEffect(() => {
    if (!ratingFeature) {
      return;
    }

    const handleMouseEnter = () => {
      if (containerRef.current) {
        containerRef.current.style.opacity = '1';
      }

      if (resultRef.current) {
        resultRef.current.setAttribute(INSIGHT_SHOW_GUTTER_ICON_SELECTOR, 'true');
      }
    };

    const handleMouseLeave = (): any => {
      if (containerRef.current) {
        containerRef.current.style.opacity = '0';
      }

      if (resultRef.current) {
        resultRef.current.setAttribute(INSIGHT_SHOW_GUTTER_ICON_SELECTOR, 'false');
      }
    };

    if (containerRef.current) {
      rootRef.current =
        rootRef.current ??
        containerRef.current.closest(`.${INSIGHT_GUTTER_PUBLICATION_TAG_SELECTOR}`);

      const newResult =
        // prettier-ignore
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
        margin-top: -${resultRef.current?.offsetHeight + 20}px;
        height: 17px;
        `,
      );
    }

    resultRef.current?.addEventListener('mouseenter', handleMouseEnter);
    resultRef.current?.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      resultRef.current?.removeEventListener('mouseenter', handleMouseEnter);
      resultRef.current?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [container, ratingFeature]);

  const text = publicationInfo.tags?.[0].text;

  //-----------------------------------------------------------------------------------------------
  // ! Render
  //-----------------------------------------------------------------------------------------------

  return ratingFeature ? (
    <div className="insight-row publication-tag-container" ref={containerRef}>
      {averageRating > 0 && (
        <span>
          {averageRating}
          {RATING_SEPARATOR}
        </span>
      )}
      {text && <span>{text.replace(/^[\w]/, text.match(/^[\w]/)?.[0]?.toUpperCase() ?? '')}</span>}
    </div>
  ) : null;
};

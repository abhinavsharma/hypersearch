import React from 'react';
import { render } from 'react-dom';
import {
  INSIGHT_ALLOWED_RESULT_SELECTOR,
  INSIGHT_BLOCKED_BY_SELECTOR,
  INSIGHT_BLOCKED_DOMAIN_SELECTOR,
  INSIGHT_HIDDEN_RESULT_SELECTOR,
  INSIGHT_SEARCHED_DOMAIN_SELECTOR,
  INSIGHT_SEARCHED_RESULT_SELECTOR,
  INSIGHT_SEARCH_BY_SELECTOR,
  MY_BLOCKLIST_ID,
  SIDEBAR_Z_INDEX,
} from 'utils/constants';
import { extractUrlProperties } from 'utils/helpers';
import { InlineGutterIcon } from 'modules/gutter/InlineGutterIcon/InlineGutterIcon';

/**
 * Create an overlay above the list of HTMLElements
 *
 * @param nodes - The list of nodes to overlay
 * @param selector - The closest selector where the overlay will be placed
 * @param deatils - `Record<text|header>` - The text content of the overlay
 * @param selectorString - This string will be placed inside the CSS selectors
 * @example
 * ```
 * insight-${selectorString}-overlay
 * insight-${selectorString}-text-wrapper
 * insight-${selectorString}-inner-text
 * ```
 */
export const processSerpResults: ProcessSerpResults = (
  { block, search },
  selector,
  { text, header },
  selectorString,
  { block: blockAugmentations, search: searchAugmentations } = Object.create(null),
) => {
  if (window.location === window.parent.location) {
    for (const node of search) {
      const serpResult = node?.closest(selector) as HTMLElement;
      if (!serpResult) continue;
      serpResult.setAttribute(INSIGHT_SEARCHED_RESULT_SELECTOR, 'true');

      const domain =
        extractUrlProperties(node.querySelector('a')?.getAttribute('href'))?.hostname ||
        extractUrlProperties(node.getAttribute('href'))?.hostname;

      serpResult.setAttribute(INSIGHT_SEARCHED_DOMAIN_SELECTOR, domain);

      if (!!searchAugmentations?.[domain]?.length) {
        serpResult.setAttribute(
          INSIGHT_SEARCH_BY_SELECTOR,
          searchAugmentations?.[domain].map(({ id }) => id).join(' '),
        );
        const buttonRoot = document.createElement('div');
        buttonRoot.classList.add(`insight-${selectorString}-button-root`);
        render(
          <InlineGutterIcon
            augmentations={blockAugmentations[domain].filter(({ id }) => id !== MY_BLOCKLIST_ID)}
            isSearched
            domain={domain}
          />,
          buttonRoot,
        );
      }
    }
  }

  for (const node of block) {
    const serpResult = node?.closest(selector) as HTMLElement;
    if (!serpResult) continue;
    serpResult.setAttribute(INSIGHT_ALLOWED_RESULT_SELECTOR, 'false');

    const domain =
      extractUrlProperties(node.querySelector('a')?.getAttribute('href'))?.hostname ||
      extractUrlProperties(node.getAttribute('href'))?.hostname;

    if (serpResult.getAttribute(INSIGHT_HIDDEN_RESULT_SELECTOR) === 'true') {
      const existingOverlay = serpResult.querySelector('.insight-hidden-domain-overlay');
      existingOverlay && serpResult.removeChild(existingOverlay);
    }
    if (!blockAugmentations?.[domain]?.length) {
      serpResult.setAttribute('insight-ad-block', 'true');
    }

    serpResult.setAttribute(INSIGHT_HIDDEN_RESULT_SELECTOR, 'true');

    const overlay = document.createElement('div');
    overlay.classList.add(`insight-${selectorString}-overlay`);
    overlay.setAttribute('style', `z-index: ${SIDEBAR_Z_INDEX - 2};`);
    overlay.classList.add('insight-hidden');

    const textWrapper = document.createElement('div');
    textWrapper.classList.add(`insight-${selectorString}-text-wrapper`);
    textWrapper.innerText = header;

    const innerText = document.createElement('div');
    innerText.classList.add(`insight-${selectorString}-inner-text`);
    innerText.innerText = text;

    if (blockAugmentations?.[domain]?.length) {
      if (window.location.href.search(/duckduckgo\.com/gi) > -1) {
        serpResult.parentElement.style.pointerEvents = 'none';
      }
      overlay.setAttribute(
        INSIGHT_BLOCKED_BY_SELECTOR,
        Array.from(
          new Set(
            blockAugmentations[domain].reduce((a, { id }) => {
              a.push(id);
              return a;
            }, []),
          ),
        ).join(' '),
      );
      overlay.setAttribute(INSIGHT_BLOCKED_DOMAIN_SELECTOR, domain);
      if (serpResult.getAttribute(INSIGHT_SEARCHED_RESULT_SELECTOR) !== 'true') {
        const buttonRoot = document.createElement('div');
        buttonRoot.classList.add(`insight-${selectorString}-button-root`);
        render(
          <InlineGutterIcon
            augmentations={blockAugmentations[domain].filter(({ id }) => id !== MY_BLOCKLIST_ID)}
            domain={domain}
          />,
          buttonRoot,
        );
        textWrapper.appendChild(buttonRoot);
      }
      if (window.location !== window.parent.location) {
        Array.from(document.querySelectorAll('.inline-gutter-icon')).forEach(
          (element: HTMLElement) => (element.style.display = 'none'),
        );
      }
    }
    overlay.appendChild(textWrapper);
    textWrapper.appendChild(innerText);
    overlay.addEventListener('click', (e) => {
      if (serpResult.getAttribute(`${INSIGHT_HIDDEN_RESULT_SELECTOR}-protected`) !== 'true') {
        e.preventDefault();
        const ol = (e.target as Element)?.closest('.insight-hidden');
        ol.parentElement.style.maxHeight = 'none';
        ol.parentElement.style.overflow = 'auto';
        ol.parentNode.removeChild(ol);
        serpResult.setAttribute(`${INSIGHT_HIDDEN_RESULT_SELECTOR}-protected`, 'true');
      }
    });
    if (
      serpResult.querySelectorAll('.insight-hidden').length === 0 &&
      serpResult.getAttribute(`${INSIGHT_HIDDEN_RESULT_SELECTOR}-protected`) !== 'true'
    ) {
      serpResult.style.position = 'relative';

      serpResult.style.overflow = 'hidden';
      serpResult.insertBefore(overlay, serpResult.firstChild);
    }
  }
};

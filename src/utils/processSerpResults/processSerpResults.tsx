/**
 * @module ProcessSerpResults
 * @author Matyas Angyal<matyas@laso.ai>
 * @license (C) Insight
 * @version 1.0.0
 * @description
 *  Collection of gutter unit and overlay related functionality. Gutter unit is shown near each SERP
 *  result when a result's container element is hovered, the result is blocked by an augmentation or
 *  searched by an augmentation.
 *  "Searched" means that an augmentation has SEARCH_DOMAINS_ACTION, which value is the result's domain.
 *  "Blocked" used as term declaring the result to be ignored by the user and create an overlay above it.
 */
import React from 'react';
import { render } from 'react-dom';
import {
  DOMAINS_TO_RELEVANT_SLICE,
  INSIGHT_ALLOWED_RESULT_SELECTOR,
  INSIGHT_BLOCKED_BY_SELECTOR,
  INSIGHT_BLOCKED_DOMAIN_SELECTOR,
  INSIGHT_HIDDEN_RESULT_SELECTOR,
  INSIGHT_SEARCHED_DOMAIN_SELECTOR,
  INSIGHT_SEARCHED_RESULT_SELECTOR,
  INSIGHT_SEARCH_BY_SELECTOR,
  SIDEBAR_Z_INDEX,
} from 'utils/constants';
import { v4 as uuid } from 'uuid';
import { extractUrlProperties } from 'utils/helpers';
import { InlineGutterIcon } from 'modules/gutter/InlineGutterIcon/InlineGutterIcon';

/**
 * Create an overlay above the specified element, containing the provided text content and creating
 * CSS selectors according to the set `selectorString` property in the `details` parameter. The overlay
 * can be dismissed by clicking on it. This action will define the node as `protected` and prevent adding
 * the overlay until the page is reloaded. When overlay is created by a blocking augmentation, the gutter
 * unit will be always visible. Dismissing also works when the node is blocked by an augmentation, however
 * the overlay will be visible until no more blockers assigned to the node.
 *
 * Current blocking augmentation IDs are available as a `' ' (space)` separated list in the value of
 * INSIGHT_BLOCKED_BY_SELECTOR attribute. If a node is blocked, the INSIGHT_BLOCKED_DOMAIN_SELECTOR will be
 * set to the node's corresponding domain.
 *
 * @param serpResult - The node where the overlay will be inserted
 * @param blockingAugmentations - The list of augmentations that are blocking the node. When its not set, or
 *  the list is empty, the function will handle the overlay as ad blocker and use the values from `block.ts`.
 *  Blocked advertisments has no gutter icon buttons and only render the overlay itself with its tesct content.
 * @param deatils - `Record<text|header|selectorString>` - The text content and class of the overlay
 * @example
 * ```js
 * createOverlay(element, [{id: "my-block-id", ...}], {
 *  header: 'Ad',
 *  text: 'Click to show...',
 *  selectorString: 'blocked-ad'
 * });
 * // The above function call will create an overlay similar to the ad block
 * // while also enabling the following CSS classes to customize the overlay:
 * // - insight-blocked-ad-overlay - The base style of the overlay
 * // - insight-blocked-ad-text-wrapper - The container of text content
 * // - insight-blocked-ad-inner-text - The text content
 * ```
 * @see `scripts/block.ts`
 */
const createOverlay = (
  serpResult: HTMLElement,
  blockingAugmentations: AugmentationObject[] = [],
  details: Record<'text' | 'header' | 'selectorString', string>,
) => {
  if (!(serpResult instanceof HTMLElement)) return null;

  if (serpResult.getAttribute(INSIGHT_HIDDEN_RESULT_SELECTOR) === 'true') {
    const existingOverlay = serpResult.querySelector('.insight-hidden-domain-overlay');
    existingOverlay && existingOverlay.parentElement.removeChild(existingOverlay);
  }

  // Assume the result is an advertisment when there is no blocking augmentations
  if (!blockingAugmentations.length) {
    serpResult.setAttribute('insight-ad-block', 'true');
  }

  serpResult.setAttribute(INSIGHT_HIDDEN_RESULT_SELECTOR, 'true');

  if (
    !serpResult.querySelectorAll('.insight-hidden').length &&
    serpResult.getAttribute(`${INSIGHT_HIDDEN_RESULT_SELECTOR}-protected`) !== 'true'
  ) {
    const overlay = document.createElement('div');
    overlay.classList.add(`insight-${details.selectorString}-overlay`);
    overlay.setAttribute('style', `z-index: ${SIDEBAR_Z_INDEX - 2};`);
    overlay.classList.add('insight-hidden');

    const textWrapper = document.createElement('div');
    textWrapper.classList.add(`insight-${details.selectorString}-text-wrapper`);
    textWrapper.innerText = details.header;

    const innerText = document.createElement('div');
    innerText.classList.add(`insight-${details.selectorString}-inner-text`);
    innerText.innerText = details.text;

    overlay.appendChild(textWrapper);
    textWrapper.appendChild(innerText);

    overlay.addEventListener('click', (e) => {
      if (serpResult.getAttribute(`${INSIGHT_HIDDEN_RESULT_SELECTOR}-protected`) !== 'true') {
        e.preventDefault();
        const ol = (e.target as Element)?.closest('.insight-hidden');
        ol.parentElement.style.overflow = 'none';
        ol.parentNode.removeChild(ol);
        serpResult.setAttribute(`${INSIGHT_HIDDEN_RESULT_SELECTOR}-protected`, 'true');
      }
    });

    serpResult.style.position = 'relative';
    serpResult.style.overflow = 'hidden';
    serpResult.insertBefore(overlay, serpResult.firstChild);
  }
};

export const processSerpResults: ProcessSerpResults = (
  results,
  containerSelector,
  details,
  augmentations,
) => {
  for (const node of results) {
    if (!(node instanceof HTMLElement)) continue;

    const serpResult = node.closest(containerSelector);

    if (!(serpResult instanceof HTMLElement)) continue;

    const urlProps = extractUrlProperties(
      node instanceof HTMLLinkElement
        ? node.getAttribute('href') // default <a>
        : node?.closest('div:not(div[data-attrid=image]) > a')?.getAttribute('href') ?? // <a> > <cite>
            node?.querySelector('div:not(div[data-attrid=image]) > a')?.getAttribute('href') ?? // featured snippet
            node?.textContent, // guessing
    );

    const serpResultDomain = DOMAINS_TO_RELEVANT_SLICE[urlProps.hostname]
      ? urlProps.full.match(DOMAINS_TO_RELEVANT_SLICE[urlProps.hostname])?.[0] ?? urlProps.hostname
      : urlProps.hostname;

    if (typeof serpResultDomain !== 'string' && typeof augmentations !== 'string') continue;

    let blockers = [];

    serpResult.setAttribute(INSIGHT_SEARCHED_DOMAIN_SELECTOR, serpResultDomain);
    if (typeof augmentations === 'string' || augmentations.block[serpResultDomain]?.length) {
      serpResult.setAttribute(INSIGHT_ALLOWED_RESULT_SELECTOR, 'false');
      // DuckDuckGo result container are bound to click event and open the page, even if it's blocked.
      // To prevent this behavior, we disable all `pointerEvents` on the container element.
      // See: https://developer.mozilla.org/en-US/docs/Web/CSS/pointer-events
      if (window.location.href.search(/duckduckgo\.com/gi) > -1) {
        serpResult.style.pointerEvents = 'none';
      }

      blockers = typeof augmentations === 'string' ? [] : augmentations.block[serpResultDomain];

      createOverlay(serpResult, blockers, details);

      const blockingAugmentationIds = Array.from(new Set(blockers.map(({ id }) => id))).join(' ');

      serpResult.setAttribute(INSIGHT_BLOCKED_BY_SELECTOR, blockingAugmentationIds);
      serpResult.setAttribute(INSIGHT_BLOCKED_DOMAIN_SELECTOR, serpResultDomain);
    } else {
      serpResult.setAttribute(INSIGHT_HIDDEN_RESULT_SELECTOR, 'false');

      // There is two type of allowed results:
      // 1.) Searched by an augmentation's action -> Fill the star icon
      // 2.) Not blocked or searched any augmentation -> Show default gutter unit
      if (augmentations.search[serpResultDomain]?.length) {
        serpResult.setAttribute(INSIGHT_SEARCHED_RESULT_SELECTOR, 'true');
        serpResult.setAttribute(
          INSIGHT_SEARCH_BY_SELECTOR,
          augmentations.search[serpResultDomain].map(({ id }) => id).join(' '),
        );
      } else {
        serpResult.setAttribute(INSIGHT_ALLOWED_RESULT_SELECTOR, 'true');
      }
    }

    if (
      window.location === window.parent.location &&
      serpResult.getAttribute('insight-ad-block') !== 'true'
    ) {
      const buttonRoot = document.createElement('div');

      const root =
        window.location.href.search(/duckduckgo\.com/gi) > -1
          ? serpResult.parentElement
          : serpResult;

      const existingRoot = root.querySelector('.insight-gutter-button-root');
      if (!!existingRoot) {
        existingRoot.parentElement.replaceChild(buttonRoot, existingRoot);
      }
      buttonRoot.classList.add(`insight-gutter-button-root`);
      root.appendChild(buttonRoot);

      render(
        <InlineGutterIcon
          key={uuid()}
          domain={serpResultDomain}
          container={containerSelector}
          searchingAugmentations={augmentations.search[serpResultDomain]}
          blockingAugmentations={blockers}
        />,
        buttonRoot,
      );
    }
  }
};

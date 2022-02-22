/**
 * @module lib:overlay
 * @version 1.0.0
 * @license (C) Insight
 */

import { INSIGHT_BLOCKED, INSIGHT_HIDDEN_RESULT_SELECTOR, SIDEBAR_Z_INDEX } from 'constant';
import { isDark } from 'lib/helpers';

/**
 * Create Result Overlay
 * --------------------------------------
 * Render hiding overlay above a blocked SERP result.
 */
export const createResultOverlay: CreateResultOverlay = (result, blockers, details) => {
  if (!(result instanceof HTMLElement)) return;

  if (result.getAttribute(INSIGHT_HIDDEN_RESULT_SELECTOR) === 'true') {
    const existingOverlay = result.querySelector('.insight-hidden-domain-overlay');
    existingOverlay && existingOverlay.parentElement?.removeChild(existingOverlay);
  }

  if (!blockers?.length) {
    // Assume the overlay triggered by the ad-blocker when blocker list is empty
    result.setAttribute('insight-ad-block', 'true');
  }

  result.setAttribute(INSIGHT_HIDDEN_RESULT_SELECTOR, 'true');
  result.classList.add(INSIGHT_BLOCKED);

  if (
    !result.querySelectorAll('.insight-hidden').length &&
    result.getAttribute(`${INSIGHT_HIDDEN_RESULT_SELECTOR}-protected`) !== 'true'
  ) {
    const overlay = document.createElement('div');
    overlay.classList.add(`insight-${details.selectorString}-overlay`);
    overlay.classList.add('insight-hidden');

    if (isDark()) {
      overlay.classList.add('insight-dark');
    }

    // Z-Index must be one level below of other gutter units to properly show them
    overlay.setAttribute('style', `z-index: ${SIDEBAR_Z_INDEX - 3};`);

    const textWrapper = document.createElement('div');
    textWrapper.classList.add(`insight-${details.selectorString}-text-wrapper`);
    textWrapper.innerText = details.header;

    const innerText = document.createElement('div');
    innerText.classList.add(`insight-${details.selectorString}-inner-text`);
    innerText.innerText = details.text;

    overlay.appendChild(textWrapper);
    textWrapper.appendChild(innerText);

    overlay.addEventListener('click', (e) => {
      if (result.getAttribute(`${INSIGHT_HIDDEN_RESULT_SELECTOR}-protected`) !== 'true') {
        e.preventDefault();
        const root = (e.target as Element)?.closest('.insight-hidden');
        if (root?.parentElement) {
          root.parentElement.style.overflow = 'none';
        }
        if (root?.parentNode) {
          root.parentNode.removeChild(root);
        }
        result.setAttribute(`${INSIGHT_HIDDEN_RESULT_SELECTOR}-protected`, 'true');
        result.classList.remove(INSIGHT_BLOCKED);
      }
    });

    if (blockers?.length) {
      result.style.marginLeft = '-100px';
      result.style.paddingLeft = '100px';
    }
    result.insertBefore(overlay, result.firstChild);
  }
};

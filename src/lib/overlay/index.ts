/**
 * @module utils:createResultOverlay
 * @version 1.0.0
 * @license (C) Insight
 */

import { INSIGHT_HIDDEN_RESULT_SELECTOR, SIDEBAR_Z_INDEX } from 'constant';

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
    result.setAttribute('insight-ad-block', 'true');
  }

  result.setAttribute(INSIGHT_HIDDEN_RESULT_SELECTOR, 'true');

  if (
    !result.querySelectorAll('.insight-hidden').length &&
    result.getAttribute(`${INSIGHT_HIDDEN_RESULT_SELECTOR}-protected`) !== 'true'
  ) {
    const overlay = document.createElement('div');
    overlay.classList.add(`insight-${details.selectorString}-overlay`);
    overlay.setAttribute('style', `z-index: ${SIDEBAR_Z_INDEX - 3};`);
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
      if (result.getAttribute(`${INSIGHT_HIDDEN_RESULT_SELECTOR}-protected`) !== 'true') {
        e.preventDefault();
        const ol = (e.target as Element)?.closest('.insight-hidden');
        if (ol?.parentElement) {
          ol.parentElement.style.overflow = 'none';
        }
        if (ol?.parentNode) {
          ol.parentNode.removeChild(ol);
        }
        result.setAttribute(`${INSIGHT_HIDDEN_RESULT_SELECTOR}-protected`, 'true');
      }
    });

    result.style.maxHeight = '125px';
    result.style.overflow = 'hidden';
    result.insertBefore(overlay, result.firstChild);
  }
};

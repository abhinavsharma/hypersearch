import { SIDEBAR_Z_INDEX } from 'utils/constants';

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
export const hideSerpResults: HideSerpResults = (
  nodes,
  selector,
  { text, header },
  selectorString,
) => {
  for (const node of nodes) {
    const serpResult = node.closest(selector) as HTMLElement;
    if (!serpResult || serpResult.getAttribute('insight-hidden-result') === 'true') continue;

    serpResult.setAttribute('insight-hidden-result', 'true');

    const overlay = document.createElement('div');
    overlay.classList.add(`insight-${selectorString}-overlay`);
    overlay.setAttribute('style', `z-index: ${SIDEBAR_Z_INDEX - 1};`);
    overlay.classList.add('insight-hidden');

    const textWrapper = document.createElement('div');
    textWrapper.classList.add(`insight-${selectorString}-text-wrapper`);
    textWrapper.innerText = header;

    const innerText = document.createElement('div');
    innerText.classList.add(`insight-${selectorString}-inner-text`);
    innerText.innerText = text;

    overlay.appendChild(textWrapper);
    textWrapper.appendChild(innerText);

    overlay.addEventListener('click', (e) => {
      if (serpResult.getAttribute('insight-hidden-result-protected') !== 'true') {
        e.preventDefault();
        const ol = (e.target as Element).closest('.insight-hidden');
        ol.parentElement.style.maxHeight = 'none';
        ol.parentElement.style.overflow = 'auto';
        ol.parentNode.removeChild(ol);
        serpResult.setAttribute('insight-hidden-result-protected', 'true');
      }
    });
    if (
      serpResult.querySelectorAll('.insight-hidden').length === 0 &&
      serpResult.getAttribute('insight-hidden-result-protected') !== 'true'
    ) {
      serpResult.style.position = 'relative';
      serpResult.style.maxHeight = '120px';
      serpResult.style.overflow = 'hidden';
      serpResult.insertBefore(overlay, serpResult.firstChild);
    }
  }
};

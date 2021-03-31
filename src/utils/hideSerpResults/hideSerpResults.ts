import { SIDEBAR_Z_INDEX } from 'utils/constants';

export const hideSerpResults: HideSerpResults = (nodes, selector, { text, header }) => {
  for (const node of nodes) {
    const serpResult = node.closest(selector) as HTMLElement;
    if (!serpResult || serpResult.getAttribute('insight-hidden-result') === 'true') continue;

    serpResult.setAttribute('insight-hidden-result', 'true');

    const overlay = document.createElement('div');
    overlay.setAttribute(
      'style',
      `
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        position: absolute; left: 0; top: 0; right: 0; bottom: 0;
        background: linear-gradient(hsla(0,0%,100%,.9) 0%,#fff);
        z-index: ${SIDEBAR_Z_INDEX - 1};
      `,
    );
    overlay.classList.add('insight-hidden');

    const textWrapper = document.createElement('div');
    textWrapper.setAttribute(
      'style',
      `
        position: absolute; left: 20px; top: 30px;
        font-weight: bold;
        font-size: 24px;
        color:#444;
      `,
    );
    textWrapper.innerText = header;

    const innerText = document.createElement('div');
    innerText.setAttribute(
      'style',
      `
        font-weight: normal;
        margin-top: 10px;
        font-size: 16px;
      `,
    );
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

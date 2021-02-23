import { ReactElement } from 'react';
import { render } from 'react-dom';

/**
 * Takes a HTML element and creates an isolated React application inside.
 *
 * @param element - The HTML element where the React app will be injected
 * @param reactEl - The React Element to render into the passed HTML element
 * @param frameId - The ID of the IFrame where the app will be injected
 */
export const reactInjector = (
  el: HTMLElement,
  reactEl: ReactElement,
  frameId: string,
  styleEl?: HTMLStyleElement,
) => {
  // Create an isolated iframe, preventing all external style modifications.
  const iframe = document.createElement('iframe');
  iframe.id = frameId;

  el.appendChild(iframe);

  const injector = () => {
    // This is the actual document element of the iframe, we can manipulate its content
    // by using the `contentWindow.document` property.
    const doc = iframe.contentWindow.document;
    // Append the style tag to the iframe's head, so styles will be applied.
    doc.getElementsByTagName('head')[0].appendChild(styleEl);
    // Render the react app into the body element.
    doc.getElementsByTagName('html')[0].setAttribute('style', 'overflow: hidden;');
    const div = document.createElement('div');
    const root = doc.body.appendChild(div);
    render(reactEl, root);
  };

  if (navigator.userAgent.search('Firefox') > -1) {
    iframe.src = chrome.runtime.getURL('index.html');
    iframe.onload = () => injector();
  } else {
    injector();
  }
};

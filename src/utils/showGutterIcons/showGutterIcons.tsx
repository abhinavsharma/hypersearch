import React from 'react';
import { render } from 'react-dom';
import { extractUrlProperties } from 'utils/helpers';
import { InlineGutterIcon } from 'modules/gutter/InlineGutterIcon/InlineGutterIcon';

/**
 * Create inline gutter icons for each element of the specified node list
 *
 * @param nodes - The list of nodes
 * @param selector - The closest selector where the icon will be placed
 */
export const showGutterIcons: ShowGutterIcons = (nodes, selector) => {
  for (const node of nodes) {
    const serpResult = node?.closest(`div${selector}`) as HTMLDivElement;
    if (!serpResult) continue;

    serpResult.setAttribute('insight-hidden-result', 'false');

    if (!!serpResult.querySelector('.insight-allowed-gutter-button-root')) {
      return;
    }
    serpResult.setAttribute('insight-allowed-result', 'true');
    serpResult.style.marginLeft = '-100px';
    serpResult.style.paddingLeft = '100px';

    const domain =
      extractUrlProperties(node.querySelector('a')?.getAttribute('href'))?.hostname ||
      extractUrlProperties(node.getAttribute('href'))?.hostname;

    const buttonRoot = document.createElement('div');
    buttonRoot.style.opacity = '0';
    buttonRoot.style.position = 'absolute';
    buttonRoot.style.display = 'block';
    buttonRoot.style.transform = 'translate(-100px, -100%)';
    buttonRoot.style.transition = '100ms all ease-in-out';
    buttonRoot.classList.add(`insight-allowed-gutter-button-root`);
    serpResult.appendChild(buttonRoot);
    render(<InlineGutterIcon augmentations={[]} domain={domain} />, buttonRoot);

    serpResult.addEventListener('mouseenter', () => {
      buttonRoot.style.opacity = '1';
      buttonRoot.setAttribute('insight-show-gutter-icon', 'true');
    });

    serpResult.addEventListener('mouseleave', () => {
      buttonRoot.style.opacity = '0';
      buttonRoot.setAttribute('insight-show-gutter-icon', 'false');
    });

    buttonRoot.addEventListener('mouseleave', () => {
      buttonRoot.style.opacity = '0';
      buttonRoot.setAttribute('insight-show-gutter-icon', 'false');
    });
  }
};

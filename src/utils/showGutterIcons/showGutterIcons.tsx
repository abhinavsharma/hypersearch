import React from 'react';
import { render } from 'react-dom';
import { extractUrlProperties } from 'utils/helpers';
import { InlineGutterIcon } from 'modules/gutter/InlineGutterIcon/InlineGutterIcon';
import { SIDEBAR_Z_INDEX } from 'utils';
import {
  INSIGHT_ALLOWED_RESULT_SELECTOR,
  INSIGHT_HIDDEN_RESULT_SELECTOR,
  INSIGHT_SEARCHED_RESULT_SELECTOR,
} from 'utils/constants';

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

    serpResult.setAttribute(INSIGHT_HIDDEN_RESULT_SELECTOR, 'false');

    serpResult.setAttribute(INSIGHT_ALLOWED_RESULT_SELECTOR, 'true');
    serpResult.style.marginLeft = '-100px';
    serpResult.style.paddingLeft = '100px';

    const domain =
      extractUrlProperties(node.querySelector('a')?.getAttribute('href'))?.hostname ||
      extractUrlProperties(node.getAttribute('href'))?.hostname;

    const isSearched = serpResult.getAttribute(INSIGHT_SEARCHED_RESULT_SELECTOR) === 'true';
    const buttonRoot = document.createElement('div');
    const existingRoot = serpResult.querySelector('.insight-allowed-gutter-button-root');
    if (!!existingRoot) {
      existingRoot.parentElement.replaceChild(buttonRoot, existingRoot);
    }
    buttonRoot.style.opacity = isSearched ? '1' : '0';
    buttonRoot.style.zIndex = isSearched ? String(SIDEBAR_Z_INDEX - 1) : null;
    buttonRoot.style.position = 'absolute';
    buttonRoot.style.display = 'block';
    buttonRoot.style.transform = 'translate(-100px, -100%)';
    buttonRoot.style.transition = '100ms all ease-in-out';
    buttonRoot.classList.add(`insight-allowed-gutter-button-root`);
    serpResult.appendChild(buttonRoot);

    render(
      <InlineGutterIcon augmentations={[]} domain={domain} isSearched={isSearched} />,
      buttonRoot,
    );

    if (!isSearched) {
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
  }
};

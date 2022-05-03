/**
 * @module lib:gutter
 * @version 1.0.0
 * @license (C) Insight
 */

import React from 'react';
import { render } from 'react-dom';
import { v4 as uuid } from 'uuid';
import { extractPublication, extractUrlProperties, removeProtocol } from 'lib/helpers';
import { LeftActionBar } from 'modules/gutter/LeftActionBar/LeftActionBar';
import { RightActionBar } from 'modules/gutter/RightActionBar/RightActionBar';
import { createResultOverlay } from 'lib/overlay';
import {
  INSIGHT_BLOCKED_BY_SELECTOR,
  INSIGHT_FEATURED_BY_SELECTOR,
  INSIGHT_SEARCH_BY_SELECTOR,
  INSIGHT_HAS_CREATED_SUBTAB_SELECTOR,
  INSIGHT_RESULT_URL_SELECTOR,
  INSIGHT_SEARCHED_DOMAIN_SELECTOR,
  INSIGHT_GUTTER_ACTION_BAR_LEFT_SELECTOR,
  INSIGHT_GUTTER_ACTION_BAR_RIGHT_SELECTOR,
  AUGMENTATION_ID,
} from 'constant';

const renderComponentToDocument = (
  root: HTMLElement,
  component: React.ReactElement,
  className: string,
) => {
  const renderRoot = document.createElement('div');
  const existingRoot = root.querySelector(`.${className}`);
  if (existingRoot) {
    existingRoot.parentElement?.replaceChild(renderRoot, existingRoot);
  }
  renderRoot.classList.add(className);
  root.appendChild(renderRoot);
  render(component, renderRoot);
};

/**
 * Process SERP Results
 * --------------------------------------
 * Create gutter unit elements and assign custom attributes to SERP results.
 */
export const processSerpResults: ProcessSerpResults = (
  results,
  containerSelector,
  details,
  augmentations,
  createdUrls = [],
  processAsOpenPage?: boolean,
  processAsAdBlock?: boolean,
) => {
  for (const node of results) {
    if (!(node instanceof HTMLElement)) continue;

    let serpResult = node;

    if (containerSelector) {
      serpResult = node.closest(containerSelector) as HTMLElement;
      if (!(serpResult instanceof HTMLElement)) continue;
    }

    if (processAsAdBlock) {
      createResultOverlay(serpResult, [], details);
      return;
    }

    const resultLink = node.hasAttribute('href')
      ? node.getAttribute('href') // default <a>
      : node?.closest('div:not(div[data-attrid=image]) > a')?.getAttribute('href') ?? // <a> > <cite>
        node
          ?.querySelector('div:not(div[data-attrid=image]) > a cite')
          ?.closest('a')
          ?.getAttribute('href') ?? // featured snippet
        node?.textContent; // guessing

    if (!resultLink?.startsWith('http')) continue;

    const publication = processAsOpenPage
      ? resultLink
      : extractPublication(resultLink) ?? extractUrlProperties(resultLink).hostname ?? '';

    if (!publication && augmentations) continue;

    let blockers: Augmentation[] = [];

    const isTrusted = augmentations?.search[publication].find(
      ({ id }) => id === AUGMENTATION_ID.TRUSTLIST,
    );

    const isBlocked = augmentations?.block[publication].find(
      ({ id }) => id === AUGMENTATION_ID.BLOCKLIST,
    );

    if (isTrusted && !isBlocked && !!augmentations) {
      augmentations.block[publication] = Array(0);
    }

    if (isBlocked && !isTrusted && !!augmentations) {
      augmentations.search[publication] = Array(0);
      augmentations.feature[publication] = Array(0);
    }

    const isSubtab = createdUrls.findIndex((url) =>
      escape(removeProtocol(url)).includes(escape(removeProtocol(resultLink).split('#')[0])),
    );

    if (!serpResult.getAttribute('insight-ad-block')) {
      const overlay = serpResult.querySelector('.insight-hidden-domain-overlay');
      overlay?.parentElement?.removeChild(overlay);
    }

    serpResult.setAttribute(INSIGHT_RESULT_URL_SELECTOR, resultLink);
    serpResult.setAttribute(INSIGHT_HAS_CREATED_SUBTAB_SELECTOR, String(isSubtab > -1));
    serpResult.setAttribute(INSIGHT_SEARCHED_DOMAIN_SELECTOR, publication);

    blockers = augmentations?.block[publication] ?? [];

    if (blockers.length || !augmentations) {
      createResultOverlay(serpResult, blockers, details);
    }

    serpResult.setAttribute(
      INSIGHT_BLOCKED_BY_SELECTOR,
      blockers.map(({ id }) => id).join(' ') ?? '',
    );

    serpResult.setAttribute(
      INSIGHT_SEARCH_BY_SELECTOR,
      augmentations?.search[publication].map(({ id }) => id).join(' ') ?? '',
    );

    serpResult.setAttribute(
      INSIGHT_FEATURED_BY_SELECTOR,
      augmentations?.feature[publication].map(({ id }) => id).join(' ') ?? '',
    );

    if (
      window.location === window.parent.location &&
      serpResult.getAttribute('insight-ad-block') !== 'true'
    ) {
      const root = serpResult;

      if (!(root instanceof HTMLElement)) {
        continue;
      }

      renderComponentToDocument(
        root,
        <LeftActionBar
          key={uuid()}
          publication={publication}
          container={containerSelector}
          searchingAugmentations={augmentations?.search[publication] ?? []}
          blockingAugmentations={blockers}
          featuringAugmentations={augmentations?.feature[publication] ?? []}
        />,
        INSIGHT_GUTTER_ACTION_BAR_LEFT_SELECTOR,
      );

      renderComponentToDocument(
        root,
        <RightActionBar
          key={uuid()}
          url={resultLink}
          container={containerSelector}
          searchingAugmentations={augmentations?.search[publication] ?? []}
          featuringAugmentations={augmentations?.feature[publication] ?? []}
          blockingAugmentations={blockers}
        />,
        INSIGHT_GUTTER_ACTION_BAR_RIGHT_SELECTOR,
      );
    }
  }
};

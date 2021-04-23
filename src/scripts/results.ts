/**
 * @module Results
 * @author Matyas Angyal<matyas@laso.ai>
 * @license (C) Insight
 * @version 1.0.0
 * @description
 *  This script is handling the creation of the inline gutter unit buttons and overlays.
 *  These buttons are created on the left of each SERP result and if a result is blocked,
 *  an overlay will appear above its container element. The script is communicating with
 *  the extension through the window `postMessage` API. Whenever an augmentation has been
 *  processed by AugmentationManager (create, edit, delete ...etc) or loaded to the sidebar,
 *  a message will be sent which triggers an iteration of creating gutter unit elements.
 */

import {
  INSIGHT_ALLOWED_RESULT_SELECTOR,
  INSIGHT_BLOCKED_BY_SELECTOR,
  INSIGHT_BLOCKED_DOMAIN_SELECTOR,
  INSIGHT_HIDDEN_RESULT_SELECTOR,
  INSIGHT_SEARCHED_DOMAIN_SELECTOR,
  INSIGHT_SEARCHED_RESULT_SELECTOR,
  INSIGHT_SEARCH_BY_SELECTOR,
  PROCESS_SERP_OVERLAY_MESSAGE,
  REMOVE_HIDE_DOMAIN_OVERLAY_MESSAGE,
  REMOVE_SEARCHED_DOMAIN_MESSAGE,
  SEARCH_DOMAINS_ACTION,
  SEARCH_HIDE_DOMAIN_ACTION,
} from 'utils/constants';
import { extractUrlProperties } from 'utils/helpers';
import { processSerpResults } from 'utils/processSerpResults/processSerpResults';
import { showGutterIcons } from 'utils/showGutterIcons/showGutterIcons';

const searchedResults: HTMLElement[] = [];
const searchingAugmentations: Record<string, AugmentationObject[]> = Object.create(null);
const blockingAugmentations: Record<string, AugmentationObject[]> = Object.create(null);

((document, window) => {
  const processAugmentation = (
    augmentation: AugmentationObject,
    domain: string,
    result?: HTMLElement,
  ) => {
    if (!augmentation || !domain) return null;
    if (!searchingAugmentations[domain]) searchingAugmentations[domain] = [];
    if (!blockingAugmentations[domain]) blockingAugmentations[domain] = [];
    augmentation.actions?.action_list.forEach(({ value, key }) => {
      if (value.find((valueDomain) => domain === valueDomain)) {
        switch (key) {
          case SEARCH_HIDE_DOMAIN_ACTION:
            if (!blockingAugmentations[domain].find(({ id }) => id === augmentation.id)) {
              blockingAugmentations[domain].push(augmentation);
            }
            break;
          case SEARCH_DOMAINS_ACTION:
            result && searchedResults.push(result);
            if (!searchingAugmentations[domain].find(({ id }) => id === augmentation.id)) {
              searchingAugmentations[domain].push(augmentation);
            }
            break;
        }
      }
    });
  };

  const getResultTypes = (data: ResultMessageData) => {
    if (!data.selector.link) return { alloweds: [], blocks: [] };
    const blocks: HTMLElement[] = [];
    const alloweds: HTMLElement[] = [];
    searchedResults.length = 0; // empty search results
    const results = Array.from(document.querySelectorAll(data.selector.link)) as HTMLElement[];
    const featuredContainers = [];
    const featured = data.selector.featured?.reduce((a, selector) => {
      const partial = Array.from(document.querySelectorAll(selector)) as HTMLElement[];
      featuredContainers.concat(document.querySelectorAll(selector.split(' ')[0]));
      return a.concat(partial);
    }, []) as HTMLElement[];
    [...results, ...featured].forEach((result) => {
      const resultDomain = extractUrlProperties(
        result instanceof HTMLLinkElement
          ? result.getAttribute('href')
          : result?.closest('a').getAttribute('href'),
      )?.hostname;
      if (data.hideDomains?.length) {
        data.hideDomains.forEach((hideDomain) => {
          if (!!hideDomain && resultDomain === hideDomain) {
            if (Array.isArray(data.augmentation)) {
              data.augmentation.forEach((augmentation) =>
                processAugmentation(augmentation, hideDomain),
              );
            } else {
              processAugmentation(data.augmentation, hideDomain);
            }
            featuredContainers.forEach((container) => blocks.push(container));
            blocks.push(result);
          }
        });
      } else {
        alloweds.push(result);
      }
      processAugmentation(data.augmentation, resultDomain, result);
    });
    return { alloweds, blocks };
  };

  const processResults = (data: ResultMessageData) => {
    const { alloweds, blocks } = getResultTypes(data);
    showGutterIcons(alloweds.concat(searchedResults), data.selector.container);
    processSerpResults(
      { block: blocks, search: searchedResults },
      data.selector.container,
      {
        header: null,
        text: null,
      },
      'hidden-domain',
      { block: blockingAugmentations, search: searchingAugmentations },
    );
  };

  window.addEventListener('message', ({ data }: RemoveMessage) => {
    switch (data?.name) {
      // Iterate over the SERP results and check if they searched by the augmentation specified
      // by `data.remove` (augmentation ID). If so, remove the ID from their `searched-by` attribute
      // and in case there is no other augmentation matched to the result, remove the gutter unit.
      case REMOVE_SEARCHED_DOMAIN_MESSAGE:
        if (!data.domain || !data.remove) break;
        searchingAugmentations[data.domain] = (searchingAugmentations[data.domain] ?? []).filter(
          ({ id }) => id !== data.remove,
        );
        const searchedElements = Array.from(
          document.querySelectorAll(`[${INSIGHT_SEARCH_BY_SELECTOR}]`),
        );
        searchedElements.forEach((element) => {
          const idList = element.getAttribute(INSIGHT_SEARCH_BY_SELECTOR).replace(data.remove, '');
          if (element.getAttribute(INSIGHT_SEARCHED_DOMAIN_SELECTOR) !== data.domain) {
            return null;
          }
          element.setAttribute(INSIGHT_SEARCH_BY_SELECTOR, idList);
          element.setAttribute(
            INSIGHT_SEARCHED_RESULT_SELECTOR,
            String(!!idList.split(' ').filter((i) => !!i).length), // "true" | "false"
          );
        });
        processResults(data);
        break;
      // Iterate over the currently blocked SERP results and check if they blocked by the augmentation specified
      // in the message data. When a matching blocked result found, remove the augmentation ID from the "blocked-by"
      // attribute. If there is no more augmentation blocking the results, remove the overlay and set it as allowed.
      case REMOVE_HIDE_DOMAIN_OVERLAY_MESSAGE:
        if (!data.domain || !data.remove) break;
        blockingAugmentations[data.domain] = (blockingAugmentations[data.domain] ?? []).filter(
          ({ id }) => id !== data.remove,
        );
        const blockedElements = Array.from(
          document.querySelectorAll(`[${INSIGHT_BLOCKED_BY_SELECTOR}]`),
        );
        blockedElements.forEach((element) => {
          const ids = element.getAttribute(INSIGHT_BLOCKED_BY_SELECTOR).replace(data.remove, '');
          if (element.getAttribute(INSIGHT_BLOCKED_DOMAIN_SELECTOR) !== data.domain) {
            return null;
          }
          element.parentElement.setAttribute(INSIGHT_HIDDEN_RESULT_SELECTOR, 'false');
          element.parentElement.setAttribute(INSIGHT_ALLOWED_RESULT_SELECTOR, 'true');
          element.setAttribute(INSIGHT_BLOCKED_BY_SELECTOR, ids);
          !ids.split(' ')?.filter((i) => !!i).length && element.parentElement.removeChild(element);
        });
        processResults(data);
        break;
      case PROCESS_SERP_OVERLAY_MESSAGE:
        if (document.readyState === 'interactive' || document.readyState === 'complete') {
          processResults(data);
        }
        break;
    }
  });
})(document, window);

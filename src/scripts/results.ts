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
  PROCESS_SERP_OVERLAY_MESSAGE,
  REMOVE_HIDE_DOMAIN_OVERLAY_MESSAGE,
  REMOVE_SEARCHED_DOMAIN_MESSAGE,
  SEARCH_DOMAINS_ACTION,
  SEARCH_HIDE_DOMAIN_ACTION,
} from 'utils/constants';
import { extractUrlProperties } from 'utils/helpers';
import { processSerpResults } from 'utils/processSerpResults/processSerpResults';
import { showGutterIcons } from 'utils/showGutterIcons/showGutterIcons';

let searchedResults = [];
const searchingAugmentations: Record<string, AugmentationObject[]> = Object.create(null);
const blockingAugmentations: Record<string, AugmentationObject[]> = Object.create(null);

((document, window) => {
  const processAugmentation = (
    augmentation: AugmentationObject,
    domain: string,
    result?: HTMLElement,
  ) => {
    if (!searchingAugmentations[domain]) searchingAugmentations[domain] = [];
    if (!blockingAugmentations[domain]) blockingAugmentations[domain] = [];
    augmentation?.actions?.action_list.forEach((action) => {
      if (action.value.find((valueDomain) => !!domain.match(valueDomain))) {
        switch (action.key) {
          case SEARCH_HIDE_DOMAIN_ACTION:
            if (!blockingAugmentations[domain].find(({ id }) => id === augmentation.id)) {
              blockingAugmentations[domain].push(augmentation);
            }
            break;
          case SEARCH_DOMAINS_ACTION:
            if (!searchingAugmentations[domain].find(({ id }) => id === augmentation.id)) {
              searchingAugmentations[domain].push(augmentation);
              result && searchedResults.push(result);
            }
            break;
        }
      }
    });
  };

  const processResults = (data) => {
    if (!data.selector.link) return { alloweds: [], blocks: [] };
    const blocks = [];
    const alloweds = [];
    searchedResults = [];
    const results = Array.from(document.querySelectorAll(data.selector.link)) as HTMLElement[];
    const featuredContainers = [];
    const featured = data.selector.featured?.reduce((a, selector) => {
      const partial = Array.from(document.querySelectorAll(selector)) as HTMLElement[];
      featuredContainers.push(document.querySelector(selector.split(' ')[0]));
      return a.concat(partial);
    }, []) as HTMLElement[];
    results.forEach((result) => {
      let domainName = '';
      if (result instanceof HTMLLinkElement) {
        domainName = result.getAttribute('href');
      } else {
        domainName = result.closest('a').getAttribute('href');
      }
      if (data.hideDomains?.length) {
        data.hideDomains.forEach((hideDomain) => {
          if (!!domainName.match(hideDomain)) {
            if (Array.isArray(data.augmentation)) {
              data.augmentation.forEach((augmentation) =>
                processAugmentation(augmentation, hideDomain),
              );
            } else {
              processAugmentation(data.augmentation, hideDomain);
            }
            blocks.push(result);
          }
        });
      } else {
        alloweds.push(result);
      }
      processAugmentation(data.augmentation, extractUrlProperties(domainName).hostname, result);
    });
    featured.forEach((result) => {
      let domainName = '';
      if (result instanceof HTMLLinkElement) {
        domainName = result.getAttribute('href');
      } else {
        domainName = result.textContent;
      }
      if (data.hideDomains?.length) {
        data.hideDomains.forEach((domain) => {
          if (domainName.match(domain)?.length) {
            if (Array.isArray(data.augmentation)) {
              data.augmentation.forEach((augmentation) =>
                processAugmentation(augmentation, domain),
              );
            } else {
              processAugmentation(data.augmentation, domain);
            }
            featuredContainers.forEach((container) => blocks.push(container));
          }
        });
      } else {
        alloweds.push(result);
      }
      processAugmentation(data.augmentation, extractUrlProperties(domainName).hostname, result);
    });
    return { alloweds, blocks };
  };

  window.addEventListener(
    'message',
    ({ data }: ProcessSerpOverlayMessage & RemoveHideDomainOverlayMessage) => {
      switch (data?.name) {
        case REMOVE_SEARCHED_DOMAIN_MESSAGE:
          searchingAugmentations[data.domain] = searchingAugmentations[data.domain].filter(
            ({ id }) => id !== data.remove,
          );
          const searchedElements = Array.from(document.querySelectorAll(`[insight-searched-by]`));
          searchedElements.forEach((element) => {
            const searchers = element.getAttribute('insight-searched-by').replace(data.remove, '');
            if (data.domain && element.getAttribute('insight-searched-domain') !== data.domain) {
              return null;
            }
            element.setAttribute(
              'insight-searched-result',
              String(!!searchers.split(' ').filter((i) => !!i).length),
            );
            element.setAttribute('insight-allowed-result', 'true');
            element.setAttribute('insight-searched-by', searchers);
            const { alloweds, blocks } = processResults(data);
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
          });
          break;
        case REMOVE_HIDE_DOMAIN_OVERLAY_MESSAGE:
          blockingAugmentations[data.domain] = blockingAugmentations[data.domain].filter(
            ({ id }) => id !== data.remove,
          );
          const blockedElements = Array.from(document.querySelectorAll(`[insight-blocked-by]`));
          blockedElements.forEach((element) => {
            const blockers = element.getAttribute('insight-blocked-by').replace(data.remove, '');
            if (data.domain && element.getAttribute('insight-blocked-domain') !== data.domain) {
              return null;
            }
            element.parentElement.setAttribute('insight-hidden-result', 'false');
            element.parentElement.setAttribute('insight-allowed-result', 'true');
            element.setAttribute('insight-blocked-by', blockers);
            if (!blockers.split(' ').filter((i) => !!i).length) {
              element.parentElement.removeChild(element);
            }
          });
          break;
        case PROCESS_SERP_OVERLAY_MESSAGE:
          if (document.readyState === 'interactive' || document.readyState === 'complete') {
            const { alloweds, blocks } = processResults(data);
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
          }
          break;
      }
    },
  );
})(document, window);

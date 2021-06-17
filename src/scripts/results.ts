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
const GOOGLE_VERTICAL_NEWS_LINK_SELECTOR = '.EPLo7b a';
const GOOGLE_HORIZONTAL_NEWS_LINK_SELECTOR = '.JJZKK a';

import {
  ACTION_KEYS,
  INSIGHT_BLOCKED_BY_SELECTOR,
  INSIGHT_FEATURED_BY_SELECTOR,
  INSIGHT_HAS_CREATED_SUBTAB_SELECTOR,
  INSIGHT_RESULT_URL_SELECTOR,
  INSIGHT_SEARCH_BY_SELECTOR,
  MY_TRUSTLIST_ID,
  PROCESS_SERP_OVERLAY_MESSAGE,
  SWITCH_TO_TAB,
} from 'utils/constants';
import { debug, extractPublication, runFunctionWhenDocumentReady } from 'utils/helpers';
import { processSerpResults } from 'utils/processSerpResults/processSerpResults';

((document, window) => {
  let openedAlready = false;
  let searchingAugmentations: Record<string, AugmentationObject[]> = Object.create(null);
  let blockingAugmentations: Record<string, AugmentationObject[]> = Object.create(null);
  let featuringAugmentations: Record<string, AugmentationObject[]> = Object.create(null);

  const processAugmentation = (augmentation: AugmentationObject, domain: string): void => {
    if (!augmentation || !domain) return;
    if (!searchingAugmentations[domain]) searchingAugmentations[domain] = [];
    if (!blockingAugmentations[domain]) blockingAugmentations[domain] = [];
    if (!featuringAugmentations[domain]) featuringAugmentations[domain] = [];

    augmentation.actions?.action_list.forEach(({ value, key }) => {
      if (value.find((valueDomain) => domain === valueDomain)) {
        switch (key) {
          case ACTION_KEYS.SEARCH_FEATURE:
            if (!featuringAugmentations[domain].find(({ id }) => id === augmentation.id)) {
              featuringAugmentations[domain].push(augmentation);
            }
            break;
          case ACTION_KEYS.SEARCH_HIDE_DOMAIN:
            if (!blockingAugmentations[domain].find(({ id }) => id === augmentation.id)) {
              blockingAugmentations[domain].push(augmentation);
            }
            break;
          case ACTION_KEYS.SEARCH_DOMAINS:
            if (!searchingAugmentations[domain].find(({ id }) => id === augmentation.id)) {
              searchingAugmentations[domain].push(augmentation);
            }
            break;
        }
      }
    });
  };

  const getResults = (data: ResultMessageData) => {
    if (!data.selector.link) {
      return [];
    }

    const processed: HTMLElement[] = [];

    const processNewsResults = (selector: string) => {
      return Array.from(document.querySelectorAll(selector)).map((el) => {
        // Set default container selector explicitly on the news link's container to ensure
        // news links are handled separately. Otherwise, the whole section would be selected.
        el.closest(selector.split(' ')[0])?.setAttribute(
          data.selector.container.replace(/[^\w-]/gi, ''), // eg.: [data-hveid] -> data-hveid
          'true',
        );
        return el;
      });
    };

    const results = Array.from(document.querySelectorAll(data.selector.link)).concat(
      // handle Google's news results
      document.location.href.match(/google\.[\w]*]/gi)?.length
        ? processNewsResults(GOOGLE_HORIZONTAL_NEWS_LINK_SELECTOR).concat(
            processNewsResults(GOOGLE_VERTICAL_NEWS_LINK_SELECTOR),
          )
        : [],
    ) as HTMLElement[];

    const featuredSnippets = data.selector.featured?.reduce((a, selector) => {
      const link = document.querySelector(selector) as HTMLElement;
      const container = link?.closest(selector.split(' ')[0]) as HTMLElement;
      link && container && a.push({ link, container });
      return a;
    }, [] as Array<Record<'link' | 'container', HTMLElement>>);

    [...featuredSnippets, ...results].forEach((element) => {
      const result = element instanceof HTMLElement ? element : element.link;

      const resultLink =
        result instanceof HTMLLinkElement
          ? result.getAttribute('href')
          : result?.closest('a')?.getAttribute('href');

      if (!resultLink) return;

      const resultDomain = extractPublication(resultLink);

      const container = element instanceof HTMLElement ? result : element.container;

      processed.push(container);

      if (Array.isArray(data.augmentation)) {
        data.augmentation.forEach((augmentation) =>
          processAugmentation(augmentation, resultDomain),
        );
      } else {
        processAugmentation(data.augmentation, resultDomain);
      }
    });
    return processed;
  };

  const processResults = (data: ResultMessageData) => {
    processSerpResults(
      getResults(data),
      data.selector.container,
      {
        header: '',
        text: '',
        selectorString: 'hidden-domain',
      },
      {
        block: blockingAugmentations,
        search: searchingAugmentations,
        feature: featuringAugmentations,
      },
      data.createdUrls,
      !!data.customLink,
    );
    searchingAugmentations = Object.create(null);
    blockingAugmentations = Object.create(null);
    featuringAugmentations = Object.create(null);
  };
  try {
    window.addEventListener('message', ({ data }: RemoveMessage) => {
      if (data?.name === PROCESS_SERP_OVERLAY_MESSAGE) {
        runFunctionWhenDocumentReady(document, function processResultsMessage() {
          processResults(data);
          if (!openedAlready) {
            openedAlready = true;
            const firstSearchedResult = (
              Array.from(
                document.querySelectorAll(`[${INSIGHT_HAS_CREATED_SUBTAB_SELECTOR}]`),
              ) as HTMLDivElement[]
            ).find(
              (result: HTMLElement) =>
                (result?.getAttribute(INSIGHT_SEARCH_BY_SELECTOR)?.includes(MY_TRUSTLIST_ID) ||
                  result?.getAttribute(INSIGHT_FEATURED_BY_SELECTOR)?.length) &&
                !result?.getAttribute(INSIGHT_BLOCKED_BY_SELECTOR),
            );
            firstSearchedResult?.getAttribute(INSIGHT_RESULT_URL_SELECTOR);

            if (firstSearchedResult) {
              chrome.runtime.sendMessage({
                type: SWITCH_TO_TAB,
                url: firstSearchedResult.getAttribute(INSIGHT_RESULT_URL_SELECTOR),
              });
            }
          }
        });
      }
    });
  } catch (err) {
    debug('results listener - error', err);
  }
})(document, window);

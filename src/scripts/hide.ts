import {
  PROCESS_SERP_OVERLAY_MESSAGE,
  REMOVE_HIDE_DOMAIN_OVERLAY_MESSAGE,
  SEARCH_HIDE_DOMAIN_ACTION,
} from 'utils/constants';
import { hideSerpResults } from 'utils/hideSerpResults/hideSerpResults';
import { showGutterIcons } from 'utils/showGutterIcons/showGutterIcons';

const blockingAugmentations: Record<string, AugmentationObject[]> = Object.create(null);

((document, window) => {
  const getBlockingAugmentation = (augmentation: AugmentationObject, domain: string) => {
    augmentation?.actions.action_list.forEach((action) => {
      if (action.key === SEARCH_HIDE_DOMAIN_ACTION && action.value[0] === domain) {
        if (!blockingAugmentations[domain]) {
          blockingAugmentations[domain] = [];
        }
        !blockingAugmentations[domain].find(({ id }) => id === augmentation.id) &&
          blockingAugmentations[domain].push(augmentation);
      }
    });
  };

  const processResults = (data) => {
    const blocks = [];
    const alloweds = [];
    const results = Array.from(document.querySelectorAll(data.selector.link)) as HTMLElement[];
    const featuredContainers = [];
    const featured = data.selector.featured?.reduce((a, selector) => {
      const partial = Array.from(document.querySelectorAll(selector)) as HTMLElement[];
      featuredContainers.push(document.querySelector(selector.split(' ')[0]));
      return a.concat(partial);
    }, []) as HTMLElement[];
    results.forEach((result) => {
      if (data.hideDomains.length) {
        data.hideDomains.forEach((domain) => {
          let domainName = '';
          if (result instanceof HTMLLinkElement) {
            domainName = result.getAttribute('href');
          } else {
            domainName = result.textContent;
          }
          if (domainName.match(domain)?.length) {
            if (Array.isArray(data.augmentation)) {
              data.augmentation.forEach((augmentation) =>
                getBlockingAugmentation(augmentation, domain),
              );
            } else {
              getBlockingAugmentation(data.augmentation, domain);
            }
            blocks.push(result);
          }
        });
      } else {
        alloweds.push(result);
      }
    });
    featured.forEach((result) => {
      if (data.hideDomains.length) {
        data.hideDomains.forEach((domain) => {
          let domainName = '';
          if (result instanceof HTMLLinkElement) {
            domainName = result.getAttribute('href');
          } else {
            domainName = result.textContent;
          }
          if (domainName.match(domain)?.length) {
            if (Array.isArray(data.augmentation)) {
              data.augmentation.forEach((augmentation) =>
                getBlockingAugmentation(augmentation, domain),
              );
            } else {
              getBlockingAugmentation(data.augmentation, domain);
            }
            featuredContainers.forEach((container) => blocks.push(container));
          }
        });
      } else {
        alloweds.push(result);
      }
    });
    return { alloweds, blocks };
  };

  window.addEventListener('message', ({ data }) => {
    switch (data?.name) {
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
          showGutterIcons(alloweds, data.selector.container);
          hideSerpResults(
            blocks,
            data.selector.container,
            {
              header: null,
              text: null,
            },
            'hidden-domain',
            blockingAugmentations,
          );
        }
        break;
    }
  });
})(document, window);

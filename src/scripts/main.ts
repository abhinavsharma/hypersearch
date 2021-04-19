import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import {
  keyboardHandler,
  keyUpHandler,
  hideSerpResults,
  debug,
  showGutterIcons,
  replaceLocation,
  URL_UPDATED_MESSAGE,
  REMOVE_HIDE_DOMAIN_OVERLAY_MESSAGE,
  PROCESS_SERP_OVERLAY_MESSAGE,
  SEARCH_HIDE_DOMAIN_ACTION,
} from 'utils';

(async (document: Document, location: Location) => {
  debug(
    'execute content script\n---\n\tCurrent Location',
    location.href,
    '\n\tProject --- ',
    process.env.PROJECT === 'is' ? 'Insight' : 'SearchClub',
    '\n---',
  );
  const handleKeyDown = (event: KeyboardEvent) => keyboardHandler(event, SidebarLoader);
  const handleKeyUp = (event: KeyboardEvent) => keyUpHandler(event);
  document.addEventListener('keydown', handleKeyDown, true);
  document.addEventListener('keyup', handleKeyUp, true);
  const blockingAugmentations: Record<string, AugmentationObject[]> = Object.create(null);
  window.top.addEventListener('message', ({ data }) => {
    switch (data?.name) {
      case REMOVE_HIDE_DOMAIN_OVERLAY_MESSAGE:
        blockingAugmentations[data.domain].filter(({ id }) => id !== data.remove);
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
                data.augmentation?.actions.action_list.forEach((action) => {
                  if (action.key === SEARCH_HIDE_DOMAIN_ACTION && action.value[0] === domain) {
                    if (!blockingAugmentations[domain]) {
                      blockingAugmentations[domain] = [];
                    }
                    !blockingAugmentations[domain].find(({ id }) => id === data.augmentation.id) &&
                      blockingAugmentations[domain].push(data.augmentation);
                  }
                });
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
                data.augmentation?.actions.action_list.forEach((action) => {
                  if (action.key === SEARCH_HIDE_DOMAIN_ACTION && action.value[0] === domain) {
                    if (!blockingAugmentations[domain]) {
                      blockingAugmentations[domain] = [];
                    }
                    !blockingAugmentations[domain].find(({ id }) => id === data.augmentation.id) &&
                      blockingAugmentations[domain].push(data.augmentation);
                  }
                });
                featuredContainers.forEach((container) => blocks.push(container));
              }
            });
          } else {
            alloweds.push(result);
          }
        });
        if (document.readyState === 'interactive' || document.readyState === 'complete') {
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
            true,
          );
        }
        break;
    }
  });
  const url = replaceLocation(location);
  await SidebarLoader.loadOrUpdateSidebar(document, url);
  chrome.runtime.onMessage.addListener(async (msg) => {
    if (msg.type === URL_UPDATED_MESSAGE) {
      await SidebarLoader.loadOrUpdateSidebar(document, url);
    }
  });
})(document, location);

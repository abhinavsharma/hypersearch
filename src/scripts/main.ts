import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import { debug, HIDE_DOMAINS_MESSAGE, hideSerpResults } from 'utils';

(async (document: Document, location: Location) => {
  debug(
    'execute content script\n---\n\tCurrent Location',
    location.href,
    '\n\tProject --- ',
    process.env.PROJECT === 'is' ? 'Insight' : 'SearchClub',
    '\n---',
  );
  let blockingAugmentations: AugmentationObject[] = [];
  window.top.addEventListener('message', ({ data }) => {
    if (data.name === HIDE_DOMAINS_MESSAGE) {
      if (data.remove) {
        blockingAugmentations = blockingAugmentations.filter(({ id }) => id !== data.remove);
        const blockedElements = Array.from(document.querySelectorAll(`[insight-blocked-by]`));
        blockedElements.forEach((element) => {
          const blockers = element.getAttribute('insight-blocked-by').replace(data.remove, '');
          element.setAttribute('insight-blocked-by', blockers);
          if (!blockers.split(' ').filter((i) => !!i).length) {
            element.parentElement.removeChild(element);
          }
          const button = element.querySelector(`#${data.remove}`);
          button.parentElement.removeChild(button);
        });
      } else {
        if (!blockingAugmentations.find(({ id }) => id === data.augmentation?.id)) {
          blockingAugmentations.push(data.augmentation);
        }
        const blocks = [];
        const results = Array.from(document.querySelectorAll(data.selector.link)) as HTMLElement[];
        results.forEach((result) => {
          data.hideDomains.forEach((domain) => {
            let domainName = '';
            if (result instanceof HTMLLinkElement) {
              domainName = result.getAttribute('href');
            } else {
              domainName = result.textContent;
            }
            if (domainName.match(domain)?.length) {
              blocks.push(result);
            }
          });
        });

        if (document.readyState === 'complete' || document.readyState === 'interactive')
          hideSerpResults(
            blocks,
            data.selector.container,
            {
              header: `🙈 Result muted by lens`,
              text: 'Click to show',
            },
            'hidden-domain',
            blockingAugmentations,
          );
      }
    }
  });
  const url = new URL(location.href);
  await SidebarLoader.loadOrUpdateSidebar(document, url);
})(document, location);

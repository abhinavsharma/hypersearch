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
  window.top.addEventListener('message', ({ data }) => {
    if (data.name === HIDE_DOMAINS_MESSAGE) {
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

      hideSerpResults(
        blocks,
        data.selector.container,
        {
          header: 'Hidden',
          text: 'Click to show hidden result',
        },
        'hidden-domain',
      );
    }
  });
  const url = new URL(location.href);
  await SidebarLoader.loadOrUpdateSidebar(document, url);
})(document, location);

import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import { debug, extractUrlProperties, HIDE_DOMAINS_MESSAGE } from 'utils';
import { hideSerpResults } from 'utils/hideSerpResults/hideSerpResults';

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
      const results = Array.from(document.querySelectorAll(data.selector)) as HTMLElement[];
      results.forEach((result) => {
        data.hideDomains.forEach((domain) => {
          let domainName = '';
          if (result instanceof HTMLLinkElement) {
            domainName = result.getAttribute('href');
          } else {
            domainName = result.textContent;
          }
          console.log(domainName);
          if (domainName.match(domain)?.length) {
            blocks.push(result);
          }
        });
      });

      let parentSelector = '';

      switch (extractUrlProperties(location.href).hostname) {
        case 'google.com':
          parentSelector = '[data-hveid]';
          break;
        case 'duckduckgo.com':
          parentSelector = '.result__body';
          break;
        case 'bing.com':
          parentSelector = '.b_algo';
          break;
      }

      hideSerpResults(blocks, parentSelector, {
        header: 'Hidden',
        text: 'Click to show hidden result',
      });
    }
  });
  const url = new URL(location.href);
  await SidebarLoader.loadOrUpdateSidebar(document, url);
})(document, location);

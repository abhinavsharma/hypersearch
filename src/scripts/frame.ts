import { debug, extractUrlProperties, getRankedDomains } from 'utils/helpers';

const GOOGLE_SERP_RESULT_DIV_SELECTOR = '.mnr-c.xpd';
const GOOGLE_SERP_RESULT_A_SELECTOR = '.KJDcUb a.BmP5tf';
const GOOGLE_SERP_RESULT_DOMAIN_SELECTOR_FULL = '.mnr-c .KJDcUb a.BmP5tf';

((document, window) => {
  // not exactly ad blocking but removing known bad components
  const toRemove = {
    'google.com': [
      'header.Fh5muf',
      '.mnr-c.cUnQKe',
      '.mnr-c.AuVD',
      '[data-has-queries]',
      '.commercial-unit-mobile-top',
    ],
    'bing.com': ['header#b_header'],
    'duckduckgo.com': ['div#header_wrapper', '.search-filters-wrap'],
  };

  const removeElement = (el) => {
    el.removeAttribute('jscontroller');
    el.removeAttribute('jsaction');
    el.removeAttribute('data-ved');
    el.parentNode.removeChild(el);
  };

  // Remove Accelerated Modile Page references and make them open in a new browser tab.
  // This script will be injected in the parent document as well as the sidebar.
  const cleanUp = () => {
    document.querySelectorAll('a.amp_r').forEach((a: HTMLLinkElement) => {
      a.href = a.getAttribute('href');
      if (a.href.indexOf('?') === -1) a.href = a.href + '?';
      a.removeAttribute('data-amp');
      a.removeAttribute('data-amp-cur');
      a.removeAttribute('data-amp-title');
      a.removeAttribute('data-amp-vgi');
      a.removeAttribute('oncontextmenu');
      a.removeAttribute('jsaction');
      a.removeAttribute('data-ved');
      a.removeAttribute('ping');
    });

    document.querySelectorAll('span[aria-label="AMP logo"]').forEach((a: HTMLLinkElement) => {
      a.style.display = 'none';
    });

    document.querySelectorAll('.jGGQ5e').forEach((div: HTMLDivElement) => {
      div.removeAttribute('jscontroller');
      div.removeAttribute('jsaction');
      div.removeAttribute('jsdata');
      div.removeAttribute('jsname');
    });

    let hostname = new URL(window.location.href).hostname;

    if (hostname.startsWith('www.')) {
      hostname = hostname.slice(4);
    }

    if (hostname in toRemove) {
      for (const selector of toRemove[hostname]) {
        document.querySelectorAll(selector).forEach((a: HTMLElement) => removeElement(a));
      }
    }
  };

  if (window.location !== window.parent.location) {
    window.setInterval(() => {
      document.querySelectorAll('a').forEach((linkElement) => {
        const target = linkElement.getAttribute('target');
        if (target !== '_blank') linkElement.setAttribute('target', '_blank');
        if (
          linkElement.innerHTML?.search('amp.reddit') > -1 ||
          linkElement.getAttribute('href')?.search('amp.reddit') > -1
        ) {
          linkElement.innerHTML = linkElement.innerHTML.replace('amp.reddit', 'www.reddit');
          linkElement.setAttribute(
            'href',
            linkElement.getAttribute('href')?.replace('amp.reddit', 'www.reddit'),
          );
          linkElement.setAttribute('target', '_blank');
          linkElement.removeAttribute('data-amp-cdn');
          linkElement.removeAttribute('data-amp-sxg');
          linkElement.removeAttribute('data-ved');
          linkElement.removeAttribute('rel');
        }
      });
      cleanUp();
      document.getElementsByTagName('html')[0]?.classList.remove('is-not-mobile-device');
    }, 500);

    document.addEventListener('DOMNodeInserted', cleanUp);
    document.addEventListener('DOMContentLoaded', cleanUp);
    cleanUp();
  }

  document.addEventListener('DOMContentLoaded', () => {
    const domainsContainer = document.querySelector('#message.results--message');
    domainsContainer?.setAttribute('style', 'display: none;');

    if (window.location.href.search(/google\.com/gi) > -1) {
      const resultNodes = Array.from(
        document.querySelectorAll(GOOGLE_SERP_RESULT_DIV_SELECTOR),
      ) as HTMLElement[];
      const domains = Array.from(
        document.querySelectorAll(GOOGLE_SERP_RESULT_DOMAIN_SELECTOR_FULL),
      ).map(({ href }: HTMLLinkElement) => extractUrlProperties(href).hostname);
      const rankedDomains = getRankedDomains(domains);
      const topPositions = resultNodes.slice(0, 3);
      const movedDomains = [];
      const logData = [];
      resultNodes.forEach((node, index) => {
        const nodeDomain = extractUrlProperties(
          node.querySelector(GOOGLE_SERP_RESULT_A_SELECTOR).getAttribute('href'),
        ).hostname;
        const rankedPosition = rankedDomains.indexOf(nodeDomain);
        if (
          // Only consider results that are out of top 3 serp results,
          // not moved yet and present in top 3 ranked results.
          index > 2 &&
          !movedDomains.find(
            (domain) => nodeDomain.search(domain) > -1 || domain.search(nodeDomain) > -1,
          ) &&
          rankedPosition < 3
        ) {
          logData.push({
            'Domain:': nodeDomain,
            'Move from index: ': index,
            'Move to index: ': movedDomains.length,
          });
          // Due to Google's complex nesting, it's easier to replace the elements with
          // their clone, instead bothering the parent elements at all.
          const originalClone = topPositions[movedDomains.length].cloneNode(true);
          const replaceClone = resultNodes[index].cloneNode(true);
          topPositions[movedDomains.length].replaceWith(replaceClone);
          resultNodes[index].replaceWith(originalClone);
          movedDomains.push(nodeDomain);
        }
      });
      !!logData.length && debug('Reordered SERP results\n---\n', ...logData, '\n---');
    }
  });
})(document, window);

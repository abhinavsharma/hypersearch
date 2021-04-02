import { debug, extractUrlProperties, getRankedDomains } from 'utils/helpers';

const GOOGLE_SERP_RESULT_DIV_SELECTOR = '.mnr-c.xpd';
const GOOGLE_SERP_RESULT_A_SELECTOR = '.KJDcUb a.BmP5tf';
const GOOGLE_SERP_RESULT_DOMAIN_SELECTOR_FULL = '.mnr-c.xpd .KJDcUb a.BmP5tf';

((document, window) => {
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
      const domNode = node.querySelector(GOOGLE_SERP_RESULT_A_SELECTOR);
      if (!domNode) return null;
      const nodeDomain = extractUrlProperties(domNode.getAttribute('href'))?.hostname;
      const rankedPosition = rankedDomains.indexOf(nodeDomain);
      if (
        // Only consider results that are out of top 3 serp results,
        // not moved yet and present in top 3 ranked results.
        index > 2 &&
        !movedDomains.find(
          (domain) => nodeDomain.search(domain) > -1 || domain.search(nodeDomain) > -1,
        ) &&
        rankedPosition < 3 &&
        rankedPosition > -1
      ) {
        logData.push('\n\t', {
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
    !!logData.length && debug('Reordered SERP results\n---', ...logData, '\n---');
  }
})(document, window);

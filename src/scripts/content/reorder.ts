import { debug, extractUrlProperties } from 'lib/helpers';
import {
  GOOGLE_SERP_RESULT_A_SELECTOR,
  GOOGLE_SERP_RESULT_CONTAINER,
  GOOGLE_SERP_RESULT_DIV_SELECTOR,
} from 'constant';

((document, window) => {
  // First X results to replace with unique results.
  const MAXIMUM_MOVES = 3;

  // Currently we support only Google SERP reordering.
  if (window.location.href.search(/google\.[\w]*]/gi) === -1) return;

  // The list of individual search results. Google occasionally merges more results into one container
  // so we need to use a more specific selector to get the unique result blocks from the SERP.
  const results = Array.from(document.querySelectorAll(GOOGLE_SERP_RESULT_DIV_SELECTOR)).map((el) =>
    el.closest(GOOGLE_SERP_RESULT_CONTAINER),
  ) as HTMLElement[];

  // The list of elements that could be replaced by a higher ranked result.
  const topResults = results.slice(0, MAXIMUM_MOVES);

  // Reordered list of the available domains from SERP. Ordering is made by the unique domains
  // appearance count and their original position in the results page.
  //const rankedDomains = getRankedDomains(domains);

  // The list of elements that has been already moved.
  const movedDomains: string[] = [];

  /** DEV START **/
  const logData: any[] = [];
  /** DEV END **/

  results.forEach((node, index) => {
    const linkElement = node.querySelector(GOOGLE_SERP_RESULT_A_SELECTOR);

    if (!linkElement) return;

    const domain =
      extractUrlProperties(
        linkElement.getAttribute('href')?.replace(/.*https?:\/\//, 'https://') ?? '',
      ).hostname ?? '';

    const isMoved = !!movedDomains.find(
      (movedDomain) => domain.search(movedDomain) > -1 || movedDomain.search(domain) > -1,
    );

    if (
      !isMoved && // Ignore if already moved
      index > topResults.length - 1 && // Ignore the first three results
      movedDomains.length < MAXIMUM_MOVES // Only replace top results
    ) {
      // Due to Google's complex nesting, it's easier to replace the elements with
      // their clone, instead bothering the parent elements at all.
      const originalClone = topResults[movedDomains.length].cloneNode(true);
      const replaceClone = node.cloneNode(true);
      topResults[movedDomains.length].replaceWith(replaceClone);
      node.replaceWith(originalClone);

      movedDomains.push(domain);

      /** DEV START **/
      logData.push('\n\t', {
        Domain: domain,
        'Move from index': index,
        'Move to index': movedDomains.length,
      });
      /** DEV END **/
    }
  });

  /** DEV START **/
  !!logData.length && debug('Reordered SERP results\n---', ...logData, '\n---');
  /** DEV END **/
})(document, window);

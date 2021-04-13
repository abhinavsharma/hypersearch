/**
 * @module Reorder
 * @author Matyas Angyal<matyas@laso.ai>
 * @license (C) Insight
 * @version 1.0.0
 * @description
 *  This script is reordering the results of a search results page
 *  to let the top three results be always unique. It will consider
 *  the individual results ranking among other results and prefer
 *  moving higher ranked results to the top, respecting the diversity.
 *  The script need to be run when the document is ready and results
 *  are rendered, also any other modification have been completed.
 */

import { debug, extractUrlProperties, getRankedDomains } from 'utils/helpers';

// First X results to replace with unique results.
const MAXIMUM_MOVES = 3;

// Consider results if its domain is ranked at least X.
const MINIMUM_RANK = 3;

const GOOGLE_SERP_RESULT_DIV_SELECTOR = '.mnr-c.xpd > .KJDcUb';
const GOOGLE_SERP_RESULT_A_SELECTOR = '.KJDcUb a.BmP5tf';
const GOOGLE_SERP_RESULT_DOMAIN_SELECTOR_FULL = '.mnr-c.xpd > .KJDcUb a.BmP5tf';

((document, window) => {
  // Currently we support only Google SERP reordering.
  if (window.location.href.search(/google\.com/gi) === -1) return;

  // The list of individual search results. Google occasionaly merges more results into one container
  // so we need to use a more specific selector to get the unique result blocks from the SERP.
  const results = Array.from(document.querySelectorAll(GOOGLE_SERP_RESULT_DIV_SELECTOR)).map(
    ({ parentNode }) => parentNode,
  ) as HTMLElement[];

  // Google tends to use absolute URLs. Because of this, we extract the actual URL and get its hostname.
  // We use these domains to compare the results and reorder the list accordingly.
  const domains = Array.from(
    document.querySelectorAll(GOOGLE_SERP_RESULT_DOMAIN_SELECTOR_FULL),
  ).map(
    ({ href }: HTMLLinkElement) =>
      extractUrlProperties(href.replace(/.*https?:\/\//, 'https://')).hostname,
  );

  // The list of elements that could be replaced by a higher ranked result.
  const topResults = results.slice(0, MAXIMUM_MOVES);

  // Reordered list of the available domains from SERP. Ordering is made by the unique domains
  // appearence count and their original position in the results page.
  const rankedDomains = getRankedDomains(domains);

  // The list of elements that has been already moved.
  const movedDomains = [];

  /** DEV START **/
  const logData = [];
  /** DEV END **/

  results.forEach((node, index) => {
    const linkElement = node.querySelector(GOOGLE_SERP_RESULT_A_SELECTOR);

    const domain = extractUrlProperties(
      linkElement.getAttribute('href').replace(/.*https?:\/\//, 'https://'),
    ).hostname;

    const rankedPosition = rankedDomains.indexOf(domain);

    const isMoved = !!movedDomains.find(
      (movedDomain) => domain.search(movedDomain) > -1 || movedDomain.search(domain) > -1,
    );

    if (
      !isMoved && // Ignore if already moved
      index > topResults.length - 1 && // Ignore the first three results
      rankedPosition < MINIMUM_RANK && // Ignore if the domain is underranked
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
        'Domain:': domain,
        'Move from index: ': index,
        'Move to index: ': movedDomains.length,
      });
      /** DEV END **/
    }
  });

  /** DEV START **/
  !!logData.length && debug('Reordered SERP results\n---', ...logData, '\n---');
  /** DEV END **/
})(document, window);

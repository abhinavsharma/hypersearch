import { BLOCKED_ADS } from 'utils/constants';
import { processSerpResults } from 'utils/processSerpResults/processSerpResults';

(() => {
  const host = document.location.host.replace('www.', '');
  const adBlocks = BLOCKED_ADS.filter((adBlock) => {
    const site = adBlock.site.split(',');
    return site.includes(host);
  });
  adBlocks.forEach((adBlock) => {
    const adText = adBlock.adText.split(',');
    const adTextContainer = adBlock.adTextContainer || 'span';
    const adElementSelector = adBlock.adElementSelector;
    setInterval(() => {
      let node: HTMLElement;
      const search = adText.map((adText) => "normalize-space()='" + adText + "'").join(' or ');
      const xpath = '//' + adTextContainer + '[' + search + ']';
      const matchingElements = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);
      const block: HTMLElement[] = [];
      while ((node = matchingElements.iterateNext() as HTMLElement)) {
        node && block.push(node);
      }
      processSerpResults(
        { block, search: [] },
        adElementSelector,
        { header: 'Ad', text: 'Click to show likely ad.' },
        'blocked-ad',
      );
    }, 1000);
  });
})();

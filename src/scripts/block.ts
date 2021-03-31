import { BLOCKED_ADS } from 'utils/constants';
import { hideSerpResults } from 'utils/hideSerpResults/hideSerpResults';

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
      const nodes: HTMLElement[] = [];
      while ((node = matchingElements.iterateNext() as HTMLElement)) {
        node && nodes.push(node);
      }
      hideSerpResults(
        nodes,
        adElementSelector,
        { header: 'Ad', text: 'Click to show likely ad.' },
        'blocked-ad',
      );
    }, 1000);
  });
})();

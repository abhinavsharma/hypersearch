import { runFunctionWhenDocumentReady } from 'utils';
import { BLOCKED_ADS } from 'utils/constants';
import { processSerpResults } from 'utils/processSerpResults/processSerpResults';

((document) => {
  const originalHost = document.location.host.replace('www.', '');
  const host =
    originalHost.search(/google\.[\w]*/) > -1
      ? originalHost.replace(/\.[\w.]*$/, '.com')
      : originalHost;

  const adBlocks = BLOCKED_ADS.filter((adBlock) => {
    const site = adBlock.site.split(',');
    return site.includes(host);
  });

  const runAdBlock = () => {
    setTimeout(() => {
      adBlocks.forEach((adBlock) => {
        const adText = adBlock.adText.split(',');
        const adTextContainer = adBlock.adTextContainer || 'span';
        const adElementSelector = adBlock.adElementSelector;
        let node: HTMLElement;
        const search = adText.map((adText) => "normalize-space()='" + adText + "'").join(' or ');
        const xpath = '//' + adTextContainer + '[' + search + ']';
        const matchingElements = document.evaluate(
          xpath,
          document,
          null,
          XPathResult.ANY_TYPE,
          null,
        );
        const blockedResults: HTMLElement[] = [];
        while ((node = matchingElements.iterateNext() as HTMLElement)) {
          node && blockedResults.push(node);
        }
        processSerpResults(
          blockedResults,
          adElementSelector,
          {
            header: 'Ad',
            text: 'Click to show likely ad.',
            selectorString: 'blocked-ad',
            hoverAltered: false,
          },
          'adblock',
        );
      });
    }, 500);
  };

  runFunctionWhenDocumentReady(document, runAdBlock);
})(document);

import { BLOCKED_ADS } from 'constant';
import { runFunctionWhenDocumentReady } from 'lib/helpers';
import { processSerpResults } from 'lib/gutter';

declare type AdBlock = {
  site: string;
  adText: string;
  adElementSelector: string;
  delay?: number;
}

((document) => {
  const originalHost = document.location.host.replace(/^www(\d)?\./, '');
  const host =
    originalHost.search(/google\.[\w]*/) > -1
      ? originalHost.replace(/\.[\w.]*$/, '.com')
      : originalHost;

  const adBlocks: AdBlock[] = BLOCKED_ADS.filter((adBlock) => {
    const site = adBlock.site.split(',');
    return site.includes(host);
  });

  const runAdBlock = () => {
    setTimeout(() => {
      adBlocks.forEach((adBlock) => {
        const adText = adBlock.adText.split(',');
        const adTextContainer = (adBlock as any).adTextContainer ?? 'span';
        const adElementSelector = adBlock.adElementSelector;
        let node: HTMLElement;
        const search = adText.map((adText) => "normalize-space()='" + adText + "'").join(' or ');
        const xpath = '//' + adTextContainer + '[' + search + ']';

        const delay = adBlock.delay ?? 0;

        setTimeout(() => {
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
            },
            null,
            [],
            undefined,
            true,
          );
        }, delay);
      });
    }, 500);
  };

  runFunctionWhenDocumentReady(document, runAdBlock);
})(document);

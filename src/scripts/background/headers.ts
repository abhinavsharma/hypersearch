/**
 * @module scripts:background
 * @version 1.0.0
 * @license (C) Insight
 */

import { EXTENSION_SHORT_URL_RECEIVED, PUBLICATION_REDIRECT_URL } from 'constant';
import {
  applyResponseHeaderModifications,
  applyRequestHeaderMutations,
  debug,
  isFirefox,
  extractPublication,
  extractUrlProperties,
} from 'lib/helpers';

//-----------------------------------------------------------------------------------------------
// ! Runtime
//-----------------------------------------------------------------------------------------------
(() => {
  const OPTIONS = {
    urls: ['<all_urls>'],
  } as unknown as Record<'urls' | 'types', chrome.webRequest.ResourceType[]>;

  const EXTRA_SPEC = ['blocking'];

  const EXTRA_RESPONSE_HEADERS = [
    {
      name: 'Content-Security-Policy',
      value: `frame-ancestors *`,
    },
    {
      name: 'Access-Control-Allow-Origin',
      value: '*',
    },
  ];

  //-----------------------------------------------------------------------------------------------
  // ! On Headers Received
  //-----------------------------------------------------------------------------------------------
  chrome.webRequest.onHeadersReceived.addListener(
    ({ responseHeaders, url }) => {
      if (chrome.runtime.lastError?.message || !responseHeaders || !url) {
        debug(
          'OnBeforeHeadersReceived - Error',
          chrome.runtime.lastError?.message,
          responseHeaders,
          url,
        );
      }

      return {
        responseHeaders: [
          ...applyResponseHeaderModifications(url, responseHeaders ?? []),
          ...EXTRA_RESPONSE_HEADERS,
        ],
      };
    },
    { ...OPTIONS, types: ['sub_frame'] },
    isFirefox()
      ? EXTRA_SPEC.concat(['extraHeaders', 'responseHeaders'])
      : EXTRA_SPEC.concat('responseHeaders'),
  );

  //-----------------------------------------------------------------------------------------------
  // ! On Before Send Headers
  //-----------------------------------------------------------------------------------------------
  chrome.webRequest.onBeforeSendHeaders.addListener(
    ({ requestHeaders = [], url, frameId }) => {
      if (url.search(/https:\/\/extensions\.insightbrowser\.com\/extend\/[\w]*/gi) > -1) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (chrome.runtime.lastError?.message) {
            debug('Chrome Last Error', chrome.runtime.lastError?.message);
          }
          for (let i = 0; i < tabs?.length ?? 0; ++i) {
            chrome.tabs.sendMessage(tabs[i]?.id ?? -1, {
              type: EXTENSION_SHORT_URL_RECEIVED,
              shortUrl: url,
            });
          }
        });
      }

      chrome.cookies.getAll({ name: '_sso.key' }, (cookies) => {
        const ssoCookie = cookies[0];
        if (ssoCookie) {
          chrome.cookies.set({
            domain: ssoCookie.domain,
            expirationDate: ssoCookie.expirationDate,
            httpOnly: true,
            name: '_sso.key',
            path: '/',
            value: ssoCookie.value,
            url: 'https://bookface.ycombinator.com',
            sameSite: 'no_restriction',
            secure: true,
          });
        }
      });

      return { requestHeaders: applyRequestHeaderMutations(requestHeaders, url, frameId) };
    },
    OPTIONS,
    EXTRA_SPEC.concat('requestHeaders'),
  );

  //-----------------------------------------------------------------------------------------------
  // ! On Before Redirect
  //-----------------------------------------------------------------------------------------------
  chrome.webRequest.onBeforeRedirect.addListener(
    async (details) => {
      debug('Redirect: ', details.redirectUrl, details.url);
      const publication = extractPublication(details.url);
      if (publication) {
        await new Promise((resolve) =>
          chrome.storage.local.set(
            {
              [`${PUBLICATION_REDIRECT_URL}-${
                extractPublication(details.redirectUrl) ||
                extractUrlProperties(details.redirectUrl).hostname
              }`]: {
                from: extractPublication(details.url),
                to:
                  extractPublication(details.redirectUrl) ||
                  extractUrlProperties(details.redirectUrl).hostname,
              },
            },
            () => resolve(true),
          ),
        );
      }
    },
    OPTIONS,
    ['extraHeaders'],
  );
})();

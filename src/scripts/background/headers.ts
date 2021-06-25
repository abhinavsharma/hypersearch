/**
 * @module scripts:background
 * @version 1.0.0
 * @license (C) Insight
 */

import { EXTENSION_SHORT_URL_RECEIVED } from 'constant';
import {
  applyResponseHeaderModifications,
  applyRequestHeaderMutations,
  debug,
  isFirefox,
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
      if (chrome.runtime.lastError || !responseHeaders || !url) {
        debug('OnBeforeHeadersReceived - Error', chrome.runtime.lastError, responseHeaders, url);
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
          if (chrome.runtime.lastError) {
            debug('Chrome Last Error', chrome.runtime.lastError);
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
})();

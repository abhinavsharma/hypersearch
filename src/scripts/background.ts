/**
 * @module BackgroundService
 * @author Abhinav Sharma<abhinav@laso.ai>
 * @author Matyas Angyal<matyas@laso.ai>
 * @license (C) Insight
 * @version 1.0.0
 */
import axios from 'axios';
import { v4 as uuid } from 'uuid';
import { SPECIAL_URL_JUNK_STRING } from 'lumos-shared-js';
import { HOSTNAME_TO_PATTERN } from 'lumos-shared-js/src/content/constants_altsearch';
import SearchEngineManager from 'lib/SearchEngineManager/SearchEngineManager';
import { debug } from 'utils/helpers';
import {
  ENABLE_INTRO,
  FRESHPAINT_API_ENDPOINT,
  FRESHPAINT_API_TOKEN,
  OPEN_AUGMENTATION_BUILDER_MESSAGE,
  SEND_FRAME_INFO_MESSAGE,
  SEND_LOG_MESSAGE,
  URL_UPDATED_MESSAGE,
} from 'utils/constants';
// ! INITIALIZATION
// We use this for the logging. This ID will be assigned to the instance, throughout the application
// lifetime. This way we can follow the exact user actions indentifying them by their ID. Also, we can
// keep user's privacy intact and provide anonymous usage data to the Freshpaint log.
const SESSION_ID = uuid();
// See: https://stackoverflow.com/a/9851769/2826713
const isFirefox = typeof InstallTrigger !== 'undefined';
// ! HEADER MODIFICATIONS
// Firefox does not allow the `extraHeaders` property on the `webRequest` object.
const extraSpec = ['blocking', 'responseHeaders', isFirefox ? null : 'extraHeaders'].filter(
  (i) => i,
);
// Rewrite all request headers to remove CORS related content and allow remote sites to be loaded into
// IFrames for example. This is a NOT SAFE solution and ignores any external security concern provided.
chrome.webRequest.onHeadersReceived.addListener(
  function (details) {
    const strippedHeaders = [
      'x-frame-options',
      'frame-options',
      'content-security-policy',
      'access-control-allow-origin',
      'referer-policy',
    ];
    const responseHeaders = details.responseHeaders.filter((responseHeader) => {
      const deleted = !strippedHeaders.includes(responseHeader.name.toLowerCase());
      return deleted;
    });

    const result = {
      responseHeaders: [
        ...responseHeaders,
        {
          name: 'Content-Security-Policy',
          value: `frame-ancestors *`,
        },
        {
          name: 'Access-Control-Allow-Origin',
          value: '*',
        },
      ],
    };
    return result;
  },
  {
    urls: ['<all_urls>'],
    types: ['sub_frame'],
  },
  extraSpec,
);
// Rewrite outgoing headers to mimick if UA was a mobile device. We are always want to show the mobile page in
// the sidebar. However, this solution is not covering every case. See: `scripts/frame.ts` for details. The idea
// here is to append the URL with a junk string on each request we want mobile page back and check for this junk.
chrome.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    const requestHeaders = details.requestHeaders.map((requestHeader) => {
      const specialUrl = details.url.includes(SPECIAL_URL_JUNK_STRING);
      const urlMatchesSearchPattern =
        specialUrl ||
        Object.values(HOSTNAME_TO_PATTERN)
          .map((s) => s.replace('{searchTerms}', ''))
          .filter((substring) => details.url.includes(substring)).length > 0;
      if (
        urlMatchesSearchPattern &&
        details.frameId > 0 &&
        requestHeader.name.toLowerCase() === 'user-agent' &&
        details.url.search(/ecosia\.org/gi) < 1
      ) {
        requestHeader.value =
          'Mozilla/5.0 (Linux; Android 7.0; SM-G930V Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.125 Mobile Safari/537.36';
      }

      return requestHeader;
    });

    return {
      requestHeaders,
    };
  },
  { urls: ['<all_urls>'] },
  ['blocking', 'requestHeaders'],
);
// ! NAVIGATION LISTENERS
// Send a message whenever the URL of the current tab is updated, to let the React app know that it should update
// the contents of the sidebar according to the change that happened.
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    debug(
      'onUpdatedListener - call\n---\n\tTab ID',
      tabId,
      '\n\tChange',
      changeInfo.url,
      '\n\tTab',
      tab,
    );
    chrome.tabs.sendMessage(tabId, { type: URL_UPDATED_MESSAGE, url: changeInfo.url });
  }
});
// Fire an event when the user is navigating away from the current site. This will run asynchronously and it's not
// guaranteed that `SidebarLoader`'s `getCustomSearchEngine` method finds a value in the storage, beacuse of the
// race conditions. On the other hand, we can safely ignore this behaviour, because in that case, both results will
// come from the same source, and going to be identical. The only drawback is an extra fetch request from the client.
chrome.webNavigation.onBeforeNavigate.addListener(async () => {
  SearchEngineManager.sync();
});
// ! MESSAGING
// This forwards the information when a URL is opened in an IFrame. Since we're opening tab URLs in a new page, it
// must listen to the `onCreatedNavigationTarget` event of the browser. See: `modules/sidebar/SidebarTabs.tsx`.
chrome.webNavigation.onCreatedNavigationTarget.addListener(async (details) => {
  chrome.webNavigation.getFrame(
    { frameId: details.sourceFrameId, tabId: details.sourceTabId },
    (frame) => {
      chrome.tabs.sendMessage(details.sourceTabId, {
        type: SEND_FRAME_INFO_MESSAGE,
        frame,
        url: details.url,
      });
    },
  );
});
// Send a message to open the specified page in the sidebar when the toolbar icon is clicked.
chrome.browserAction.onClicked.addListener((tab) =>
  ENABLE_INTRO
    ? chrome.tabs.create({ url: chrome.runtime.getURL('introduction.html') })
    : chrome.tabs.sendMessage(tab.id, { type: OPEN_AUGMENTATION_BUILDER_MESSAGE }),
);
// The content script does not support the `tabs` property yet, so we have to pass the messages through the background
// page. By default it will forward any message as is to the client.
chrome.runtime.onMessage.addListener((msg, sender) => {
  switch (msg.type) {
    case SEND_LOG_MESSAGE:
      debug('handleLogSend - call');
      try {
        const data: FreshpaintTrackEvent = {
          event: msg.event,
          properties: {
            distinct_id: SESSION_ID,
            token: FRESHPAINT_API_TOKEN,
            time: Date.now() / 1000, // ! Time is epoch seconds
            ...msg.properties,
          },
        };
        axios({
          url: FRESHPAINT_API_ENDPOINT,
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
          },
          data,
        }).then((result) => {
          debug('handleLogSend - processed\n---\n\tResponse', result, '\n---');
        });
      } catch (e) {
        debug('handleLogSend - error\n---\n\tError', e, '\n---');
      }
      break;
    default:
      chrome.tabs.sendMessage(sender.tab.id, msg);
      break;
  }
});

chrome.runtime.onInstalled.addListener((details) => {
  details.reason === 'install' &&
    ENABLE_INTRO &&
    chrome.tabs.create({ url: chrome.runtime.getURL('introduction.html') });
});

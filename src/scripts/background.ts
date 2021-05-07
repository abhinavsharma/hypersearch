/**
 * @module BackgroundService
 * @author Abhinav Sharma<abhinav@laso.ai>
 * @author Matyas Angyal<matyas@laso.ai>
 * @license (C) Insight
 * @version 1.0.0
 */
import axios from 'axios';
import SearchEngineManager from 'lib/SearchEngineManager/SearchEngineManager';
import { debug, getPublicationUrl, sanitizeUrl } from 'utils/helpers';
import {
  EXTENSION_SHORT_URL_RECEIVED,
  FRESHPAINT_API_ENDPOINT,
  FRESHPAINT_API_TOKEN,
  OPEN_AUGMENTATION_BUILDER_MESSAGE,
  OPEN_BUILDER_PAGE,
  OPEN_NEW_TAB_MESSAGE,
  OPEN_SETTINGS_PAGE_MESSAGE,
  SEND_FRAME_INFO_MESSAGE,
  SEND_LOG_MESSAGE,
  SYNC_PUBLICATION_TIME_TRACK_KEY,
  TRIGGER_PUBLICATION_TIMER_MESSAGE,
  TRIGGER_START_TRACK_TIMER_MESSAGE,
  TRIGGER_STOP_TRACK_TIMER_MESSAGE,
  URL_UPDATED_MESSAGE,
  SPECIAL_URL_JUNK_STRING,
} from 'utils/constants';
// ! INITIALIZATION
// See: https://stackoverflow.com/a/9851769/2826713
const isFirefox = typeof InstallTrigger !== 'undefined';
// ! HEADER MODIFICATIONS
// Firefox does not allow the `extraHeaders` property on the `webRequest` object.
const extraSpec = ['blocking', 'responseHeaders', isFirefox ? null : 'extraHeaders'].filter(
  (i) => i,
);

const processCookieString = (header: string) => {
  if (header.search(/__sso\.key/g) > -1) {
    return header;
  }
  let newHeader = header;
  if (newHeader.search(/Secure/) === -1) {
    newHeader = newHeader.concat(' Secure');
  }
  if (newHeader.search(/SameSite=[\w]*/g) === -1) {
    newHeader = newHeader.concat(' SameSite=None');
  } else {
    newHeader = newHeader.replace(/SameSite=[\w]*/g, 'SameSite=None');
  }
  return newHeader;
};

// Rewrite all request headers to remove CORS related content and allow remote sites to be loaded into
// IFrames for example. This is a NOT SAFE solution and ignores any external security concern provided.
chrome.webRequest.onHeadersReceived.addListener(
  (details) => {
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
        ...responseHeaders.map((header) => {
          if (header.name.toLowerCase() === 'set-cookie') {
            header.value = processCookieString(header.value);
          }
          if (header.name.toLowerCase() === 'location') {
            header.value = new URL(header.value.replace(/^https?:\/\//, 'https://')).href;
          }
          return header;
        }),
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
    if (details.url.search(/https:\/\/extensions\.insightbrowser\.com\/extend\/[\w]*/gi) > -1) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        for (let i = 0; i < tabs.length; ++i) {
          chrome.tabs.sendMessage(tabs[i].id, {
            type: EXTENSION_SHORT_URL_RECEIVED,
            shortUrl: details.url,
          });
        }
      });
    }
    // Bookface needs `_sso.key` cookie to sent with `SameSite=none` to be able to display in iframe.
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

    const requestHeaders = details.requestHeaders.map((requestHeader) => {
      if (requestHeader.name.toLowerCase() === 'cookie') {
        requestHeader.value = processCookieString(requestHeader.value);
      }
      const specialUrl = details.url.includes(SPECIAL_URL_JUNK_STRING);
      const urlMatchesSearchPattern =
        specialUrl /* ||
        Object.values(HOSTNAME_TO_PATTERN)
          .map((s) => s.replace('{searchTerms}', ''))
          .filter((substring) => details.url.includes(substring)).length > 0; */
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
// ! PUBLICATION TRACKER
// Map of publication URLs and their timestamp of when the user started reading that page.
const trackData: Record<string, number> = Object.create(null);
// Calculate how much time the user spent on a publication and store it's value in the storage.
// After the value is stored, we fire an update message which will update the gutter unit.
const stopTrackingTimer = async () => {
  const stored =
    (await new Promise((resolve) =>
      chrome.storage.sync.get(SYNC_PUBLICATION_TIME_TRACK_KEY, resolve),
    ).then((value) => value[SYNC_PUBLICATION_TIME_TRACK_KEY])) ?? Object.create(null);
  Object.entries(trackData).forEach(([publication, startTime]) => {
    if (trackData[publication]) {
      const storedTime = stored[sanitizeUrl(publication)] ?? 0;
      const currentTime = storedTime + Math.trunc((Date.now() - startTime) / 1000 / 60);
      trackData[publication] = 0;
      debug('publicationTracking - end - ', publication, currentTime);
      chrome.storage.sync.set({
        [SYNC_PUBLICATION_TIME_TRACK_KEY]: {
          ...(stored ?? Object.create(null)),
          [sanitizeUrl(publication)]: currentTime,
        },
      });
      chrome.tabs.query({ currentWindow: true }, (tabs) => {
        tabs.forEach((tab) => {
          chrome.tabs.sendMessage(tab.id, {
            currentTime,
            domain: publication,
            type: TRIGGER_PUBLICATION_TIMER_MESSAGE,
          });
        });
      });
    }
  });
};
// Event listener ivoked when the user changes the current tab. If the new tab matches
// a known publication, we start to track the time spent on this tab. Switching to another
// tab or STOP message from the frontend will stop the timer and add the tracked time to
// the stored value of the corresponding publication. Spent time calculated by subtracting
// the starttime from the current time (timestamps in miliseconds converted to minutes).
chrome.tabs.onActivated.addListener(({ tabId }) => {
  chrome.tabs.query({}, async (tabs) => {
    const currentTab = tabs.find(({ id }) => id == tabId);
    const publication = getPublicationUrl(currentTab?.url);
    if (publication && !trackData[publication]) {
      debug('publicationTracking - start - ', publication, trackData);
      trackData[publication] = Date.now();
      tabs.forEach((tab) =>
        chrome.tabs.sendMessage(tab.id, {
          type: TRIGGER_START_TRACK_TIMER_MESSAGE,
          url: currentTab.url,
        }),
      );
    } else {
      await stopTrackingTimer();
    }
  });
});

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

// When the user is clicking the extension button, the sidebar will open the active augmentations page, regardless
// of the current url.
chrome.browserAction.onClicked.addListener(({ id, url }) => {
  !url
    ? chrome.tabs.create({ url: chrome.runtime.getURL('introduction.html') })
    : chrome.tabs.sendMessage(id, {
        type: OPEN_AUGMENTATION_BUILDER_MESSAGE,
        page: OPEN_BUILDER_PAGE.ACTIVE,
      });
});
// The content script does not support the `tabs` property yet, so we have to pass the messages through the background
// page. By default it will forward any message as is to the client.
chrome.runtime.onMessage.addListener((msg, sender) => {
  switch (msg.type) {
    case TRIGGER_STOP_TRACK_TIMER_MESSAGE: {
      const publication = getPublicationUrl(msg.url ?? '');
      if (publication && !trackData[publication]) {
        (async () => await stopTrackingTimer())();
      }
      break;
    }
    case TRIGGER_START_TRACK_TIMER_MESSAGE: {
      const publication = getPublicationUrl(msg.url ?? '');
      if (publication && !trackData[publication]) {
        debug('publicationTracking - start - ', publication, trackData);
        trackData[publication] = Date.now();
      }
      break;
    }
    case OPEN_NEW_TAB_MESSAGE:
      chrome.tabs.create({ url: msg.url });
      break;
    case OPEN_SETTINGS_PAGE_MESSAGE:
      chrome.tabs.create({ url: chrome.runtime.getURL('introduction.html') });
      break;
    case SEND_LOG_MESSAGE:
      debug('handleLogSend - call');
      try {
        const data: FreshpaintTrackEvent = {
          event: msg.event,
          properties: {
            distinct_id: msg.userId,
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
    chrome.tabs.create({ url: chrome.runtime.getURL('introduction.html') });
});

const HEADERS_TO_STRIP_LOWERCASE = ['content-security-policy', 'x-frame-options'];

chrome.webRequest.onHeadersReceived.addListener(
  (details) => ({
    responseHeaders: details.responseHeaders.filter(
      (header) => !HEADERS_TO_STRIP_LOWERCASE.includes(header.name.toLowerCase()),
    ),
  }),
  {
    urls: ['<all_urls>'],
  },
  ['blocking', 'responseHeaders', 'extraHeaders'],
);

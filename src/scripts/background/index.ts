/**
 * @module scripts:background
 * @version 1.0.0
 * @license (C) Insight
 */

import axios from 'axios';
import SearchEngineManager from 'lib/engines';
import BookmarksSynchronizer from 'lib/bookmarks';
import { debug } from 'lib/helpers';
import {
  FRESHPAINT_API_ENDPOINT,
  FRESHPAINT_API_TOKEN,
  MESSAGE,
  PAGE,
  OPEN_NEW_TAB_MESSAGE,
  OPEN_SETTINGS_PAGE_MESSAGE,
  SEND_FRAME_INFO_MESSAGE,
  SEND_LOG_MESSAGE,
  URL_UPDATED_MESSAGE,
  SYNC_START_MESSAGE,
  SYNC_END_MESSAGE,
  USER_UPDATED_MESSAGE,
  FETCH_REQUEST_MESSAGE,
  IS_TOP_WINDOW_DARK_MESSAGE,
} from 'constant';

//-----------------------------------------------------------------------------------------------
// ! Modules
//-----------------------------------------------------------------------------------------------
import './headers';
import './hot';

(() => {
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
  // guaranteed that `SidebarLoader`'s `getSearchEngineObject` method finds a value in the storage, because of the
  // race conditions. On the other hand, we can safely ignore this behavior, because in that case, both results will
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
      : chrome.tabs.sendMessage(id ?? -1, {
          type: MESSAGE.OPEN_PAGE,
          page: PAGE.ACTIVE,
        });
  });
  // The content script does not support the `tabs` property yet, so we have to pass the messages through the background
  // page. By default it will forward any message as is to the client.
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    switch (msg.type) {
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
      case SYNC_START_MESSAGE:
        BookmarksSynchronizer.sync(msg.token, msg.userInitiated).then(() => {
          chrome.tabs.sendMessage(sender.tab?.id ?? -1, {
            type: SYNC_END_MESSAGE,
          });
        });

        break;
      case USER_UPDATED_MESSAGE:
        if (msg.authenticated) {
          BookmarksSynchronizer.scheduleSync();
        } else {
          BookmarksSynchronizer.clearSchedule();
        }
        break;
      case FETCH_REQUEST_MESSAGE:
        (async () => {
          let data;

          try {
            const url = msg.data.url;
            const headers = msg.data;
            const result = await fetch(url, { headers });

            if (!headers || headers.responseType === 'text') {
              data = await result.text();
            } else if (headers.responseType === 'data-url') {
              data = await result.blob();
            }
          } catch (e) {}

          sendResponse(data);
        })();

        return true;

      case IS_TOP_WINDOW_DARK_MESSAGE:
        chrome.tabs.sendMessage(sender.tab?.id ?? -1, msg, sendResponse)

        return true;
      default:
        chrome.tabs.sendMessage(sender.tab?.id ?? -1, msg);
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
      responseHeaders: details.responseHeaders?.filter(
        (header) => !HEADERS_TO_STRIP_LOWERCASE.includes(header.name.toLowerCase()),
      ),
    }),
    {
      urls: ['<all_urls>'],
    },
    ['blocking', 'responseHeaders', 'extraHeaders'],
  );
})();

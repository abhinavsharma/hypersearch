import { debug, CLIENT_MESSAGES, SPECIAL_URL_JUNK_STRING } from 'lumos-shared-js';
import { HOSTNAME_TO_PATTERN } from 'lumos-shared-js/src/content/constants_altsearch';
import { BackgroundMessenger } from 'lib/BackgroundMessenger/BackgroundMessenger';
import SearchEngineManager from 'lib/SearchEngineManager/SearchEngineManager';
import {
  ENABLE_AUGMENTATION_BUILDER,
  FRESHPAINT_API_ENDPOINT,
  FRESHPAINT_API_TOKEN,
  SEND_FRAME_INFO_MESSAGE,
  SEND_LOG_MESSAGE,
} from 'utils/constants';
import {
  REMOVE_AUGMENTATION_SUCCESS_MESSAGE,
  OPEN_AUGMENTATION_BUILDER_MESSAGE,
  UPDATE_SIDEBAR_TABS_MESSAGE,
  ADD_LOCAL_AUGMENTATION_MESSAGE,
  URL_UPDATED_MESSAGE,
} from 'utils/constants';
import axios from 'axios';
import { v4 as uuid } from 'uuid';

const USER_AGENT_REWRITE_URL_SUBSTRINGS = Object.values(HOSTNAME_TO_PATTERN).map((s) =>
  s.replace('{searchTerms}', ''),
);

export const URL_TO_TAB = {};

const SESSION_ID = uuid();

// eslint-disable-next-line
// @ts-ignore
const isFirefox = typeof InstallTrigger !== 'undefined';
const extraSpec = ['blocking', 'responseHeaders', isFirefox ? null : 'extraHeaders'].filter(
  (i) => i,
);

chrome.runtime.getPlatformInfo;

// Allow external pages blocked by CORS to load into iframes.
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

// Mimick mobile browser environment.
chrome.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    const requestHeaders = details.requestHeaders.map((requestHeader) => {
      // this is for the search result iframes loaded in the sidebar, we pretend the browser is mobile for them
      const specialUrl = details.url.includes(SPECIAL_URL_JUNK_STRING);
      const urlMatchesSearchPattern =
        specialUrl ||
        USER_AGENT_REWRITE_URL_SUBSTRINGS.filter((substring) => details.url.includes(substring))
          .length > 0;
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

window.onload = () => {
  const messenger = new BackgroundMessenger();
  messenger.loadHiddenMessenger(document, window);
};

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
  URL_TO_TAB[tab.url] = tabId;
});

chrome.browserAction.onClicked.addListener(function (tab) {
  debug(
    'browserAction - clicked\n---\n\tMessage',
    CLIENT_MESSAGES.BROWSER_CONTENT_FLIP_NON_SERP_CONTAINER,
    '\n---',
  );
  chrome.tabs.sendMessage(tab.id, {
    data: {
      command: CLIENT_MESSAGES.BROWSER_CONTENT_FLIP_NON_SERP_CONTAINER,
    },
  });
});

chrome.browserAction.setBadgeBackgroundColor({ color: 'black' });

chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  SearchEngineManager.sync();
});

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

chrome.browserAction.onClicked.addListener((tab) => {
  !ENABLE_AUGMENTATION_BUILDER
    ? chrome.tabs.create({ active: true, url: 'http://share.insightbrowser.com/14' })
    : chrome.tabs.sendMessage(tab.id, { type: OPEN_AUGMENTATION_BUILDER_MESSAGE });
});

const handleLogSend = async (event: string, properties: Record<string, any> = {}) => {
  debug('handleLogSend - call');
  try {
    const data: FreshpaintTrackEvent = {
      event: event,
      properties: {
        distinct_id: SESSION_ID,
        token: FRESHPAINT_API_TOKEN,
        time: Date.now() / 1000, // ! Time is epoch seconds
        ...properties,
      },
    };
    const result = await axios({
      url: FRESHPAINT_API_ENDPOINT,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      data,
    });
    debug('handleLogSend - processed\n---\n\tResponse', result, '\n---');
  } catch (e) {
    debug('handleLogSend - error\n---\n\tError', e, '\n---');
  }
};

chrome.runtime.onMessage.addListener((msg, sender) => {
  switch (msg.type) {
    case ADD_LOCAL_AUGMENTATION_MESSAGE:
      chrome.tabs.sendMessage(sender.tab.id, { type: ADD_LOCAL_AUGMENTATION_MESSAGE });
      break;
    case REMOVE_AUGMENTATION_SUCCESS_MESSAGE:
      chrome.tabs.sendMessage(sender.tab.id, { type: REMOVE_AUGMENTATION_SUCCESS_MESSAGE });
      break;
    case UPDATE_SIDEBAR_TABS_MESSAGE:
      chrome.tabs.sendMessage(sender.tab.id, { type: UPDATE_SIDEBAR_TABS_MESSAGE });
      break;
    case OPEN_AUGMENTATION_BUILDER_MESSAGE:
      chrome.tabs.sendMessage(sender.tab.id, { type: OPEN_AUGMENTATION_BUILDER_MESSAGE });
      break;
    case SEND_LOG_MESSAGE:
      handleLogSend(msg.event, msg.properties);
      break;
    default:
      break;
  }
});

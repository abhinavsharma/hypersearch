import { CONTENT_PAGE_ELEMENT_ID_LUMOS_HIDDEN, debug, LUMOS_APP_URL, INativeAddReactAppListener, INativePostMessageToReactApp, LUMOS_APP_BASE_URL, CLIENT_MESSAGES } from "lumos-shared-js";
import { MESSAGES as LUMOS_WEB_MESSAGES } from 'lumos-web/src/components/Constants'
import {URL_TO_TAB} from './background';

import uuidv1 = require('uuid/v1');

let IS_READY = false;
let REACT_APP_LOADED = false;
let MESSENGER_ID = uuidv1(); 
let MESSENGER_IFRAME = null;
let RECEIVED_LOGIN_RESPONSE = false;
let user = null;

export function isMessengerReady(): boolean {
    return REACT_APP_LOADED && IS_READY && MESSENGER_IFRAME;
}

export function isUserLoggedIn(): boolean {
  return !REACT_APP_LOADED || !!user;
}

function nativeBrowserPostMessageToReactApp({command, data}: INativePostMessageToReactApp): void {
    debug("function call - background nativeBrowserPostMessageToReactApp")
    let iframe = MESSENGER_IFRAME
    let RETRY_TIME = 100;

    if (!isMessengerReady()) {
        setTimeout(function() {
            nativeBrowserPostMessageToReactApp({"command": command, "data": data})
        }, RETRY_TIME)
        return;
    }

    debug("nativeBrowserPostMessageToReactApp - posting", command, data)
    iframe.contentWindow.postMessage({
        command: command,
        ...data
    }, LUMOS_APP_URL);
}

function monitorMessengerState(window: Window): void {
    window.addEventListener(
      'message',
      msg => {
        if (msg.data && msg.data.command) {
          switch (msg.data.command) {
            case 'readyConsumerBar':
            case 'reactAppLoaded':
              let messengerHref = msg.data.messengerUrl;
              if (!messengerHref) return
              let messengerUrl = new URL(messengerHref)
              if (!messengerUrl) return
              let searchParams = new URLSearchParams(messengerUrl.search)
              if (!searchParams) return
              let messengerId = searchParams.get('messengerId')
              if (!messengerId) return
              if (messengerId === MESSENGER_ID) {
                if(msg.data.command === 'reactAppLoaded') {
                  debug("React App Loaded", messengerId);
                  REACT_APP_LOADED = true
                } else {
                  debug("Messenger Ready", messengerId);
                  IS_READY = true
                }
              }
              break;
            default:
              break;
          }
        }
      },
      false,
    );
}

export function setupMessagePassthrough(window: Window): void {
  debug("function call - setupMessagePassthrough")
  debug("setting up listening to messages from tabs")
  chrome.runtime.onMessage.addListener(({command, data}, sender) => {
    if (command === CLIENT_MESSAGES.CONTENT_BROWSER_BADGE_UPDATE) {
      debug("message from browser to background", command, data, sender)
      // https://stackoverflow.com/questions/32168449/how-can-i-get-different-badge-value-for-every-tab-on-chrome/32168534
      chrome.tabs.get(sender.tab.id, function(tab) {
        if (chrome.runtime.lastError) {
          return; // the prerendered tab has been nuked, happens in omnibox search
        }
        const { emoji } = data;
        if (tab.index >= 0) { // tab is visible
          chrome.browserAction.setBadgeText({ text: emoji, tabId: tab.id });
        } else { // prerendered tab, invisible yet, happens quite rarely
          const tabId = sender.tab.id;
          chrome.webNavigation.onCommitted.addListener(function update(details) {
            if (details.tabId == tabId) {
              chrome.browserAction.setBadgeText({ text: emoji, tabId: tabId});
              chrome.webNavigation.onCommitted.removeListener(update);
            }
          });
        }
      });
    } else {
      debug("message from tab to background", command, data, sender)
      nativeBrowserPostMessageToReactApp({
        command: command,
        data: {
          ...data,
          origin: sender.tab.url,
        },
      })
    }
  })

  debug("setting up listening to messages from react app in bg")
  window.addEventListener(
    'message',
    msg => {
      debug("message from react app to background script", msg)
      if (msg.data && msg.data.command === LUMOS_WEB_MESSAGES.WEB_CONTENT_USER_IS_USER_LOGGED_IN) {
        RECEIVED_LOGIN_RESPONSE = true;
        user = msg.data.user
      } 
      if (msg.data && msg.data.command) {
        if (msg.data?.href in URL_TO_TAB) {
          debug("nativeBrowserAddReactAppListener - received message from react into bg", msg, URL_TO_TAB[msg.data.href])
          chrome.tabs.sendMessage(URL_TO_TAB[msg.data.href], {
            data: msg.data
          })
        } else if (msg.data?.origin in URL_TO_TAB) {
          debug("nativeBrowserAddReactAppListener - received message from react into bg", msg, URL_TO_TAB[msg.data.origin])
          chrome.tabs.sendMessage(URL_TO_TAB[msg.data.origin], {
            data: msg.data
          })
        }
      }
    },
    false,
  );
}

function reloadMessengerIframe(): void {
  MESSENGER_IFRAME.src = MESSENGER_IFRAME.src
  nativeBrowserPostMessageToReactApp({command: LUMOS_WEB_MESSAGES.CONTENT_WEB_USER_IS_USER_LOGGED_IN, data: {}})
}

function fixIframeIfCrashed(): void {
  // reset iframe if the document inside has crashed
  if (MESSENGER_IFRAME.src && !MESSENGER_IFRAME.document) {
    MESSENGER_IFRAME.src == MESSENGER_IFRAME.src
  }
}

export function monitorLoginState(window: Window): void {
  debug("function call monitorLoginState")
  nativeBrowserPostMessageToReactApp({command: LUMOS_WEB_MESSAGES.CONTENT_WEB_USER_IS_USER_LOGGED_IN, data: {}})
  let RETRY_TIME = 2500;
  let LOGIN_TIMEOUT = 5000;
  let LOGIN_ASK_TIME = 30 * 60 * 1000;
  let TIME_SINCE_MESSAGE = 0;
  let LOGIN_PROMPTED = false;

  setInterval(function() {
    TIME_SINCE_MESSAGE += RETRY_TIME
    let isLoggedIn = isUserLoggedIn()
    debug('login state and crash monitor, login set to:', isLoggedIn, "time since message", TIME_SINCE_MESSAGE, 'prompted', LOGIN_PROMPTED)
    // Response not received, if timeout reached reload iframe
    console.log(RECEIVED_LOGIN_RESPONSE, isLoggedIn, LOGIN_PROMPTED)
    if (!RECEIVED_LOGIN_RESPONSE) {
      if (TIME_SINCE_MESSAGE >= LOGIN_TIMEOUT) {
        setTimeout(reloadMessengerIframe, RETRY_TIME)
      }
    }
    else {
      // If response received and use is logged out, ask for loggin if needed
      if (!isLoggedIn && !LOGIN_PROMPTED) {
        window.open(LUMOS_APP_BASE_URL)
        LOGIN_PROMPTED = true

        // Ask for login again after some time
        setTimeout(() => {
          LOGIN_PROMPTED = false;
        }, LOGIN_ASK_TIME)
      }
      else {
        // just monitor for crashes
        TIME_SINCE_MESSAGE = 0;
        fixIframeIfCrashed()
      }
    }
  }, RETRY_TIME)
}

export function loadHiddenMessenger(document: Document, window: Window): void {
    if (MESSENGER_IFRAME !== null) {
      return
    }
    // 1. load iframe
    let iframe = document.createElement('iframe');
    iframe.src = LUMOS_APP_URL  + '?messengerId=' + MESSENGER_ID;
    iframe.setAttribute('id', CONTENT_PAGE_ELEMENT_ID_LUMOS_HIDDEN);
    iframe.setAttribute('style', `
        height: 1px;
        width: 1px;
    `);
    document.body.appendChild(iframe);
    MESSENGER_IFRAME = iframe
    // 2. wait for it to send a message that it's ready
    monitorMessengerState(window)
    // 3. Setup message passthrough for tabs
    setupMessagePassthrough(window);
    // 4. Monitor user login state
    monitorLoginState(window);
    // 5. Reload iFrame after certain amount of time
    reloadIframeInterval()
}

export function reloadIframeInterval() {
  const reloadIntervalTime = 2 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds

  setInterval(() => {
    reloadMessengerIframe()
  }, reloadIntervalTime)
}

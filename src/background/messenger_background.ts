import { CONTENT_PAGE_ELEMENT_ID_LUMOS_HIDDEN, debug, LUMOS_APP_URL, INativeAddReactAppListener, INativePostMessageToReactApp, LUMOS_APP_BASE_URL } from "lumos-shared-js";
import {URL_TO_TAB} from './background';

import uuidv1 = require('uuid/v1');

let IS_READY = false;
let REACT_APP_LOADED = false;
let MESSENGER_ID = uuidv1(); 
let MESSENGER_IFRAME = null;
let user = null;
let userMemberships = null;

export function isMessengerReady(): boolean {
    return REACT_APP_LOADED && IS_READY && MESSENGER_IFRAME;
}

export function isUserLoggedIn(): boolean {
  return !REACT_APP_LOADED || !!user;
}

function nativeBrowserPostMessageToReactApp({command, data, timeoutId}: INativePostMessageToReactApp): void {
    if (timeoutId && timeoutId !== null) {
      clearTimeout(timeoutId)
    }
    debug("function call - background nativeBrowserPostMessageToReactApp")
    let iframe = MESSENGER_IFRAME
    let RETRY_TIME = 100;

    if (!isMessengerReady()) {
        let newTimeoutId = setTimeout(function() {
            nativeBrowserPostMessageToReactApp({"command": command, "data": data, "timeoutId": newTimeoutId})
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
    debug("message from tab to background", command, data, sender)
    nativeBrowserPostMessageToReactApp({
      command: command,
      data: {
        origin: sender.url,
        ...data
      },
      timeoutId: null
    })
  })

  debug("setting up listening to messages from react app in bg")
  window.addEventListener(
    'message',
    msg => {
      debug("message from react app to background script", msg)
      if (msg.data && msg.data.command === "isUserLoggedIn") {
        user = msg.data.user
        userMemberships = msg.data.memberships
      } 
      if (msg.data && msg.data.command && msg.data.origin && msg.data.origin in URL_TO_TAB) {
        debug("nativeBrowserAddReactAppListener - received message from react into bg", msg, URL_TO_TAB[msg.data.origin])
        chrome.tabs.sendMessage(URL_TO_TAB[msg.data.origin], {
          data: msg.data
        })
      }
    },
    false,
  );
}

function reloadMessengerIframe(): void {
  MESSENGER_IFRAME.src = MESSENGER_IFRAME.src
}

function fixIframeIfCrashed(): void {
  // reset iframe if the document inside has crashed
  if (MESSENGER_IFRAME.src && !MESSENGER_IFRAME.document) {
    MESSENGER_IFRAME.src == MESSENGER_IFRAME.src
  }
}

export function monitorLoginState(window: Window): void {
  debug("function call monitorLoginState")
  nativeBrowserPostMessageToReactApp({command: "isUserLoggedIn", data: {}})
  let RETRY_TIME = 1000;
  let LOGIN_TIMEOUT = 3000;
  let TIME_SINCE_MESSAGE = 0;
  let LOGIN_PROMPTED = false;

  

  function waitForLoginRecursive(lastTimeoutId: number | null): void {
    if (lastTimeoutId !== null) {
      clearTimeout(lastTimeoutId)
    }

    let newTimeoutId = setTimeout(function() {
      debug('waiting for user login', TIME_SINCE_MESSAGE, LOGIN_PROMPTED)
      TIME_SINCE_MESSAGE += RETRY_TIME
      if (!isUserLoggedIn()) {
        if (TIME_SINCE_MESSAGE >= LOGIN_TIMEOUT) {
          if (LOGIN_PROMPTED) {
            setTimeout(reloadMessengerIframe, RETRY_TIME)
          } else {
            window.open(LUMOS_APP_BASE_URL)
            LOGIN_PROMPTED = true
          }
        }
      } else {
        //  user las logged in, just monitor for crashes
        TIME_SINCE_MESSAGE = 0;
        LOGIN_PROMPTED = false;
        fixIframeIfCrashed()
      }
      waitForLoginRecursive(newTimeoutId)
    }, RETRY_TIME)
    return;
  }

  waitForLoginRecursive(null);
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
}

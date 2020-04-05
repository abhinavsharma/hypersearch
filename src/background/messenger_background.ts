import { CONTENT_PAGE_ELEMENT_ID_LUMOS_HIDDEN, debug, LUMOS_APP_URL, INativeAddReactAppListener, INativePostMessageToReactApp } from "lumos-shared-js";
import {URL_TO_TAB} from './background';

import uuidv1 = require('uuid/v1');

let IS_READY = false;
let MESSENGER_ID = uuidv1(); 
let MESSENGER_IFRAME = null;

export function isMessengerReady(): boolean {
    return IS_READY && MESSENGER_IFRAME;
}

export function nativeBrowserPostMessageToReactApp({command, data}: INativePostMessageToReactApp): void {
    // debug("function call - nativeBrowserPostMessageToReactApp")
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

function listenToReactApp(window: Window): void {
    window.addEventListener(
      'message',
      msg => {
        if (msg.data && msg.data.command) {
          switch (msg.data.command) {
            case 'readyConsumerBar':
              let messengerHref = msg.data.messengerUrl;
              if (!messengerHref) return
              let messengerUrl = new URL(messengerHref)
              if (!messengerUrl) return
              let searchParams = new URLSearchParams(messengerUrl.search)
              if (!searchParams) return
              let messengerId = searchParams.get('messengerId')
              if (!messengerId) return
              if (messengerId === MESSENGER_ID) {
                debug("Messenger Ready", messengerId);
                IS_READY = true
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
  chrome.runtime.onMessage.addListener(({command, data}, sender) => {
    nativeBrowserPostMessageToReactApp(
      {
        command: command,
        data: {
          origin: sender.url,
          ...data
        }
      })
  })
  window.addEventListener(
    'message',
    msg => {
      if (msg.data && msg.data.command && msg.data.origin && msg.data.origin in URL_TO_TAB) {
        debug("nativeBrowserAddReactAppListener - recd message", msg, URL_TO_TAB[msg.data.origin])
        chrome.tabs.sendMessage(URL_TO_TAB[msg.data.origin], {
          data: msg.data
      })
      }
    },
    false,
  );
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
    listenToReactApp(window)
    setupMessagePassthrough(window);
}

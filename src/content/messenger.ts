import { CONTENT_PAGE_ELEMENT_ID_LUMOS_HIDDEN, debug, LUMOS_APP_URL, INativeAddReactAppListener, INativePostMessageToReactApp } from "lumos-shared-js";

let IS_READY = false;
let MESSENGER_IFRAME = null;

export function isMessengerReady(): boolean {
    return IS_READY && MESSENGER_IFRAME;
}

export function nativeBrowserPostMessageToReactApp({command, data}: INativePostMessageToReactApp): void {
    debug("function call - nativeBrowserPostMessageToReactApp")
    let iframe = MESSENGER_IFRAME
    let RETRY_TIME = 100;

    if (!isMessengerReady()) {
        debug("React App is not ready, delaying message")
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
              debug("readyConsumeBar");
              IS_READY = true
              break;
            default:
              break;
          }
        }
      },
      false,
    );
}

export function nativeBrowserAddReactAppListener({window, message, callback}: INativeAddReactAppListener): void {
    window.addEventListener(
        'message',
        msg => {
          
          if (msg.data && msg.data.command && msg.data.command === message) {
            debug("nativeBrowserAddReactAppListener - recd message", msg)
            callback(msg)
          }
        },
        false,
      );
}

export function loadHiddenMessenger(url: URL, document: Document, window: Window): void {

    // 1. load iframe
    let iframe = document.createElement('iframe');
    iframe.src = LUMOS_APP_URL  + '?src=' + encodeURIComponent(url.href);;
    iframe.setAttribute('id', CONTENT_PAGE_ELEMENT_ID_LUMOS_HIDDEN);
    iframe.setAttribute('style', `
        height: 1px;
        width: 1px;
    `);
    document.body.appendChild(iframe);
    MESSENGER_IFRAME = iframe

    // 2. wait for it to send a message that it's ready
    listenToReactApp(window)
}
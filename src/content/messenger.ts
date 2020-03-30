import { CONTENT_PAGE_ELEMENT_ID_LUMOS_HIDDEN, debug, LUMOS_APP_URL } from "lumos-shared-js";

let IS_READY = false;
let MESSENGER_IFRAME = null;

export function isMessengerReady(): boolean {
    return IS_READY && MESSENGER_IFRAME;
}

export function postMessageToReactApp(command: string, data: any): void {
    debug("function call - postMessageToReactApp")
    let iframe = MESSENGER_IFRAME
    let RETRY_TIME = 100;

    if (!isMessengerReady()) {
        debug("React App is not ready, delaying message")
        setTimeout(function() {
            postMessageToReactApp(command, data)
        }, RETRY_TIME)
        return;
    }

    debug("postMessageToReactApp - posting", command, data)
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

export function addReactAppListener(window: Window, message: string, fn): void {
    window.addEventListener(
        'message',
        msg => {
          
          if (msg.data && msg.data.command && msg.data.command === message) {
            debug("addReactAppListener - recd message", msg)
            fn(msg)
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
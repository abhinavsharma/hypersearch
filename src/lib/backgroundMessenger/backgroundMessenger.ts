import {
  CONTENT_PAGE_ELEMENT_ID_LUMOS_HIDDEN,
  debug,
  LUMOS_APP_URL,
  CLIENT_MESSAGES,
  LUMOS_SERP_CONFIG,
} from 'lumos-shared-js';
import { URL_TO_TAB } from 'background_script';
import { v1 as uuidv1 } from 'uuid';

class BackgroundMessenger {
  isReady: boolean;
  isThrottled: boolean;
  reactAppLoaded: boolean;
  messengerId: string;
  messengerIframe: HTMLIFrameElement | null;

  constructor() {
    this.isReady = false;
    this.reactAppLoaded = false;
    this.messengerId = uuidv1();
    this.messengerIframe = null;
    this.isThrottled = false;
    this._nativeBrowserPostMessageToReactApp = this._nativeBrowserPostMessageToReactApp.bind(this);
  }

  public isMessengerReady() {
    return this.reactAppLoaded && this.messengerIframe && this.isReady;
  }

  public setupMessagePassthrough(window: Window): void {
    debug('function call - setupMessagePassthrough');
    debug('setting up listening to messages from tabs');
    chrome.runtime.onMessage.addListener(({ command, data }, sender) => {
      switch (command) {
        case CLIENT_MESSAGES.CONTENT_BROWSER_BADGE_UPDATE:
          debug('message from browser to background', command, data, sender);
          // https://stackoverflow.com/questions/32168449/how-can-i-get-different-badge-value-for-every-tab-on-chrome/32168534
          chrome.tabs.get(sender.tab.id, function (tab) {
            if (chrome.runtime.lastError) {
              return; // the prerendered tab has been nuked, happens in omnibox search
            }
            const { emoji } = data;
            if (tab.index >= 0) {
              // tab is visible
              chrome.browserAction.setBadgeText({ text: emoji, tabId: tab.id });
            } else {
              // prerendered tab, invisible yet, happens quite rarely
              const tabId = sender.tab.id;
              chrome.webNavigation.onCommitted.addListener(function update(details) {
                if (details.tabId == tabId) {
                  chrome.browserAction.setBadgeText({ text: emoji, tabId: tabId });
                  chrome.webNavigation.onCommitted.removeListener(update);
                }
              });
            }
          });
          break;

        case CLIENT_MESSAGES.CONTENT_BROWSER_SET_LUMOS_SERP_CONFIG:
          debug('message from browser to background', command, data, sender);
          const { lumosSerpConfig } = data;
          chrome.storage.sync.set({ [LUMOS_SERP_CONFIG]: lumosSerpConfig });
          break;

        case CLIENT_MESSAGES.CONTENT_BROWSER_GET_LUMOS_SERP_CONFIG:
          debug('message from browser to background', command, data, sender);
          chrome.storage.sync.get([LUMOS_SERP_CONFIG], function (items) {
            console.log(items);
            chrome.tabs.sendMessage(sender.tab.id, {
              data: {
                command: CLIENT_MESSAGES.BROWSER_CONTENT_LUMOS_SERP_CONFIG,
                lumosSerpConfig: JSON.parse(JSON.stringify(items)),
                origin: sender.tab.url,
              },
            });
          });
          break;

        default:
          debug('message from tab to background', command, data, sender);
          this._nativeBrowserPostMessageToReactApp({
            command: command,
            data: {
              ...data,
              origin: sender.tab.url,
            },
          });
      }
    });

    debug('setting up listening to messages from react app in bg');
    window.addEventListener(
      'message',
      (msg) => {
        debug('message from react app to background script', msg);
        if (msg.data && msg.data.command) {
          if (msg.data?.href in URL_TO_TAB) {
            debug(
              'nativeBrowserAddReactAppListener - received message from react into bg',
              msg,
              URL_TO_TAB[msg.data.href],
            );
            chrome.tabs.sendMessage(URL_TO_TAB[msg.data.href], {
              data: msg.data,
            });
          } else if (msg.data?.origin in URL_TO_TAB) {
            debug(
              'nativeBrowserAddReactAppListener - received message from react into bg',
              msg,
              URL_TO_TAB[msg.data.origin],
            );
            chrome.tabs.sendMessage(URL_TO_TAB[msg.data.origin], {
              data: msg.data,
            });
          }
        }
      },
      false,
    );
  }

  public loadHiddenMessenger(document: Document, window: Window): void {
    if (this.messengerIframe !== null) return;
    const iframe = document.createElement('iframe');
    iframe.src = LUMOS_APP_URL + '?messengerId=' + this.messengerId;
    iframe.setAttribute('id', CONTENT_PAGE_ELEMENT_ID_LUMOS_HIDDEN);
    iframe.setAttribute(
      'style',
      `
        height: 1px;
        width: 1px;
    `,
    );
    document.body.appendChild(iframe);
    this.messengerIframe = iframe;
    this._monitorMessengerState(window);
    this.setupMessagePassthrough(window);
  }

  private _nativeBrowserPostMessageToReactApp: NativePostMessenger = ({ command, data }) => {
    debug('function call - background nativeBrowserPostMessageToReactApp');
    debug('isMessengerReady - current value', this.isMessengerReady());

    const iframe = this.messengerIframe;

    if (!this.isMessengerReady() && !this.isThrottled) {
      this.isThrottled = true;
      this._nativeBrowserPostMessageToReactApp({ command: command, data: data });
      setTimeout(() => {
        this.isThrottled = false;
      }, 100);
      return;
    }

    debug('nativeBrowserPostMessageToReactApp - posting', command, data);
    iframe.contentWindow.postMessage({ command, ...data }, LUMOS_APP_URL);
  };

  private _monitorMessengerState(window: Window): void {
    window.addEventListener(
      'message',
      (msg) => {
        if (msg.data && msg.data.command) {
          switch (msg.data.command) {
            case 'readyConsumerBar':
            case 'reactAppLoaded':
              const messengerHref = msg.data.messengerUrl;
              if (!messengerHref) return;
              const messengerUrl = new URL(messengerHref);
              if (!messengerUrl) return;
              const searchParams = new URLSearchParams(messengerUrl.search);
              if (!searchParams) return;
              const messengerId = searchParams.get('messengerId');
              if (!messengerId) return;
              if (messengerId === this.messengerId) {
                if (msg.data.command === 'reactAppLoaded') {
                  debug('React App Loaded', messengerId);
                  this.reactAppLoaded = true;
                } else {
                  debug('Messenger Ready', messengerId);
                  this.isReady = true;
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
}

export { BackgroundMessenger };

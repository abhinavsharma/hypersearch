/**
 * @module BackgroundMessenger
 * @author Abhinav Sharma<abhinav@laso.ai>
 * @license (C) Insight
 * @version 1.0.0
 * @deprecated
 */
import {
  CONTENT_PAGE_ELEMENT_ID_LUMOS_HIDDEN,
  debug,
  LUMOS_APP_URL,
  CLIENT_MESSAGES,
  LUMOS_SERP_CONFIG,
} from 'lumos-shared-js';
import { v1 as uuidv1 } from 'uuid';

// TODO: rewrite this to an interface communicating with `lumos-web`

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

  public setupMessagePassthrough(): void {
    debug('setupMessagePassthrough - call');
    chrome.runtime.onMessage.addListener(({ command, data }, sender) => {
      switch (command) {
        case CLIENT_MESSAGES.CONTENT_BROWSER_BADGE_UPDATE:
          debug(
            'setupMessagePassthrough - badge updated\n---\n\tMessage',
            command,
            '\n\tData',
            data,
            '\n\tSender',
            sender,
            '\n---',
          );
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
          debug(
            'setupMessagePassthrough - set serp config\n---\n\tMessage',
            command,
            '\n\tData',
            data,
            '\n\tSender',
            sender,
            '\n---',
          );
          const { lumosSerpConfig } = data;
          chrome.storage.sync.set({ [LUMOS_SERP_CONFIG]: lumosSerpConfig });
          break;

        case CLIENT_MESSAGES.CONTENT_BROWSER_GET_LUMOS_SERP_CONFIG:
          debug(
            'setupMessagePassthrough - get serp config\n---\n\tMessage',
            command,
            '\n\tData',
            data,
            '\n\tSender',
            sender,
            '\n---',
          );
          chrome.storage.sync.get([LUMOS_SERP_CONFIG], function (items) {
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
          debug(
            'setupMessagePassthrough - default message\n---\n\tMessage',
            command,
            '\n\tData',
            data,
            '\n\tSender',
            sender,
            '\n---',
          );
          this._nativeBrowserPostMessageToReactApp({
            command: command,
            data: {
              ...data,
              origin: sender.tab.url,
            },
          });
      }
    });
  }

  public loadHiddenMessenger(document: Document, window: Window): void {
    debug('loadHiddenMessenger - call');
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
    this.setupMessagePassthrough();
  }

  private _nativeBrowserPostMessageToReactApp: NativePostMessenger = ({ command, data }) => {
    debug('nativeBrowserPostMessageToReactApp - call');
    const iframe = this.messengerIframe;
    if (!this.isMessengerReady() && !this.isThrottled) {
      debug('nativeBrowserPostMessageToReactApp - post - throttle execution');
      this.isThrottled = true;
      this._nativeBrowserPostMessageToReactApp({ command: command, data: data });
      setTimeout(() => {
        this.isThrottled = false;
      }, 100);
      return;
    }
    iframe.contentWindow.postMessage({ command, ...data }, LUMOS_APP_URL);
    debug(
      'nativeBrowserPostMessageToReactApp - post\n---\n\tMessage',
      command,
      '\n\tData',
      data,
      '\n---',
    );
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
                  debug(
                    'monitorMessengerState - react app loaded\n---\n\tMessenger ID',
                    messengerId,
                    '\n---',
                  );
                  this.reactAppLoaded = true;
                } else {
                  debug(
                    'monitorMessengerState - messenger ready\n---\n\tMessenger ID',
                    messengerId,
                    '\n---',
                  );
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

import { debug, modifyPage, fetchInformationForModifiedPage, CLIENT_MESSAGES } from 'lumos-shared-js';
import { loadOrUpdateSidebar, reloadSidebar } from './sidebar';
import {
  nativeBrowserPostMessageToReactApp,
  nativeBrowserAddReactAppListener,
} from './messenger_content';
import { serpUrlToSearchText } from 'lumos-shared-js/src/content/modify_serp';
import { MESSAGES, PUBLIC_NETWORK_ID } from 'lumos-web/src/Constants';
import { postAPI } from './helpers';
import uuidv1 = require('uuid/v1');

debug('executing content script on', location.href);
function main(window: Window, document: Document, location: Location): void {
  // mutates document
  handleUrlUpdated(window, document, new URL(location.href));
}

function handleUrlUpdated(window: Window, document: Document, url: URL): void {
  var user = null;
  let lastModifiedHref: string = null;
  debug('function call - handleUrlUpdated:', url);

  // load or update the drawer
  // loadOrUpdateDrawer(document, url)

  nativeBrowserAddReactAppListener({
    window: window,
    message: MESSAGES.WEB_CONTENT_USER_IS_USER_LOGGED_IN,
    callback: (msg) => {
      let data = msg.data;
      debug(MESSAGES.WEB_CONTENT_USER_IS_USER_LOGGED_IN, data);
      user = data.user;
      // load or update the sidebar
      if (url.href !== lastModifiedHref) {
        lastModifiedHref = url.href;
        loadOrUpdateSidebar(document, url, user);
        if (document.readyState === 'loading') {
          document.addEventListener(
            'DOMContentLoaded',
            () => {
              debug('DOMContentLoaded:', url);
              modifyPage(
                url,
                window,
                document,
                nativeBrowserPostMessageToReactApp,
                nativeBrowserAddReactAppListener,
                user,
              );
            },
            false,
          );
        } else {
          debug('DOM Content already Loaded:', url);
          modifyPage(
            url,
            window,
            document,
            nativeBrowserPostMessageToReactApp,
            nativeBrowserAddReactAppListener,
            user,
          );
        }
        let userMemberships = [];
        if (user) {
          userMemberships = user.memberships.items.map((item: any) => ({
            network: item.network,
          }));
        } else {
          userMemberships = [{
            id: PUBLIC_NETWORK_ID,
          }];
        }
        logPageVisit(userMemberships, url).then(() => {
          debug('loggedPageVisit: ', url);
        });
      }
    },
  });
  nativeBrowserPostMessageToReactApp({
    command: MESSAGES.CONTENT_WEB_USER_IS_USER_LOGGED_IN,
    data: { origin: url.href },
  });

// Listen for front content messages
  window.addEventListener("message", (msg) => {
    if (msg.data?.command) {
      switch (msg.data.command) {
        case MESSAGES.WEB_CONTENT_USER_IS_USER_LOGGED_IN:
        let previousUser = user;
        user = msg.data.user;
        
        if (previousUser?.id !== user?.id) {
          chrome.runtime.sendMessage({
            command: CLIENT_MESSAGES.CONTENT_BROWSER_USER_UPDATE,
            data: user,
          });

          fetchInformationForModifiedPage(url, nativeBrowserPostMessageToReactApp);
          reloadSidebar(document, url, user);
        }

        break;
      }
    }
  });
}

async function logPageVisit(userMemberships: any, url: URL) {
  for (const network of userMemberships) {
    let log_id = uuidv1();
    await postAPI(
      'logger',
      { url: url.href },
      {
        id: log_id,
        url: url.href,
        publisher: url.hostname,
        timestamp: Date.now(),
        network: network.id,
      },
    );
  }
}
// Structure of the content script
// Loads a sidebar hidden
// Loads a drawer hidden

// Whenever the url changes (sync or async), script is rerun
// When sidebar API returns true,

main(window, document, location);

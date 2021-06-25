import React from 'react';
import { render } from 'react-dom';
import { IntroductionPage } from 'modules/onboarding';
import UserManager from 'lib/user';
import SidebarLoader from 'lib/sidebar';
import { activityMonitor } from 'lib/activity';
import { keyboardHandler, keyUpHandler } from 'lib/keyboard';
import { debug, extractPublication, replaceLocation } from 'lib/helpers';
import {
  URL_UPDATED_MESSAGE,
  MESSAGE,
  PAGE,
  TRIGGER_START_TRACK_TIMER_MESSAGE,
  ACTIVATE_EMAIL_MESSAGE,
  IN_DEBUG_MODE,
  IS_SIDEBAR_TAB_FRAME,
  IS_ROOT_FRAME,
} from 'constant';

(() => {
  if (IS_SIDEBAR_TAB_FRAME) {
    async () => {
      await import('./frame');
      await import('./block');
      await import('./reorder');
      await import('./results');
    };
  }

  if (IS_ROOT_FRAME) {
    (async (document: Document, location: Location) => {
      const LOCAL_URL = replaceLocation(location) ?? new URL(location.href);
      debug('execute content script\n---\n\tCurrent Location', extractPublication(LOCAL_URL.href));

      await UserManager.initialize();
      await SidebarLoader.loadOrUpdateSidebar(document, LOCAL_URL);

      if (location.href.includes('extension://')) {
        const root = document.getElementById('root');
        render(<IntroductionPage />, root);
      }

      const handleKeyDown = (event: KeyboardEvent) => keyboardHandler(event, SidebarLoader);
      const handleKeyUp = (event: KeyboardEvent) => keyUpHandler(event);
      document.addEventListener('keydown', handleKeyDown, true);
      document.addEventListener('keyup', handleKeyUp, true);

      chrome.runtime.onMessage.addListener(async (msg) => {
        switch (msg.type) {
          case ACTIVATE_EMAIL_MESSAGE:
            chrome.runtime.sendMessage({
              type: MESSAGE.OPEN_PAGE,
              page: PAGE.SETTINGS,
              email: decodeURIComponent(msg.email),
            });
            break;
          case URL_UPDATED_MESSAGE:
            await SidebarLoader.loadOrUpdateSidebar(document, LOCAL_URL);
            break;
        }
      });

      chrome.runtime.sendMessage({
        type: TRIGGER_START_TRACK_TIMER_MESSAGE,
        url: LOCAL_URL,
      });

      activityMonitor(document);

      await import('./block');
      await import('./results');

      if (IN_DEBUG_MODE) {
        await import('./hot');
      }
    })(document, location);
  }
})();

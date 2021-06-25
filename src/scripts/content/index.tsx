/**
 * @module scripts:content
 * @version 1.0.0
 * @license (C) Insight
 */

import React from 'react';
import { render } from 'react-dom';
import { IntroductionPage } from 'modules/onboarding';
import { activityMonitor } from 'lib/activity';
import { keyboardHandler, keyUpHandler } from 'lib/keyboard';
import {
  debug,
  extractPublication,
  replaceLocation,
  runFunctionWhenDocumentReady,
} from 'lib/helpers';
import {
  URL_UPDATED_MESSAGE,
  MESSAGE,
  PAGE,
  TRIGGER_START_TRACK_TIMER_MESSAGE,
  ACTIVATE_EMAIL_MESSAGE,
  IS_SIDEBAR_TAB_FRAME,
  IS_ROOT_FRAME,
  IS_CHROME_PAGE,
} from 'constant';

(() => {
  // prettier-ignore
  debug('Frame Type: ',
    (IS_SIDEBAR_TAB_FRAME && 'Sidebar Tab') ||
    (IS_ROOT_FRAME && 'Root Document') ||
    (IS_CHROME_PAGE && 'Chrome Page') ||
    "Unknown"
  );

  if (IS_SIDEBAR_TAB_FRAME) {
    (async () => {
      const LOAD_ASYNC_SCRIPTS_TO_TAB = async () => {
        await import('./frame');
        await import('./block');
        await import('./reorder');
        await import('./results');
      };
      runFunctionWhenDocumentReady(document, LOAD_ASYNC_SCRIPTS_TO_TAB);
    })();
  }

  if (IS_ROOT_FRAME) {
    (async (document: Document, location: Location) => {
      const LOCAL_URL = replaceLocation(location) ?? new URL(location.href);

      debug('Content Script - Entry\n---\n\tCurrent Location', extractPublication(LOCAL_URL.href));

      const UserManager = (await import('lib/user')).default;
      UserManager.initialize();

      const SidebarLoader = (await import('lib/sidebar')).default;
      SidebarLoader.loadOrUpdateSidebar(document, LOCAL_URL);

      if (IS_CHROME_PAGE) {
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

      const LOAD_ASYNC_SCRIPTS_TO_TOP = async () => {
        await import('./block');
        await import('./results');
      };

      runFunctionWhenDocumentReady(document, LOAD_ASYNC_SCRIPTS_TO_TOP);
    })(document, location);
  }
})();

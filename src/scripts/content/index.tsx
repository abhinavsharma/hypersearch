/**
 * @module scripts:content
 * @version 1.0.0
 * @license (C) Insight
 */

import React from 'react';
import { render } from 'react-dom';
import { keyboardHandler, keyUpHandler } from 'lib/keyboard';
import {
  debug,
  extractPublication,
  isDark,
  replaceLocation,
  runFunctionWhenDocumentReady,
} from 'lib/helpers';
import { IS_TOP_WINDOW_DARK_MESSAGE, MESSAGE, PAGE, URL_UPDATED_MESSAGE } from 'constant';
import darkmode from 'lib/darkmode';

const enableDarkMode = () => {
  return new Promise(() => {
    chrome.runtime.sendMessage({ type: IS_TOP_WINDOW_DARK_MESSAGE }, (isDark) => {
      isDark && darkmode.enable(document);
    });
  });
};

(async (window: Window, document: Document, location: Location) => {
  let isTop = false;

  try {
    isTop = window.location.href === window.top?.location.href;
  } catch {}

  if (!isTop) {
    enableDarkMode();
    const LOAD_ASYNC_SCRIPTS_TO_SIDEBAR_ONLY = async () => {
      await import('./frame');
      await import('./reorder');
      await import('./block');
      await import('./results');
    };
    runFunctionWhenDocumentReady(document, LOAD_ASYNC_SCRIPTS_TO_SIDEBAR_ONLY);
  }

  if (isTop) {
    const LOCAL_URL = replaceLocation(location) ?? new URL(location.href);

    debug(
      'Content Script - Entry\n---\n\tCurrent Location',
      extractPublication(LOCAL_URL.href) ?? LOCAL_URL.href,
    );

    const UserManager = (await import('lib/user')).default;
    await UserManager.initialize();

    const SidebarLoader = (await import('lib/sidebar')).default;
    window.location.href.includes('http') && SidebarLoader.loadOrUpdateSidebar(document, LOCAL_URL);

    if (window.top?.location.href.includes('extension://')) {
      const IntroductionPage = (await import('modules/onboarding')).IntroductionPage;
      const root = document.getElementById('root');
      render(<IntroductionPage />, root);
    } else {
      const LOAD_ASYNC_SCRIPTS_TO_ROOT_PAGE = async () => {
        await import('./block');
        await import('./frame');
        await import('./results');
      };

      runFunctionWhenDocumentReady(document, LOAD_ASYNC_SCRIPTS_TO_ROOT_PAGE);
    }

    const handleKeyDown = (event: KeyboardEvent) => keyboardHandler(event, SidebarLoader);
    const handleKeyUp = (event: KeyboardEvent) => keyUpHandler(event);
    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('keyup', handleKeyUp, true);

    window.addEventListener('message', ({ data }) => {
      if (data.name === MESSAGE.ADD_EXTERNAL_AUGMENTATION) {
        chrome.runtime.sendMessage({
          type: MESSAGE.OPEN_PAGE,
          page: PAGE.BUILDER,
          augmentation: data.result,
        });
      }
    });

    chrome.runtime.onMessage.addListener(async (msg, _, sendResponse) => {
      switch (msg.type) {
        case URL_UPDATED_MESSAGE:
          window.location.href.includes('http') &&
            (await SidebarLoader.loadOrUpdateSidebar(document, LOCAL_URL));
          break;
        case IS_TOP_WINDOW_DARK_MESSAGE:
          try {
            if (window.location.href === window.top?.location.href) {
              sendResponse(isDark());
            } else {
              sendResponse(false);
            }
          } catch {
            sendResponse(false);
          }

          break;
      }
    });
  }
})(window, document, location);

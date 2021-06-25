import React from 'react';
import { render } from 'react-dom';
import UserManager from 'lib/user';
import { activityMonitor } from 'lib/activity';
import SidebarLoader from 'lib/sidebar';
import { debug, replaceLocation } from 'lib/helpers';
import { keyboardHandler, keyUpHandler } from 'lib/keyboard';
import { IntroductionPage } from 'modules/introduction';
import {
  URL_UPDATED_MESSAGE,
  OPEN_AUGMENTATION_BUILDER_MESSAGE,
  SIDEBAR_PAGE,
  TRIGGER_START_TRACK_TIMER_MESSAGE,
  ADD_EXTERNAL_AUGMENTATION_MESSAGE,
  ACTIVATE_EMAIL_MESSAGE,
} from 'constant';

(async (document: Document, location: Location) => {
  debug(
    'execute content script\n---\n\tCurrent Location',
    location.href,
    '\n\tProject --- ',
    process.env.PROJECT === 'is' ? 'Insight' : 'SearchClub',
    '\n---',
  );
  await UserManager.initialize();
  if (location.href.includes('extension://')) {
    const root = document.getElementById('root');
    render(<IntroductionPage />, root);
  }
  window.addEventListener('message', ({ data }) => {
    if (data.name === ADD_EXTERNAL_AUGMENTATION_MESSAGE) {
      chrome.runtime.sendMessage({
        type: OPEN_AUGMENTATION_BUILDER_MESSAGE,
        page: SIDEBAR_PAGE.BUILDER,
        augmentation: data.result,
      });
    }
  });
  const handleKeyDown = (event: KeyboardEvent) => keyboardHandler(event, SidebarLoader);
  const handleKeyUp = (event: KeyboardEvent) => keyUpHandler(event);
  document.addEventListener('keydown', handleKeyDown, true);
  document.addEventListener('keyup', handleKeyUp, true);
  await import('./results');
  const url = replaceLocation(location) ?? new URL(location.href);
  await SidebarLoader.loadOrUpdateSidebar(document, url);
  chrome.runtime.onMessage.addListener(async (msg) => {
    switch (msg.type) {
      case ACTIVATE_EMAIL_MESSAGE:
        chrome.runtime.sendMessage({
          type: OPEN_AUGMENTATION_BUILDER_MESSAGE,
          page: SIDEBAR_PAGE.SETTINGS,
          email: decodeURIComponent(msg.email),
        });
        break;
      case URL_UPDATED_MESSAGE:
        await SidebarLoader.loadOrUpdateSidebar(document, url);
        break;
    }
  });
  chrome.runtime.sendMessage({
    type: TRIGGER_START_TRACK_TIMER_MESSAGE,
    url: window.location.href,
  });
  activityMonitor(document);
})(document, location);

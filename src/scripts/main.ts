import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import {
  activityMonitor,
  keyboardHandler,
  keyUpHandler,
  debug,
  replaceLocation,
  URL_UPDATED_MESSAGE,
  OPEN_AUGMENTATION_BUILDER_MESSAGE,
  OPEN_BUILDER_PAGE,
  TRIGGER_START_TRACK_TIMER_MESSAGE,
} from 'utils';

(async (document: Document, location: Location) => {
  debug(
    'execute content script\n---\n\tCurrent Location',
    location.href,
    '\n\tProject --- ',
    process.env.PROJECT === 'is' ? 'Insight' : 'SearchClub',
    '\n---',
  );
  window.addEventListener('message', ({ data }) => {
    if (data.name === 'ADD_EXTERNAL_AUGMENTATION') {
      chrome.runtime.sendMessage({
        type: OPEN_AUGMENTATION_BUILDER_MESSAGE,
        page: OPEN_BUILDER_PAGE.BUILDER,
        augmentation: data.result,
      } as OpenBuilderMessage);
    }
  });
  const handleKeyDown = (event: KeyboardEvent) => keyboardHandler(event, SidebarLoader);
  const handleKeyUp = (event: KeyboardEvent) => keyUpHandler(event);
  document.addEventListener('keydown', handleKeyDown, true);
  document.addEventListener('keyup', handleKeyUp, true);
  const url = replaceLocation(location);
  await import('./results');
  await SidebarLoader.loadOrUpdateSidebar(document, url);
  chrome.runtime.onMessage.addListener(async (msg) => {
    switch (msg.type) {
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

// !source: https://thisinterestsme.com/javascript-detect-user-activity/
// TODO: rework our own version of this base script
import {
  TRIGGER_START_TRACK_TIMER_MESSAGE,
  TRIGGER_STOP_TRACK_TIMER_MESSAGE,
} from 'utils/constants';
import { getPublicationUrl } from 'utils/helpers';

const MAX_INACTIVE_SECONDS = 10;

export const activityMonitor = (document: Document) => {
  if (!getPublicationUrl(window.location.href)) {
    return null;
  }
  let cancelled = false;
  let secondsSinceLastActivity = 0;

  const handleMonitor = () => {
    secondsSinceLastActivity++;
    if (secondsSinceLastActivity > MAX_INACTIVE_SECONDS) {
      chrome.runtime.sendMessage({ type: TRIGGER_STOP_TRACK_TIMER_MESSAGE });
      cancelled = true;
      clearInterval(monitor);
    }
  };

  let monitor = setInterval(handleMonitor, 1000);

  const activity = () => {
    if (cancelled) {
      cancelled = false;
      chrome.runtime.sendMessage({
        type: TRIGGER_START_TRACK_TIMER_MESSAGE,
        url: window.location.href,
      });
      monitor = setInterval(handleMonitor, 1000);
    }
    secondsSinceLastActivity = 0;
  };

  const activityEvents = ['mousedown', 'mousemove', 'keydown', 'scroll'];
  activityEvents.forEach(function (eventName) {
    document.addEventListener(eventName, activity, true);
  });
};

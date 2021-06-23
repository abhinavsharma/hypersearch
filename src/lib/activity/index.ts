/**
 * @module lib:activity
 * @version 1.0.0
 * @license (C) Insight
 */

import {
  MAX_INACTIVE_SECONDS,
  TRIGGER_START_TRACK_TIMER_MESSAGE,
  TRIGGER_STOP_TRACK_TIMER_MESSAGE,
} from 'constant';
import { getPublicationUrl } from 'lib/helpers';

export const activityMonitor = (document: Document): void => {
  if (!getPublicationUrl(window.location.href)) {
    return;
  }
  let cancelled = false;
  let secondsSinceLastActivity = 0;

  const handleMonitor = () => {
    secondsSinceLastActivity++;
    if (secondsSinceLastActivity > MAX_INACTIVE_SECONDS) {
      chrome.runtime.sendMessage({
        type: TRIGGER_STOP_TRACK_TIMER_MESSAGE,
        url: window.location.href,
      });
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

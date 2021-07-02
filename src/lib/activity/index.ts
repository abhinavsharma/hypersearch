/**
 * @module lib:activity
 * @version 1.0.0
 * @license (C) Insight
 */

import { getPublicationUrl } from 'lib/helpers';
import {
  MAX_INACTIVE_SECONDS,
  TRIGGER_START_TRACK_TIMER_MESSAGE,
  TRIGGER_STOP_TRACK_TIMER_MESSAGE,
} from 'constant';

const TRACKED_EVENTS = ['mousedown', 'mousemove', 'keydown', 'scroll'];

/**
 * Activity Monitor
 * --------------------------------------
 * Track user interactions to start/stop publication time tracker
 */
export const activityMonitor = (document: Document): void => {
  if (!getPublicationUrl(window.location.href)) {
    return;
  }

  let cancelled = false;
  let secondsSinceLastActivity = 0;

  // Tick every second and stop tracking if exceeds inactivity limit
  const handleMonitor = () => {
    secondsSinceLastActivity += 1;
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

  // Restart timer on user activity
  // Continuos tracking handled in background script
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

  TRACKED_EVENTS.forEach((event) => {
    document.addEventListener(event, activity, true);
  });
};

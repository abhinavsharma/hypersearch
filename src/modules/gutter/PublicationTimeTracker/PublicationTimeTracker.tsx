import React, { useEffect, useState } from 'react';
import {
  SYNC_PUBLICATION_TIME_TRACK_KEY,
  TRIGGER_PUBLICATION_TIMER_MESSAGE,
} from 'utils/constants';
import { sanitizeUrl } from 'utils/helpers';
import './PublicationTimeTracker.scss';

export const PublicationTimeTracker: PublicationTimeTracker = ({ domain }) => {
  const [currentTime, setCurrentTime] = useState<string>();

  const getDisplayTime = (time: number) => {
    if (!time || typeof time !== 'number') {
      return '';
    }
    const hours = Math.floor(time / 60);
    const mins = time % 60;
    return `${hours > 0 ? `${hours}h` : ''} ${mins > 0 ? `${mins}m` : ''}`;
  };

  const getCurrentTimeStamp = async () => {
    const stored =
      (await new Promise((resolve) =>
        chrome.storage.sync.get(SYNC_PUBLICATION_TIME_TRACK_KEY, resolve),
      ).then((value) => value[SYNC_PUBLICATION_TIME_TRACK_KEY])) ?? Object.create(null);
    setCurrentTime(getDisplayTime(stored[sanitizeUrl(domain)]));
  };

  useEffect(() => {
    getCurrentTimeStamp();
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.type === TRIGGER_PUBLICATION_TIMER_MESSAGE) {
        msg.domain === domain && setCurrentTime(getDisplayTime(msg.currentTime));
      }
    });
  }, []);

  return <div className="publication-time-tracker">{currentTime}</div>;
};

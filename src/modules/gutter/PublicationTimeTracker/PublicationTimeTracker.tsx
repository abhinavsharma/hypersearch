import React, { useEffect, useRef, useState } from 'react';
import Tooltip from 'antd/lib/tooltip';
import {
  SIDEBAR_Z_INDEX,
  SYNC_PUBLICATION_TIME_TRACK_KEY,
  TRIGGER_PUBLICATION_TIMER_MESSAGE,
} from 'utils/constants';
import { sanitizeUrl } from 'utils/helpers';
import 'antd/lib/tooltip/style/index.css';

export const PublicationTimeTracker: PublicationTimeTracker = ({ domain }) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const tooltipContainer = useRef(null);

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

  return (
    <div className="publication-time-tracker">
      <Tooltip
        title={`You have spent ${currentTime
          .replace('h', ' hours')
          .replace('m', ' minutes')} on ${domain} (this data is stored locally on this browser)`}
        destroyTooltipOnHide={{ keepParent: false }}
        getPopupContainer={() => tooltipContainer.current}
        placement="right"
        overlayClassName="gutter-tooltip"
      >
        {currentTime}{' '}
      </Tooltip>
      <div
        className="tooltip-container"
        ref={tooltipContainer}
        style={{ zIndex: SIDEBAR_Z_INDEX + 1 }}
      />
    </div>
  );
};

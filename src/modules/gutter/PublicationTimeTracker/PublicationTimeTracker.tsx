import React, { useCallback, useEffect, useRef, useState } from 'react';
import Tooltip from 'antd/lib/tooltip';
import {
  SIDEBAR_Z_INDEX,
  SYNC_PUBLICATION_TIME_TRACK_KEY,
  TRIGGER_PUBLICATION_TIMER_MESSAGE,
} from 'constant';
import { sanitizeUrl } from 'lib/helpers';
import 'antd/lib/tooltip/style/index.css';

/** MAGICS **/
const TOOLTIP_TEXT = `You have spent <time_placeholder> on <domain_placeholder> (this data is stored locally on this browser)`;
const TOOLTIP_CONTAINER_STYLE: React.CSSProperties = { zIndex: SIDEBAR_Z_INDEX + 1 };

export const PublicationTimeTracker: PublicationTimeTracker = ({ domain }) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const tooltipContainer = useRef<HTMLDivElement>(null);

  const getDisplayTime = (time: number) => {
    if (!time || typeof time !== 'number') {
      return '';
    }
    const hours = Math.floor(time / 60);
    const mins = time % 60;
    return `${hours > 0 ? `${hours}h` : ''} ${mins > 0 ? `${mins}m` : ''}`;
  };

  const getCurrentTimeStamp = useCallback(async () => {
    const stored =
      (await new Promise<Record<string, Record<string, number>>>((resolve) =>
        chrome.storage.sync.get(SYNC_PUBLICATION_TIME_TRACK_KEY, resolve),
      ).then((value) => value?.[SYNC_PUBLICATION_TIME_TRACK_KEY])) ?? Object.create(null);
    setCurrentTime(getDisplayTime(stored[sanitizeUrl(domain)]));
  }, [domain]);

  useEffect(() => {
    getCurrentTimeStamp();
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.type === TRIGGER_PUBLICATION_TIMER_MESSAGE) {
        msg.domain === domain && setCurrentTime(getDisplayTime(msg.currentTime));
      }
    });
  }, [domain, getCurrentTimeStamp]);

  const timeString = currentTime.replace('h', ' hours').replace('m', ' minutes');
  const keepParent = { keepParent: false };
  const getPopupContainer = () => tooltipContainer.current as HTMLDivElement;

  return (
    <div className="publication-time-tracker">
      <Tooltip
        title={TOOLTIP_TEXT.replace('<time_placeholder>', timeString).replace(
          '<domain_placeholder>',
          domain,
        )}
        destroyTooltipOnHide={keepParent}
        getPopupContainer={getPopupContainer}
        placement="right"
        overlayClassName="gutter-tooltip"
      >
        {currentTime}
      </Tooltip>
      <div className="tooltip-container" ref={tooltipContainer} style={TOOLTIP_CONTAINER_STYLE} />
    </div>
  );
};

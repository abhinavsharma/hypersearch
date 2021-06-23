import React, { useEffect, useRef, useState } from 'react';
import SidebarLoader from 'lib/sidebar';
import UserManager from 'lib/user';
import Skeleton from 'antd/lib/skeleton';
import { decodeSpace, triggerSerpProcessing } from 'lib/helpers';
import { keyboardHandler, keyUpHandler } from 'lib/keyboard';
import {
  EXTENSION_SERP_FILTER_LOADED,
  SIDEBAR_TAB_FAKE_URL,
  HIDE_FRAME_OVERLAY_MESSAGE,
  URL_PARAM_TAB_TITLE_KEY,
  EXTERNAL_PDF_RENDERER_URL,
} from 'constant';
import 'antd/lib/skeleton/style/index.css';

export const SidebarTabContainer: SidebarTabContainer = ({ tab }) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const handleKeyDown = (event: KeyboardEvent) => keyboardHandler(event, SidebarLoader);
  const handleKeyUp = (event: KeyboardEvent) => keyUpHandler(event);

  useEffect(() => {
    const { current: frame } = frameRef;

    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.type === HIDE_FRAME_OVERLAY_MESSAGE) {
        setIsLoaded(true);
      }
    });

    frame?.contentWindow?.addEventListener('keydown', handleKeyDown);
    frame?.contentWindow?.addEventListener('keyup', handleKeyUp);
    return () => {
      frame?.contentWindow?.removeEventListener('keydown', handleKeyDown);
      frame?.contentWindow?.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    triggerSerpProcessing(SidebarLoader, true);
    SidebarLoader.sendLogMessage(EXTENSION_SERP_FILTER_LOADED, {
      query: SidebarLoader.query,
      filter_name: tab.augmentation.name,
      license_keys: [UserManager.user.license],
      domains_to_search: SidebarLoader.domainsToSearch[tab.augmentation.id],
    });
  };

  const handleError = () => setIsLoaded(true);

  const OVERLAY_STYLE = {
    height: containerRef?.current?.clientHeight
      ? `${containerRef?.current?.clientHeight}px`
      : '100%',
  };

  return tab.url.href !== SIDEBAR_TAB_FAKE_URL ? (
    <div ref={containerRef} className="insight-tab-iframe-container">
      <iframe
        key={decodeSpace(tab.url.href)}
        ref={frameRef}
        sandbox="allow-forms allow-presentation allow-scripts allow-same-origin allow-popups"
        src={
          tab.url.pathname.match(/\.pdf$/)
            ? EXTERNAL_PDF_RENDERER_URL.replace('<placeholder>', decodeSpace(tab.url.href))
            : decodeSpace(tab.url.href)
        }
        className="insight-tab-iframe"
        onError={handleError}
        onLoad={handleLoad}
      />
      {!isLoaded && tab.url.searchParams.get(URL_PARAM_TAB_TITLE_KEY) && (
        <div className="insight-frame-overlay" ref={overlayRef} style={OVERLAY_STYLE}>
          {Array(Math.trunc(window.innerHeight / 120))
            .fill(null)
            .map((_, i) => (
              <Skeleton active key={i} />
            ))}
        </div>
      )}
    </div>
  ) : null;
};

import React, { useEffect, useRef, useState } from 'react';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import Skeleton from 'antd/lib/skeleton';
import {
  EXTENSION_SERP_FILTER_LOADED,
  HIDE_TAB_FAKE_URL,
  keyboardHandler,
  keyUpHandler,
  decodeSpace,
  triggerSerpProcessing,
  HIDE_FRAME_OVERLAY_MESSAGE,
} from 'utils';
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

    frame?.contentWindow.addEventListener('keydown', handleKeyDown);
    frame?.contentWindow.addEventListener('keyup', handleKeyUp);
    return () => {
      frame?.contentWindow.removeEventListener('keydown', handleKeyDown);
      frame?.contentWindow.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return tab.url.href !== HIDE_TAB_FAKE_URL ? (
    <div ref={containerRef} className="insight-tab-iframe-container">
      <iframe
        key={decodeSpace(tab.url.href)}
        ref={frameRef}
        sandbox="allow-forms allow-presentation allow-scripts allow-same-origin allow-popups"
        src={
          tab.url.pathname.match(/\.pdf$/)
            ? `https://docs.google.com/viewer?url=${decodeSpace(tab.url.href)}&embedded=true`
            : decodeSpace(tab.url.href)
        }
        className="insight-tab-iframe"
        onError={() => setIsLoaded(true)}
        onLoad={() => {
          setIsLoaded(true);
          triggerSerpProcessing(SidebarLoader, true);
          SidebarLoader.sendLogMessage(EXTENSION_SERP_FILTER_LOADED, {
            query: SidebarLoader.query,
            filter_name: tab.title,
            domains_to_search: SidebarLoader.domainsToSearch[tab.id],
          });
        }}
      />
      {!isLoaded && tab.url.searchParams.get('insight-tab-title') && (
        <div
          className="insight-frame-overlay"
          ref={overlayRef}
          style={{
            height: containerRef?.current?.clientHeight
              ? `${containerRef?.current?.clientHeight}px`
              : '100%',
          }}
        >
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

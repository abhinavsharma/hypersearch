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
} from 'utils';
import 'antd/lib/skeleton/style/index.css';

export const SidebarTabContainer: SidebarTabContainer = ({ tab }) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const handleKeyDown = (event: KeyboardEvent) => keyboardHandler(event, SidebarLoader);
  const handleKeyUp = (event: KeyboardEvent) => keyUpHandler(event);

  useEffect(() => {
    const { current } = frameRef;
    current?.contentWindow.addEventListener('keydown', handleKeyDown);
    current?.contentWindow.addEventListener('keyup', handleKeyUp);
    return () => {
      current?.contentWindow.removeEventListener('keydown', handleKeyDown);
      current?.contentWindow.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return tab.url.href !== HIDE_TAB_FAKE_URL ? (
    <>
      <iframe
        key={decodeSpace(tab.url.href)}
        ref={frameRef}
        sandbox="allow-forms allow-presentation allow-scripts allow-same-origin allow-popups"
        src={decodeSpace(tab.url.href)}
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
      {!isLoaded && (
        <div className="insight-frame-overlay">
          {Array(Math.trunc(window.innerHeight / 120))
            .fill(null)
            .map((_, i) => (
              <Skeleton active key={i} />
            ))}
        </div>
      )}
    </>
  ) : null;
};

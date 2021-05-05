import React, { useEffect, useRef } from 'react';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import {
  EXTENSION_SERP_FILTER_LOADED,
  HIDE_TAB_FAKE_URL,
  keyboardHandler,
  keyUpHandler,
  decodeSpace,
  triggerSerpProcessing,
} from 'utils';

export const SidebarTabContainer: SidebarTabContainer = ({ tab }) => {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const handleKeyDown = (event: KeyboardEvent) => keyboardHandler(event, SidebarLoader);
  const handleKeyUp = (event: KeyboardEvent) => keyUpHandler(event);

  useEffect(() => {
    frameRef.current?.contentWindow.addEventListener('keydown', handleKeyDown);
    frameRef.current?.contentWindow.addEventListener('keyup', handleKeyUp);
    return () => {
      frameRef.current?.contentWindow.removeEventListener('keydown', handleKeyDown);
      frameRef.current?.contentWindow.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return tab.url.href !== HIDE_TAB_FAKE_URL ? (
    <iframe
      ref={frameRef}
      sandbox="allow-forms allow-presentation allow-scripts allow-storage-access-by-user-activation allow-same-origin"
      src={decodeSpace(tab.url.href)}
      className="insight-tab-iframe"
      onLoad={() => {
        triggerSerpProcessing(SidebarLoader, true);
        SidebarLoader.sendLogMessage(EXTENSION_SERP_FILTER_LOADED, {
          query: SidebarLoader.query,
          filter_name: tab.title,
          domains_to_search: SidebarLoader.domainsToSearch[tab.id],
        });
      }}
    />
  ) : null;
};

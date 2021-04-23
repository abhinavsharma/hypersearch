import React, { useEffect, useRef } from 'react';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import {
  EXTENSION_SERP_FILTER_LOADED,
  PROCESS_SERP_OVERLAY_MESSAGE,
  HIDE_TAB_FAKE_URL,
  keyboardHandler,
  keyUpHandler,
  SEARCH_HIDE_DOMAIN_ACTION,
  decodeSpace,
} from 'utils';

export const SidebarTabContainer: SidebarTabContainer = ({ tab }) => {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const handleKeyDown = (event: KeyboardEvent) => keyboardHandler(event, SidebarLoader);
  const handleKeyUp = (event: KeyboardEvent) => keyUpHandler(event);

  useEffect(() => {
    frameRef.current?.contentWindow.addEventListener('keydown', handleKeyDown);
    frameRef.current?.contentWindow.addEventListener('keyup', handleKeyUp);
    return () => frameRef.current?.contentWindow.removeEventListener('keydown', handleKeyDown);
  }, []);

  return tab.url.href !== HIDE_TAB_FAKE_URL ? (
    <iframe
      ref={frameRef}
      src={decodeSpace(tab.url.href)}
      className="insight-tab-iframe"
      onLoad={() => {
        frameRef.current?.contentWindow.postMessage(
          {
            augmentation: SidebarLoader.sidebarTabs.reduce((a, { augmentation }) => {
              augmentation.actions.action_list.find(
                ({ key }) => key === SEARCH_HIDE_DOMAIN_ACTION,
              ) && a.push(augmentation);
              return a;
            }, []),
            hideDomains: SidebarLoader.hideDomains,
            name: PROCESS_SERP_OVERLAY_MESSAGE,
            tab: tab.id,
            selector: {
              link: SidebarLoader.customSearchEngine.querySelector['phone'],
              featured: SidebarLoader.customSearchEngine.querySelector.featured,
              container: SidebarLoader.customSearchEngine.querySelector.result_container_selector,
            },
          },
          '*',
        );
        SidebarLoader.sendLogMessage(EXTENSION_SERP_FILTER_LOADED, {
          query: SidebarLoader.query,
          filter_name: tab.title,
          domains_to_search: SidebarLoader.domainsToSearch[tab.id],
        });
      }}
    />
  ) : null;
};

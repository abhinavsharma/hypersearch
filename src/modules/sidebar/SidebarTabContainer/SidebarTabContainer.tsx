import React, { useEffect, useRef } from 'react';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import {
  EXTENSION_SERP_FILTER_LOADED,
  PROCESS_SERP_OVERLAY_MESSAGE,
  HIDE_TAB_FAKE_URL,
  keyboardHandler,
  keyUpHandler,
  SEARCH_HIDE_DOMAIN_ACTION,
} from 'utils';

export const SidebarTabContainer: SidebarTabContainer = ({ tab }) => {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const handleKeyDown = (event: KeyboardEvent) => keyboardHandler(event, SidebarLoader);
  const handleKeyUp = (event: KeyboardEvent) => keyUpHandler(event);

  const hideDomains = tab.augmentation?.actions.action_list.reduce((a, { key, value }) => {
    if (key === SEARCH_HIDE_DOMAIN_ACTION) a.push(value[0]);
    return a;
  }, []);

  useEffect(() => {
    frameRef.current?.contentWindow.addEventListener('keydown', handleKeyDown);
    frameRef.current?.contentWindow.addEventListener('keyup', handleKeyUp);
    window.top.postMessage(
      {
        augmentation: tab.augmentation,
        hideDomains,
        name: PROCESS_SERP_OVERLAY_MESSAGE,
        tab: tab.id,
        selector: {
          link:
            SidebarLoader.customSearchEngine.querySelector[
              window.top.location.href.search(/google\.com/) > -1 ? 'pad' : 'desktop'
            ],
          featured: SidebarLoader.customSearchEngine.querySelector.featured ?? Array(0),
          container: SidebarLoader.customSearchEngine.querySelector.result_container_selector,
        },
      },
      '*',
    );
    return () => frameRef.current?.contentWindow.removeEventListener('keydown', handleKeyDown);
  }, []);
  return tab.url.href !== HIDE_TAB_FAKE_URL ? (
    <iframe
      ref={frameRef}
      src={unescape(tab.url.href)}
      className="insight-tab-iframe"
      onLoad={() => {
        SidebarLoader.sendLogMessage(EXTENSION_SERP_FILTER_LOADED, {
          query: SidebarLoader.query,
          filter_name: tab.title,
          domains_to_search: SidebarLoader.domainsToSearch[tab.id],
        });
      }}
    />
  ) : null;
};

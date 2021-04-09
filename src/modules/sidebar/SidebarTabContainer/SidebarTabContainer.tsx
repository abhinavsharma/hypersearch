import React, { useEffect, useRef } from 'react';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import {
  EXTENSION_SERP_FILTER_LOADED,
  HIDE_DOMAINS_MESSAGE,
  HIDE_TAB_FAKE_URL,
  keyboardHandler,
  SEARCH_HIDE_DOMAIN_ACTION,
} from 'utils';

export const SidebarTabContainer: SidebarTabContainer = ({ tab }) => {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const augmentation =
    (!tab.augmentation.hasOwnProperty('enabled')
      ? SidebarLoader.suggestedAugmentations
      : SidebarLoader.installedAugmentations
    ).find(({ id }) => id === tab.id) ?? Object.create(null);
  const handleKeyDown = (event: KeyboardEvent) => keyboardHandler(event, SidebarLoader);

  const hideDomains = tab.augmentation.actions.action_list.reduce((a, { key, value }) => {
    if (key === SEARCH_HIDE_DOMAIN_ACTION) a.push(value[0]);
    return a;
  }, []);

  useEffect(() => {
    frameRef.current?.contentWindow.addEventListener('keydown', handleKeyDown);
    if (hideDomains) {
      window.top.postMessage(
        {
          augmentation,
          hideDomains,
          name: HIDE_DOMAINS_MESSAGE,
          tab: tab.id,
          selector: {
            link:
              SidebarLoader.customSearchEngine.querySelector[
                window.top.location.href.search(/google\.com/) > -1 ? 'pad' : 'desktop'
              ],
            featured: SidebarLoader.customSearchEngine.querySelector.featured,
            container: SidebarLoader.customSearchEngine.querySelector.result_container_selector,
          },
        },
        '*',
      );
    }
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

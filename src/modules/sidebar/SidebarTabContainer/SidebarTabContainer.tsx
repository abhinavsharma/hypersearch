import React, { useEffect } from 'react';
import { EXTENSION_SERP_FILTER_LOADED, HIDE_DOMAINS_MESSAGE, SIDEBAR_WIDTH } from 'utils/constants';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';

export const SidebarTabContainer: SidebarTabContainer = ({ tab }) => {
  useEffect(() => {
    if (tab.hideDomains.length) {
      window.top.postMessage(
        {
          name: HIDE_DOMAINS_MESSAGE,
          url: tab.url.href,
          hideDomains: tab.hideDomains,
          selector: {
            link:
              SidebarLoader.customSearchEngine.querySelector[
                window.top.location.href.search(/google\.com/) > -1 ? 'pad' : 'desktop'
              ],
            container: SidebarLoader.customSearchEngine.querySelector.result_container_selector,
          },
        },
        '*',
      );
    }
  }, []);

  return (
    <iframe
      src={unescape(tab.url.href)}
      width={SIDEBAR_WIDTH}
      className="insight-tab-iframe"
      onLoad={() => {
        SidebarLoader.sendLogMessage(EXTENSION_SERP_FILTER_LOADED, {
          query: SidebarLoader.query,
          filter_name: tab.title,
          domains_to_search: SidebarLoader.domainsToSearch[tab.id],
        });
      }}
    />
  );
};

import React from 'react';
import { EXTENSION_SERP_FILTER_LOADED, SEND_LOG_MESSAGE } from 'utils/constants';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';

export const SidebarTabContainer: SidebarTabContainer = ({ tab }) => {
  return (
    <iframe
      src={unescape(tab.url.href)}
      width={450}
      className="insight-tab-iframe"
      onLoad={() => {
        !SidebarLoader.strongPrivacy &&
          chrome.runtime.sendMessage({
            type: SEND_LOG_MESSAGE,
            event: EXTENSION_SERP_FILTER_LOADED,
            properties: {
              query: SidebarLoader.query,
              filter_name: tab.title,
              domains_to_search: SidebarLoader.domainsToSearch[tab.id],
            },
          });
      }}
    />
  );
};

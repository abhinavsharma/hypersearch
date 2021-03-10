import React from 'react';
import {
  EXTENSION_SERP_FILTER_LOADED,
  GET_TAB_DOMAINS_MESSAGE,
  SEND_LOG_MESSAGE,
} from 'utils/constants';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import { SidebarTabDomains } from 'modules/sidebar';

export const SidebarTabContainer: SidebarTabContainer = ({ tab }) => {
  return (
    <>
      <SidebarTabDomains tab={tab} />
      <iframe
        src={tab.url.href}
        className="insight-tab-iframe"
        onLoad={(e) => {
          e.currentTarget.contentWindow.postMessage(
            {
              type: GET_TAB_DOMAINS_MESSAGE,
              tab: tab.id,
            },
            '*',
          );
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
    </>
  );
};

import React, { useCallback, useEffect, useState } from 'react';
import { EXTENSION_SERP_FILTER_LOADED, SEND_LOG_MESSAGE } from 'utils/constants';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';

export const SidebarTabContainer: SidebarTabContainer = ({ tab }) => {
  const [isStrongPrivacyEnabled, setIsStrongPrivacyEnabled] = useState<boolean>(false);

  const getStrongPrivacyPreference = useCallback(
    async () =>
      await new Promise((resolve) =>
        chrome.storage.local.get('anonymousQueries', resolve),
      ).then(({ anonymousQueries }) => setIsStrongPrivacyEnabled(!anonymousQueries)),
    [],
  );

  useEffect(() => {
    getStrongPrivacyPreference();
  }, [getStrongPrivacyPreference]);

  return (
    <iframe
      src={unescape(tab.url.href)}
      width={450}
      className="insight-tab-iframe"
      onLoad={() => {
        !isStrongPrivacyEnabled &&
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

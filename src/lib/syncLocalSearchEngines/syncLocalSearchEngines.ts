import { CUSTOM_SEARCH_ENGINES } from 'lib/handleSubtabApiResponse';

export const syncLocalSearchEngines = async () => {
  const customSearchEngines = await fetch(CUSTOM_SEARCH_ENGINES);
  const parsed: Record<string, CustomSearchEngine> = await customSearchEngines.json();

  chrome.storage.sync.get((items) => {
    Object.entries(items).forEach(([key, item]: [string, CustomSearchEngine]) => {
      if (!(item.hasOwnProperty('querySelector') && item.hasOwnProperty('search_engine_json'))) {
        chrome.storage.sync.remove(key);
      }

      const desktopSelector = item?.querySelector?.desktop;

      const storedItem = Object.values(parsed).find(
        ({ querySelector }) => querySelector.desktop == desktopSelector,
      );

      if (!storedItem) {
        chrome.storage.sync.remove(key);
      }

      if (storedItem.querySelector.desktop !== desktopSelector) {
        chrome.storage.sync.remove(key);
      }

      if (
        !Array.isArray(item.search_engine_json.required_params) ||
        typeof item.search_engine_json.required_prefix !== 'string'
      ) {
        chrome.storage.sync.remove(key);
      }
    });
  });
};

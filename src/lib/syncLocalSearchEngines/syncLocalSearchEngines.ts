import { CUSTOM_SEARCH_ENGINES } from 'lib/handleSubtabApiResponse';
import { debug } from 'lumos-shared-js';

const deleteItem = async (key: string) => {
  return await new Promise((resolve) =>
    chrome.storage.sync.remove(key, () => resolve('Successfully deleted!')),
  );
};

export const syncLocalSearchEngines = async () => {
  debug('function call - syncLocalSearchEngines');
  const customSearchEngines = await fetch(CUSTOM_SEARCH_ENGINES);
  const parsed: Record<string, CustomSearchEngine> = await customSearchEngines.json();
  chrome.storage.sync.get(async (items) => {
    Object.entries(items).forEach(async ([key, storedItem]: [string, CustomSearchEngine]) => {
      // Check if stored value has the required structure
      if (!(storedItem.querySelector && storedItem.search_engine_json)) deleteItem(key);

      // Get matching item from the remote JSON blob
      const remoteItem = Object.values(parsed).find(
        ({ querySelector }) => querySelector?.desktop == storedItem.querySelector.desktop,
      );

      // Remove item from storage if its not present in the remote
      if (!remoteItem) deleteItem(key);

      // Remove item if required params are not matching
      const paramsMismatch =
        storedItem.search_engine_json.required_params
          .reduce((a, c) => {
            !remoteItem.search_engine_json.required_params.includes(c) && a.push(false);
            return a;
          }, [])
          .indexOf(false) > -1;

      if (paramsMismatch) deleteItem(key);

      // Remove item if required prefix is not matching
      if (
        storedItem.search_engine_json.required_prefix !==
        remoteItem.search_engine_json.required_prefix
      )
        deleteItem(key);
    });
  });
};

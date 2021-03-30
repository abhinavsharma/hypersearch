/**
 * @module SearchEngineManager
 * @author Matyas Angyal<matyas@laso.ai>
 * @license (C) Insight
 * @version 1.0.0
 */
import { CUSTOM_SEARCH_ENGINES } from 'utils/constants';
import { debug } from 'utils/helpers';

class SearchEngineManager {
  throttled: boolean;
  safeElements: string[];

  constructor() {
    debug('SearchEngineManager - initialize\n---\n\tSingleton Instance', this, '\n---');
    this.safeElements = ['distinctId'];
    this.throttled = false;
  }

  public async sync() {
    if (this.throttled) {
      debug('SearchEngineManager - sync - throttle execution');
      return null;
    }
    this.throttled = true;
    const customSearchEngines = await fetch(CUSTOM_SEARCH_ENGINES);
    const parsed: Record<string, CustomSearchEngine> = await customSearchEngines.json();
    await new Promise((resolve) =>
      chrome.storage.sync.get(async (items) => {
        debug('SearchEngineManager - sync\n---\n\tItems', items, '\n---');
        Object.entries(items).forEach(async ([key, storedItem]: [string, CustomSearchEngine]) => {
          if (this.safeElements.includes(key)) return null;
          if (!(storedItem.querySelector && storedItem.search_engine_json)) {
            // Check if stored value has the required structure
            await this.deleteItem(key);
          }
          // Get matching item from the remote JSON blob
          const remoteItem = Object.values(parsed).find(
            ({ querySelector }) =>
              querySelector?.desktop !== undefined &&
              querySelector?.desktop === storedItem?.querySelector?.desktop,
          );
          // Remove item from storage if its not present in the remote
          if (!remoteItem) {
            await this.deleteItem(key);
          }
          // Remove item if required params are not matching
          const paramsMismatch =
            storedItem?.search_engine_json?.required_params
              .reduce((a, c) => {
                a.push(remoteItem?.search_engine_json?.required_params.includes(c));
                return a;
              }, [])
              .indexOf(false) > -1;

          if (paramsMismatch) {
            await this.deleteItem(key);
          }
          // Remove item if required prefix is not matching
          if (
            storedItem?.search_engine_json?.required_prefix !==
              remoteItem?.search_engine_json?.required_prefix &&
            remoteItem?.search_engine_json?.required_prefix !== undefined
          ) {
            await this.deleteItem(key);
          }
        });
        resolve('');
      }),
    );
    setTimeout(() => (this.throttled = false), 60000);
  }

  private async deleteItem(key: string) {
    debug('SearchEngineManager - delete\n---\n\tKey', key, '\n---');
    return await new Promise((resolve) =>
      chrome.storage.sync.remove(key, () => resolve('Successfully deleted!')),
    );
  }
}

const instance = new SearchEngineManager();

export default instance;

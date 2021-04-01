/**
 * @module SearchEngineManager
 * @author Matyas Angyal<matyas@laso.ai>
 * @license (C) Insight
 * @version 1.0.0
 */
import { CUSTOM_SEARCH_ENGINES } from 'utils/constants';
import { debug, extractUrlProperties } from 'utils/helpers';

class SearchEngineManager {
  public throttled: boolean;
  private safeElements: string[];
  private remoteBlob: Record<string, CustomSearchEngine>;

  constructor() {
    debug('SearchEngineManager - initialize\n---\n\tSingleton Instance', this, '\n---');
    this.safeElements = ['distinctId', 'licenseActivated'];
    this.throttled = false;
  }

  /**
   * Check the local storage for a stored custom search engine object. If it is not found,
   * the method will fetch avaliable CSEs from remote host and store the matching value.
   *
   * @private
   * @method
   * @memberof SidebarLoader
   */
  public async getCustomSearchEngine(url: string) {
    debug('getCustomSearchEngine - call\n');
    let storedValue: Record<string, CustomSearchEngine>;
    const { hostname, params } = extractUrlProperties(url);
    if (!hostname) return null;
    const storageKey = hostname.replace(/\./g, '_');
    storedValue = await new Promise((resolve) => chrome.storage.sync.get(storageKey, resolve));
    if (!storedValue?.[storageKey]) {
      debug('getCustomSearchEngine - fetch from remote\n');
      const result: CustomSearchEngine = Object.create({});
      const customSearchEngines = await fetch(CUSTOM_SEARCH_ENGINES);
      const results: Record<string, CustomSearchEngine> = await customSearchEngines.json();
      Object.values(results).forEach((customSearchEngine) => {
        const hasAllMatchinParams = !customSearchEngine.search_engine_json.required_params.filter(
          (i) => !params.includes(i),
        ).length;
        const hasRequiredPrefix = !!url.match(customSearchEngine.search_engine_json.required_prefix)
          ?.length;
        if (hasAllMatchinParams && hasRequiredPrefix)
          Object.assign(result, { ...customSearchEngine });
      });
      chrome.storage.sync.set({ [storageKey]: result });
      storedValue = { [storageKey]: result };
    }
    const result = storedValue[storageKey] ?? Object.create(null);
    debug('getCustomSearchEngine - processed\n---\n\tCustom Search Engine JSON', result, '\n---');
    return result;
  }

  public async sync() {
    if (this.throttled) {
      debug('SearchEngineManager - sync - throttle execution');
      return null;
    }
    this.throttled = true;
    if (!this.remoteBlob) {
      debug('SearchEngineManager - sync - fetching remote');
      const customSearchEngines = await fetch(CUSTOM_SEARCH_ENGINES);
      this.remoteBlob = await customSearchEngines.json();
      debug('SearchEngineManager - sync\n---\n\tRemote', this.remoteBlob, '\n---');
    }
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
          const remoteItem = Object.values(this.remoteBlob).find(
            ({ querySelector }) =>
              querySelector?.desktop !== undefined &&
              querySelector?.desktop === storedItem?.querySelector?.desktop &&
              !querySelector?.featured.find(
                (item) => !storedItem?.querySelector?.featured.includes(item),
              ) &&
              querySelector?.pad === storedItem?.querySelector?.pad &&
              querySelector?.phone === storedItem?.querySelector?.phone &&
              querySelector?.result_container_selector ===
                storedItem?.querySelector?.result_container_selector,
          );
          // Remove item from storage if its not present in the remote
          if (!remoteItem) {
            await this.deleteItem(key, 'Property mismatch in local item');
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
            await this.deleteItem(key, 'Required params mismatch');
          }
          // Remove item if required prefix is not matching
          if (
            storedItem?.search_engine_json?.required_prefix !==
              remoteItem?.search_engine_json?.required_prefix &&
            remoteItem?.search_engine_json?.required_prefix !== undefined
          ) {
            await this.deleteItem(key, 'Required prefix mismatch');
          }
        });
        resolve('');
      }),
    );
    setTimeout(() => (this.throttled = false), 6000);
  }

  private async deleteItem(key: string, reason?: string) {
    debug('SearchEngineManager - delete\n---\n\tKey', key, '\n\tReason ', reason, '\n---');
    return await new Promise((resolve) =>
      chrome.storage.sync.remove(key, () => resolve('Successfully deleted!')),
    );
  }
}

const instance = new SearchEngineManager();

export default instance;

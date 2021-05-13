/**
 * @module SearchEngineManager
 * @author Matyas Angyal<matyas@laso.ai>
 * @license (C) Insight
 * @version 1.0.0
 */
import {
  debug,
  CUSTOM_SEARCH_ENGINES,
  extractUrlProperties,
  INTENTS_BLOB_URL,
  SYNC_LICENSE_KEY,
  SYNC_FINISHED_KEY,
  SYNC_PRIVACY_KEY,
  SYNC_DISTINCT_KEY,
  USE_COUNT_PREFIX,
  EMPTY_CUSTOM_SEARCH_ENGINE_BLOB,
  SYNC_PUBLICATION_TIME_TRACK_KEY,
} from 'utils';

class SearchEngineManager {
  /**
   * The list of available search intents.
   *
   * @public
   * @property
   * @memberof SearchEngineManager
   */
  public intents: SearchIntent[];

  /**
   * The list of available search engines;
   *
   * @public
   * @property
   * @memberof SearchEngineManager
   */
  public engines: Record<string, CustomSearchEngine>;

  /**
   * This value is used to decide whether to sync locally stored CSE data.
   *
   * @private
   * @property
   * @memberof SearchEngineManager
   */
  private throttled: boolean;

  /**
   * The list of storage keys, which will be ignored by the cleanup while sync.
   *
   * @private
   * @property
   * @memberof SearchEngineManager
   */
  private safeElements: string[];

  /**
   * Stored copy of the remote CSE data for efficient sync processing.
   *
   * @private
   * @property
   * @memberof SearchEngineManager
   */
  private remoteBlob: Record<string, CustomSearchEngine>;

  constructor() {
    debug('SearchEngineManager - initialize\n---\n\tSingleton Instance', this, '\n---');
    this.safeElements = [
      SYNC_DISTINCT_KEY,
      SYNC_LICENSE_KEY,
      SYNC_PRIVACY_KEY,
      SYNC_FINISHED_KEY,
      SYNC_PUBLICATION_TIME_TRACK_KEY,
    ];
    this.engines = Object.create(null);
    this.intents = [];
    this.remoteBlob = Object.create(null);
    this.throttled = false;
    this.getIntents();
    this.getEngines();
  }

  /**
   * Get remotely stored search intents blob and store them in the public `intents` property.
   * This method will be called at instaciation time and available when the sidebar loads.
   *
   * @public
   * @method
   * @memberof SidebarLoader
   */
  public async getIntents() {
    const raw = await fetch(INTENTS_BLOB_URL, { mode: 'cors' });
    this.intents = await raw.json();
  }

  /**
   * Get remotely stored search intents blob and store them in the public `intents` property.
   * This method will be called at instaciation time and available when the sidebar loads.
   *
   * @public
   * @method
   * @memberof SidebarLoader
   */
  private async getEngines() {
    const raw = await fetch(CUSTOM_SEARCH_ENGINES, { mode: 'cors' });
    this.engines = await raw.json();
  }

  /**
   * Check the local storage for a stored custom search engine object. If it is not found,
   * the method will fetch avaliable CSEs from remote host and store the matching value.
   *
   * TODO: refactor related code to let this be a private method
   *
   * @private
   * @method
   * @memberof SidebarLoader
   */
  public async getCustomSearchEngine(url: string) {
    debug('getCustomSearchEngine - call\n');
    let storedValue: Record<string, CustomSearchEngine>;
    const { hostname, params } = extractUrlProperties(url);
    if (!hostname) return EMPTY_CUSTOM_SEARCH_ENGINE_BLOB;
    const localized =
      hostname.search(/google\.[\w]*/) > -1 ? hostname.replace(/\.[\w.]*$/, '.com') : hostname;
    const storageKey = localized.replace(/\./g, '_');
    storedValue = await new Promise((resolve) => chrome.storage.sync.get(storageKey, resolve));
    if (!storedValue?.[storageKey]) {
      debug('getCustomSearchEngine - fetch from remote\n');
      const result: CustomSearchEngine = EMPTY_CUSTOM_SEARCH_ENGINE_BLOB;
      const customSearchEngines = await fetch(CUSTOM_SEARCH_ENGINES, { cache: 'no-cache' });
      const results: Record<string, CustomSearchEngine> = await customSearchEngines.json();
      Object.values(results).forEach((customSearchEngine) => {
        const hasAllMatchingParams = !customSearchEngine.search_engine_json.required_params.filter(
          (i) => !params.includes(i),
        ).length;
        const hasRequiredPrefix = !!url.match(customSearchEngine.search_engine_json.required_prefix)
          ?.length;
        if (hasAllMatchingParams && hasRequiredPrefix)
          Object.assign(result, { ...customSearchEngine });
      });
      chrome.storage.sync.set({ [storageKey]: result });
      storedValue = { [storageKey]: result };
    }
    const result = storedValue[storageKey] ?? EMPTY_CUSTOM_SEARCH_ENGINE_BLOB;
    debug('getCustomSearchEngine - processed\n---\n\tCustom Search Engine JSON', result, '\n---');
    return result;
  }

  /**
   * Iterate over the locally stored CSE data and remove corrupted data from it.
   *
   * @public
   * @method
   * @memberof SidebarLoader
   */
  public async sync(): Promise<void> {
    if (this.throttled) {
      debug('SearchEngineManager - sync - throttle execution');
      return;
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
          if (this.safeElements.includes(key) || key.startsWith(USE_COUNT_PREFIX)) return null;
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
          const paramsMismatch = storedItem?.search_engine_json?.required_params.every((c) =>
            remoteItem?.search_engine_json?.required_params.includes(c),
          );

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

  /**
   * Remove an item from the local storage;
   *
   * @private
   * @method
   * @memberof SidebarLoader
   */
  private async deleteItem(key: string, reason?: string) {
    debug('SearchEngineManager - delete\n---\n\tKey', key, '\n\tReason ', reason, '\n---');
    return await new Promise((resolve) =>
      chrome.storage.sync.remove(key, () => resolve('Successfully deleted!')),
    );
  }
}

const instance = new SearchEngineManager();

export default instance;

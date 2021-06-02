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
  EMPTY_CUSTOM_SEARCH_ENGINE_BLOB,
  ARBITRARY_ENGINE_PREFIX,
  DEDICATED_ENGINE_PREFIX,
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
   * Stored copy of the remote CSE data for efficient sync processing.
   *
   * @private
   * @property
   * @memberof SearchEngineManager
   */
  private remoteBlob: Record<string, CustomSearchEngine>;

  constructor() {
    debug('SearchEngineManager - initialize\n---\n\tSingleton Instance', this, '\n---');
    this.engines = Object.create(null);
    this.intents = [];
    this.remoteBlob = Object.create(null);
    this.throttled = false;
    this.getIntents();
    this.getEngines();
  }

  /**
   * Get remotely stored search intents blob and store them in the public `intents` property.
   * This method will be called at instantiation time and available when the sidebar loads.
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
   * This method will be called at instantiation time and available when the sidebar loads.
   *
   * @public
   * @method
   * @memberof SidebarLoader
   */
  private async getEngines() {
    const raw = await fetch(CUSTOM_SEARCH_ENGINES, { mode: 'cors' });
    const remote = await raw.json();
    const local = await new Promise<Record<string, any>>((resolve) =>
      chrome.storage.sync.get(null, resolve),
    ).then((items) =>
      Object.entries(items).reduce((acc, [key, value]) => {
        if (key.startsWith(ARBITRARY_ENGINE_PREFIX) || key.startsWith(DEDICATED_ENGINE_PREFIX)) {
          Object.assign(acc, {
            [key
              .replace(ARBITRARY_ENGINE_PREFIX, '')
              .replace(DEDICATED_ENGINE_PREFIX, '')
              .substr(1)]: value,
          });
        }
        return acc;
      }, Object.create(null) as Record<string, CustomSearchEngine>),
    );
    this.engines = Object.assign(remote, local);
  }

  public async createArbitraryEngine(name: string, engine: CustomSearchEngine) {
    chrome.storage.sync.set({ [`${ARBITRARY_ENGINE_PREFIX}-${name}`]: engine });
    Object.assign(this.engines, { [name]: engine });
  }

  /**
   * Check the local storage for a stored custom search engine object. If it is not found,
   * the method will fetch available CSEs from remote host and store the matching value.
   *
   * TODO: refactor related code to let this be a private method
   *
   * @private
   * @method
   * @memberof SidebarLoader
   */
  public async getCustomSearchEngine(url: string) {
    debug('getCustomSearchEngine - call\n');
    const { hostname, params } = extractUrlProperties(url);

    if (!hostname) return EMPTY_CUSTOM_SEARCH_ENGINE_BLOB;

    const localized = hostname.replace(/\.[\w.]*$/, '');
    const dedicatedKey = `${DEDICATED_ENGINE_PREFIX}-${localized}`;
    const arbitraryKey = `${ARBITRARY_ENGINE_PREFIX}-${localized}`;

    const storedValue: Record<string, CustomSearchEngine> =
      (await new Promise((res) => chrome.storage.sync.get(dedicatedKey, res))) ??
      (await new Promise((res) => chrome.storage.sync.get(arbitraryKey, res)));

    let validEntry: CustomSearchEngine | null =
      (storedValue[dedicatedKey] || storedValue[arbitraryKey]) ?? null;

    const validateEntry = (customSearchEngine: CustomSearchEngine) => {
      const hasAllMatchingParams = !customSearchEngine.search_engine_json?.required_params.filter(
        (i) => !params.includes(i),
      ).length;
      const hasRequiredPrefix = !!url.match(customSearchEngine.search_engine_json.required_prefix)
        ?.length;
      if (hasAllMatchingParams && hasRequiredPrefix) {
        validEntry = Object.assign(EMPTY_CUSTOM_SEARCH_ENGINE_BLOB, customSearchEngine);
      }
    };

    if (!validEntry) {
      debug('getCustomSearchEngine - check locals\n');
      Object.values(this.engines).forEach(validateEntry);
    }

    if (!validEntry) {
      debug('getCustomSearchEngine - fetch from remote\n');
      const customSearchEngines = await fetch(CUSTOM_SEARCH_ENGINES, { cache: 'no-cache' });
      const results: Record<string, CustomSearchEngine> = await customSearchEngines.json();
      Object.values(results).forEach(validateEntry);
      validEntry && chrome.storage.sync.set({ [dedicatedKey]: validEntry });
    }

    debug(
      'getCustomSearchEngine - processed\n---\n\tCustom Search Engine JSON',
      validEntry ?? 'not found, fallback value used',
      '\n---',
    );
    return validEntry ?? EMPTY_CUSTOM_SEARCH_ENGINE_BLOB;
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

    if (!Object.entries(this.remoteBlob).length) {
      debug('SearchEngineManager - sync - fetching remote');
      const customSearchEngines = await fetch(CUSTOM_SEARCH_ENGINES, { cache: 'no-cache' });
      this.remoteBlob = await customSearchEngines.json();
      debug('SearchEngineManager - sync\n---\n\tRemote', this.remoteBlob, '\n---');
    }

    await new Promise((resolve) =>
      chrome.storage.sync.get(async (items) => {
        debug('SearchEngineManager - sync\n---\n\tItems', items, '\n---');
        Object.entries(items ?? Object.create(null)).forEach(
          async ([key, storedItem]: [string, CustomSearchEngine]) => {
            if (!key.startsWith(DEDICATED_ENGINE_PREFIX)) {
              return null;
            }

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
            const paramsMismatch = !storedItem?.search_engine_json?.required_params?.every((c) =>
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
          },
        );
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

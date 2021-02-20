import { debug, SPECIAL_URL_JUNK_STRING } from 'lumos-shared-js';
import { extractHostnameFromUrl } from 'utils/helpers';

const CUSTOM_SEARCH_ENGINES =
  'https://raw.githubusercontent.com/insightbrowser/augmentations/main/serp_query_selectors.json';

const getCustomSearchEngine = async (url: string) => {
  let storedValue: Record<string, CustomSearchEngine>;
  const { hostname, params } = extractHostnameFromUrl(url);
  if (!hostname) return null;
  const storageKey = hostname.replace(/\./g, '_'); // Be safe using `_` instead dots
  storedValue = await new Promise((resolve) => chrome.storage.sync.get(storageKey, resolve));
  if (!storedValue) {
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
    await new Promise((resolve) =>
      chrome.storage.sync.set({ [storageKey]: result }, () => resolve('Stored successfully')),
    );
    storedValue = {
      storageKey: result,
    };
  }
  return storedValue[storageKey] ?? null;
};

export const handleSubtabApiResponse = async (
  url: URL,
  document: Document,
  response: SubtabsResponse,
) => {
  debug('function call - handleSubtabApiResponse', url, response);
  if (!(url && document && response)) {
    debug('handleSubtabApiResponse - ERROR', url, document, response);
    return null;
  }
  const sidebarTabs: SidebarTab[] = [];
  const suggestedAugmentationResponse = response.suggested_augmentations;
  const customSearchEngine = await getCustomSearchEngine(url.href);
  if (!customSearchEngine) return;
  const serpDomains = Array.from(
    document.querySelectorAll(customSearchEngine.querySelector?.desktop),
  )?.map((e) => extractHostnameFromUrl(e.textContent.split(' ')[0]).hostname);
  suggestedAugmentationResponse.forEach((augmentation: SuggestedAugmentationObject) => {
    if (augmentation.id.startsWith('cse-')) {
      const domainsToLookFor = augmentation.conditions.condition_list.map((e) => e.value[0]);
      if (serpDomains.filter((value) => domainsToLookFor.includes(value)).length > 0) {
        if (augmentation.actions.action_list?.[0].key == 'search_domains') {
          const domainsToSearch = augmentation.actions.action_list?.[0]?.value;
          const customSearchUrl = new URL(
            `https://${customSearchEngine.search_engine_json.required_prefix}`,
          );
          if (Array.isArray(domainsToSearch)) {
            const query = new URLSearchParams(document.location.search).get('q');
            const appendage: string =
              '(' + domainsToSearch.map((x) => 'site:' + x).join(' OR ') + ')';
            customSearchUrl.searchParams.append('q', query + ' ' + appendage);
          }
          customSearchUrl.searchParams.append(SPECIAL_URL_JUNK_STRING, SPECIAL_URL_JUNK_STRING);
          sidebarTabs.push({
            title: augmentation.name,
            url: customSearchUrl,
            default: !sidebarTabs.length,
          });
        }
      }
    }
  });
  return sidebarTabs;
};

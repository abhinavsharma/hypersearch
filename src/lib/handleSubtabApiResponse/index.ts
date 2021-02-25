import { debug, SPECIAL_URL_JUNK_STRING } from 'lumos-shared-js';
import { extractHostnameFromUrl } from 'utils/helpers';

export const CUSTOM_SEARCH_ENGINES =
  'https://raw.githubusercontent.com/insightbrowser/augmentations/main/serp_query_selectors.json';

const getCustomSearchEngine = async (url: string) => {
  debug('function call - getCustomSearchEngine', url);
  let storedValue: Record<string, CustomSearchEngine>;
  const { hostname, params } = extractHostnameFromUrl(url);
  if (!hostname) return null;
  const storageKey = hostname.replace(/\./g, '_'); // Be safe using `_` instead dots
  storedValue = await new Promise((resolve) => chrome.storage.sync.get(storageKey, resolve));
  if (!storedValue.storageKey) {
    debug('getCustomSearchEngine - Value not found in local storage, fetching from remote');
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
      chrome.storage.sync.set({ [storageKey]: result }, () => {
        resolve('Stored successfully');
      }),
    );
    storedValue = {
      [storageKey]: result,
    };
  }
  debug('getCustomSearchEngine - processed', storedValue[storageKey]);
  return storedValue[storageKey] ?? null;
};

const getSuggestedAugmentations = (
  response: SubtabsResponse['suggested_augmentations'],
  domains: string[],
  cse?: CustomSearchEngine,
) => {
  const suggestedAugmentations: SuggestedAugmentationObject[] = [];
  const sidebarTabs: SidebarTab[] = [];
  response.forEach((augmentation: SuggestedAugmentationObject) => {
    if (cse && augmentation.id.startsWith('cse-')) {
      const domainsToLookFor = augmentation.conditions.condition_list.map((e) => e.value[0]);
      if (domains.filter((value) => domainsToLookFor.includes(value)).length > 0) {
        if (augmentation.actions.action_list?.[0].key == 'search_domains') {
          const domainsToSearch = augmentation.actions.action_list?.[0]?.value;
          const customSearchUrl = new URL(`https://${cse.search_engine_json.required_prefix}`);
          if (Array.isArray(domainsToSearch)) {
            const query = new URLSearchParams(document.location.search).get('q');
            const appendage: string =
              '(' + domainsToSearch.map((x) => 'site:' + x).join(' OR ') + ')';
            customSearchUrl.searchParams.append('q', query + ' ' + appendage);
          }
          customSearchUrl.searchParams.append(SPECIAL_URL_JUNK_STRING, SPECIAL_URL_JUNK_STRING);
          suggestedAugmentations.push(augmentation);
          sidebarTabs.push({
            title: augmentation.name,
            url: customSearchUrl,
            default: !sidebarTabs.length,
            isCse: true,
          });
        }
      }
    }
  });
  return { sidebarTabs, suggestedAugmentations };
};

export const handleSubtabApiResponse = async (
  url: URL,
  document: Document,
  response: SubtabsResponse,
) => {
  debug('function call - handleSubtabApiResponse', response);
  if (!(url && document && response)) return null;
  const customSearchEngine = await getCustomSearchEngine(url.href);

  const serpDomains = Array.from(
    document.querySelectorAll(customSearchEngine?.querySelector?.desktop),
  )?.map((e) => extractHostnameFromUrl(e.textContent.split(' ')[0]).hostname);

  const { sidebarTabs, suggestedAugmentations } = getSuggestedAugmentations(
    response.suggested_augmentations,
    serpDomains,
    customSearchEngine,
  );

  const subtabs: SidebarTab[] = response.subtabs
    .slice(1, response.subtabs.length)
    .map((subtab, i, a) => ({
      title: subtab.title ?? 'Readable Content',
      url: subtab.url && new URL(subtab.url),
      readable: subtab.readable_content,
      default: !sidebarTabs.length && i === 0 && !a[i + 1],
      isCse: false,
    }));

  debug('handleSubtabApiResponse - matched results', sidebarTabs, suggestedAugmentations, subtabs);
  return { sidebarTabs: [...sidebarTabs, ...subtabs], suggestedAugmentations };
};

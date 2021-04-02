import { v4 as uuid } from 'uuid';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import { b64EncodeUnicode, debug, removeProtocol } from 'utils/helpers';
import {
  ANY_URL_CONDITION,
  EXTENSION_SHARE_URL,
  EXTENSION_SHORT_SHARE_URL,
  NUM_DOMAINS_TO_EXCLUDE,
  OPEN_NEW_TAB_MESSAGE,
  SEARCH_CONTAINS_CONDITION,
  SEARCH_DOMAINS_ACTION,
  SEARCH_INTENT_IS_CONDITION,
  SEARCH_QUERY_CONTAINS_CONDITION,
  UPDATE_SIDEBAR_TABS_MESSAGE,
} from 'utils/constants';
import md5 from 'md5';
import SearchEngineManager from 'lib/SearchEngineManager/SearchEngineManager';

class AugmentationManager {
  public processOpenPageActionString(value: string) {
    let url = `https://${removeProtocol(value)}`;
    if (value.search(/%s[^r]?/gi) > -1) {
      url = url.replace('%s', SidebarLoader.query);
    }
    if (process.env.PROJECT === 'is') {
      if (value.indexOf('%u') > -1) url = url.replace('%u', SidebarLoader.url.href);
      if (value.search(/%sr[\d]{1,}/gi) > -1) {
        const domainIndices = url.match(/%sr[\d]/gi) ?? [];
        domainIndices.forEach((value) => {
          const index = value.split('%sr')[1];
          url = url.replace(`%sr${index}`, SidebarLoader.domains[index]);
        });
      }
    }
    return new URL(url);
  }

  public removeInstalledAugmentation(augmentation: AugmentationObject) {
    SidebarLoader.installedAugmentations = SidebarLoader.installedAugmentations.filter(
      (i) => i.id !== augmentation.id,
    );
    SidebarLoader.otherAugmentations = SidebarLoader.otherAugmentations.filter(
      (i) => i.id !== augmentation.id,
    );
    chrome.storage.local.remove(augmentation.id);
    chrome.runtime.sendMessage({ type: UPDATE_SIDEBAR_TABS_MESSAGE });
  }

  public getAugmentationRelevancy(augmentation: AugmentationObject) {
    const domainsToLookCondition = augmentation.conditions?.condition_list.reduce(
      (conditions, { key, value }) =>
        key === SEARCH_CONTAINS_CONDITION || key === ANY_URL_CONDITION
          ? conditions.concat(value)
          : conditions,
      [],
    );

    const domainsToLookAction = augmentation.actions?.action_list.reduce(
      (actions, { key, value }) =>
        key === SEARCH_DOMAINS_ACTION ? actions.concat(value) : actions,
      [],
    );

    const matchingDomainsCondition = SidebarLoader.domains.filter((value) =>
      domainsToLookCondition?.find((i) => value?.search(new RegExp(`^${i}`, 'gi')) > -1),
    );

    const matchingDomainsAction = SidebarLoader.domains.filter((value) =>
      domainsToLookAction?.find((i) => value?.search(new RegExp(`^${i}`, 'gi')) > -1),
    );

    const checkForQuery =
      augmentation.conditions.condition_list.find(
        ({ key }) => key === SEARCH_QUERY_CONTAINS_CONDITION,
      )?.value[0] ?? null;

    const matchingQuery = checkForQuery && SidebarLoader.query?.search(checkForQuery) > -1;

    const matchingDomains =
      matchingDomainsCondition
        .map(
          (domain) =>
            !!SidebarLoader.domains.find((e) => e?.search(new RegExp(`^${domain}`, 'gi')) > -1),
        )
        .filter((isMatch) => !!isMatch).length > 0 &&
      matchingDomainsAction
        .map(
          (domain) =>
            !!SidebarLoader.domains.find((e) => e?.search(new RegExp(`^${domain}`, 'gi')) > -1),
        )
        .filter((isMatch) => !!isMatch).length < NUM_DOMAINS_TO_EXCLUDE;

    const matchingIntent = !!augmentation.conditions.condition_list
      .reduce((intents, { key, value }) => {
        if (key === SEARCH_INTENT_IS_CONDITION) {
          const matchingIntent = SearchEngineManager.intents.find(
            ({ intent_id }) => intent_id === value[0],
          );
          if (matchingIntent) {
            const intentDomains = matchingIntent.sites.split(',') ?? [];
            intentDomains.forEach(
              (domain) =>
                !!SidebarLoader.domains.find(
                  (mainSerpDomain) => !!mainSerpDomain.match(domain)?.length,
                ) && intents.push(domain),
            );
            if (matchingIntent.google_css) {
              return intents.concat(
                Array.from(document.querySelectorAll(matchingIntent.google_css)),
              );
            }
          }
        }
        return intents;
      }, [])
      .filter((isMatch) => !!isMatch).length;

    return {
      isRelevant: matchingQuery || matchingDomains || matchingIntent,
      domainsToLookAction,
      domainsToLookCondition,
      matchingDomainsAction,
      matchingDomainsCondition,
    };
  }

  public async shareAugmentation(augmentation: AugmentationObject) {
    const encoded = b64EncodeUnicode(JSON.stringify(augmentation));
    await fetch(`${EXTENSION_SHARE_URL}${encodeURIComponent(encoded)}`, {
      mode: 'no-cors',
    });
    chrome.runtime.sendMessage({
      type: OPEN_NEW_TAB_MESSAGE,
      url: `${EXTENSION_SHORT_SHARE_URL}${md5(encoded).substr(0, 10)}`,
    });
  }

  public addOrEditAugmentation(
    augmentation: AugmentationObject,
    {
      actions,
      conditions,
      conditionEvaluation,
      description,
      name,
      isActive,
      isPinning,
    }: AugmentationData,
    refresh?: boolean,
  ) {
    const customId = `cse-custom-${
      augmentation.id !== '' ? augmentation.id : name.replace(/[\s]/g, '_').toLowerCase()
    }-${uuid()}`;
    const id = augmentation.id.startsWith('cse-custom-') && !isPinning ? augmentation.id : customId;
    const updated = {
      ...augmentation,
      id,
      name,
      description,
      conditions: {
        condition_list: conditions ?? augmentation.conditions.condition_list,
        evaluate_with: conditionEvaluation ?? augmentation.conditions.evaluate_with,
      },
      actions: {
        ...augmentation.actions,
        action_list: actions
          ? actions.map((action) => ({
              ...action,
              value: action.value.filter((i) => i !== ''),
            }))
          : augmentation.actions.action_list,
      },
      enabled: isActive ?? augmentation.enabled,
      installed: true,
    };
    debug(
      'EditAugmentationPage - save\n---\n\tOriginal',
      augmentation,
      '\n\tUpdated',
      updated,
      '\n---',
    );
    SidebarLoader.installedAugmentations = [
      updated,
      ...SidebarLoader.installedAugmentations.filter((i) => i.id !== updated.id),
    ];
    chrome.storage.local.set({ [id]: updated });
    chrome.runtime.sendMessage({
      type: UPDATE_SIDEBAR_TABS_MESSAGE,
      refresh,
    });
  }
}

const instance = new AugmentationManager();

export default instance;

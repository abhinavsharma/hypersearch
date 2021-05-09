/**
 * @module AugmentationManager
 * @author Matyas Angyal<matyas@laso.ai>
 * @license (C) Insight
 * @version 1.0.0
 */
import { v4 as uuid } from 'uuid';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import SearchEngineManager from 'lib/SearchEngineManager/SearchEngineManager';
import {
  debug,
  removeProtocol,
  ANY_WEB_SEARCH_CONDITION,
  EXTENSION_SHARE_URL,
  NUM_DOMAINS_TO_EXCLUDE,
  REMOVE_HIDE_DOMAIN_OVERLAY_MESSAGE,
  SEARCH_CONTAINS_CONDITION,
  SEARCH_DOMAINS_ACTION,
  SEARCH_HIDE_DOMAIN_ACTION,
  SEARCH_INTENT_IS_CONDITION,
  SEARCH_QUERY_CONTAINS_CONDITION,
  UPDATE_SIDEBAR_TABS_MESSAGE,
  IGNORED_PREFIX,
  INSTALLED_PREFIX,
  PINNED_PREFIX,
  ANY_URL_CONDITION_MOBILE,
  MY_BLOCKLIST_ID,
  SEARCH_ENGINE_IS_CONDITION,
  encodeSpace,
  EXTENSION_BLOCKLIST_ADD_DOMAIN,
  EXTENSION_BLOCKLIST_REMOVE_DOMAIN,
  EXTENSION_AUGMENTATION_SAVE,
  REMOVE_SEARCHED_DOMAIN_MESSAGE,
  URL_EQUALS_CONDITION,
  URL_MATCHES_CONDITION,
  DOMAIN_MATCHES_CONDITION,
  extractUrlProperties,
  DOMAIN_EQUALS_CONDTION,
  MY_TRUSTLIST_ID,
} from 'utils';

class AugmentationManager {
  public preparedLogMessage: Record<'augmentation', AugmentationObject> | null;

  constructor() {
    debug('AugmentationManager - initialize\n---\n\tSingleton Instance', this, '\n---');
  }

  /**
   * Add a domian to the user's personal blocklist.
   *
   * @param domain - The domain to add to the blocklist
   * @public
   * @method
   * @memberof AugmentationManager
   */
  public async updateBlockList(domain: string) {
    const blockList = SidebarLoader.installedAugmentations
      .concat(SidebarLoader.otherAugmentations)
      .find(({ id }) => id === MY_BLOCKLIST_ID);
    const isNewBlock = !blockList.actions.action_list.find(({ value }) => value[0] === domain);
    const newActionList = [
      ...blockList.actions.action_list.filter(
        (action) => action.value.length && !action.value.includes(domain),
      ),
      {
        key: SEARCH_HIDE_DOMAIN_ACTION,
        label: 'Hide results from domain',
        type: 'list',
        value: [domain],
      },
    ] as AugmentationObject['actions']['action_list'];
    blockList.actions.action_list = newActionList;
    isNewBlock &&
      !SidebarLoader.strongPrivacy &&
      SidebarLoader.sendLogMessage(EXTENSION_BLOCKLIST_ADD_DOMAIN, {
        domain,
      });
    this.addOrEditAugmentation(blockList, {
      actions: newActionList,
    });
  }

  /**
   * Remove the passed domain from the user's personal blocklist.
   *
   * @param domain - The domain to remove from the blocklist
   * @public
   * @method
   * @memberof AugmentationManager
   */
  public async deleteFromBlockList(domain: string) {
    const blockList = SidebarLoader.installedAugmentations
      .concat(SidebarLoader.otherAugmentations)
      .find(({ id }) => id === MY_BLOCKLIST_ID);
    const newActionList = [
      ...blockList.actions.action_list.filter(({ key, value }) =>
        key === SEARCH_HIDE_DOMAIN_ACTION ? value[0] !== domain : true,
      ),
    ] as AugmentationObject['actions']['action_list'];
    blockList.actions.action_list = newActionList;
    this.addOrEditAugmentation(blockList, {
      actions: newActionList,
    }),
      (SidebarLoader.hideDomains = SidebarLoader.hideDomains.filter((hidden) => hidden !== domain));
    !SidebarLoader.strongPrivacy &&
      SidebarLoader.sendLogMessage(EXTENSION_BLOCKLIST_REMOVE_DOMAIN, {
        domain,
      });
    window.postMessage(
      {
        name: REMOVE_HIDE_DOMAIN_OVERLAY_MESSAGE,
        remove: blockList.id,
        domain,
        selector: {
          link: SidebarLoader.customSearchEngine.querySelector?.['desktop'],
          featured: SidebarLoader.customSearchEngine.querySelector?.featured ?? Array(0),
          container: SidebarLoader.customSearchEngine.querySelector?.result_container_selector,
        },
      },
      '*',
    );
  }

  /**
   * Toggle marking a domain as a trusted source.
   *
   * @param domain - The domain to be added or removed from the trusted sources
   */
  public async toggleTrustlist(domain: string) {
    const trustList = SidebarLoader.installedAugmentations
      .concat(SidebarLoader.otherAugmentations)
      .find(({ id }) => id === MY_TRUSTLIST_ID);
    const existingDomain = !!trustList.actions.action_list[0].value.includes(domain);
    const newActionValue = existingDomain
      ? trustList.actions.action_list[0].value.filter((value) => value !== domain)
      : trustList.actions.action_list[0].value.concat(domain);
    this.addOrEditAugmentation(trustList, {
      actions: [
        {
          ...trustList.actions.action_list[0],
          value: newActionValue,
        },
      ],
    });
    existingDomain &&
      window.postMessage(
        {
          name: REMOVE_SEARCHED_DOMAIN_MESSAGE,
          remove: MY_TRUSTLIST_ID,
          domain,
          selector: {
            link: SidebarLoader.customSearchEngine.querySelector?.['desktop'],
            featured: SidebarLoader.customSearchEngine.querySelector?.featured ?? Array(0),
            container: SidebarLoader.customSearchEngine.querySelector?.result_container_selector,
          },
        },
        '*',
      );
  }

  /**
   * Process the value of an `OPEN_URL_ACTION` by interpolating the matchers.
   *
   * **AVAILABLE MATCHERS**
   *  - `%s` - Replaced by the search query
   *  - `%u` - Replaced by the original URL
   *  - `%sr` - Replaced by the matching search result's URL
   * (works only with `SEARCH_CONTAINS_CONDITION`)
   *  - `%sr[\d]` - Replaced by the corresponding search result
   * (e.g.: `%sr1` -> Replaced by the first result of the main serp)
   *  - `%m` - Replaced by the matching regular expression (`regexp` conditions)
   *  - `%m[\d]` - Replaced by the *nth matching regex group*
   *
   * See: https://bit.ly/3rUCl5d
   *
   * @param value - The action's value
   * @public
   * @method
   * @memberof AugmentationManager
   */
  public processOpenPageActionString(value: string) {
    let url = `https://${removeProtocol(value)}`;
    if (value.search(/%s[^r]+|%s$/gi) > -1) {
      url = url.replace('%s', encodeSpace(SidebarLoader.query));
    }
    if (value.indexOf('%u') > -1) url = url.replace('%u', SidebarLoader.url.href);
    if (value.search(/%sr[\d]{1,}/gi) > -1) {
      const domainIndices = url.match(/%sr[\d]*/gi) ?? [];
      domainIndices.forEach((value) => {
        const index = value.split('%sr')[1];
        url = url.replaceAll(
          `%sr${index}`,
          SidebarLoader.tabDomains['original']?.[Number(index) - 1],
        );
      });
    }
    return new URL(url);
  }

  /**
   * Takes an augmentation as first parameter and puts it to the ignored list. Also,
   * this method will trigger an update on the sidebar. When an augmentation is ignored,
   * a storage key will be created for it, to prevent the loader processing it next time.
   *
   * @param augmentation - The augmentation object
   * @public
   * @method
   * @memberof AugmentationManager
   */
  public disableSuggestedAugmentation(augmentation: AugmentationObject) {
    SidebarLoader.ignoredAugmentations.push(augmentation);
    chrome.storage.local.set({
      [`${IGNORED_PREFIX}-${augmentation.id}`]: augmentation,
    });
    SidebarLoader.pinnedAugmentations = SidebarLoader.pinnedAugmentations.filter(
      (i) => i.id !== augmentation.id,
    );
    SidebarLoader.suggestedAugmentations = SidebarLoader.suggestedAugmentations.filter(
      (i) => i.id !== augmentation.id,
    );
    chrome.runtime.sendMessage({ type: UPDATE_SIDEBAR_TABS_MESSAGE });
  }

  public enableSuggestedAugmentation(augmentation: AugmentationObject) {
    SidebarLoader.ignoredAugmentations = SidebarLoader.ignoredAugmentations.filter(
      (i) => i.id !== augmentation.id,
    );
    chrome.storage.local.remove(`${IGNORED_PREFIX}-${augmentation.id}`);
    const { isRelevant } = this.getAugmentationRelevancy(augmentation);
    augmentation.pinned
      ? SidebarLoader.pinnedAugmentations.push(augmentation)
      : isRelevant
      ? SidebarLoader.suggestedAugmentations.push(augmentation)
      : SidebarLoader.otherAugmentations.push(augmentation);
    chrome.runtime.sendMessage({ type: UPDATE_SIDEBAR_TABS_MESSAGE });
  }

  public pinAugmentation(augmentation: AugmentationObject) {
    augmentation.pinned = true;
    SidebarLoader.pinnedAugmentations.push(augmentation);
    chrome.storage.local.set({
      [`${PINNED_PREFIX}-${augmentation.id}`]: augmentation,
    });
    if (
      !SidebarLoader.installedAugmentations.find(({ id }) => id === augmentation.id) &&
      !SidebarLoader.suggestedAugmentations.find(({ id }) => id === augmentation.id)
    ) {
      SidebarLoader.enabledOtherAugmentations.push(augmentation);
    }
    chrome.runtime.sendMessage({ type: UPDATE_SIDEBAR_TABS_MESSAGE });
  }

  public unpinAugmentation(augmentation: AugmentationObject) {
    augmentation.pinned = false;
    SidebarLoader.pinnedAugmentations = SidebarLoader.pinnedAugmentations.filter(
      (i) => i.id !== augmentation.id,
    );
    SidebarLoader.enabledOtherAugmentations = SidebarLoader.enabledOtherAugmentations.filter(
      ({ id }) => id !== augmentation.id,
    );
    chrome.storage.local.remove(`${PINNED_PREFIX}-${augmentation.id}`);
    chrome.runtime.sendMessage({ type: UPDATE_SIDEBAR_TABS_MESSAGE });
  }

  /**
   * Remove an installed augmnetation form the sidebar and the storage as well. When the corresponding
   * augmentation has `SEARCH_HIDE_DOMAIN_ACTION`, this method will trigger a `postMessage` to update the
   * related overlay on the host page. This method will trigger a sidebar update.
   *
   * @param augmentation - The augmentation object
   * @public
   * @method
   * @memberof AugmentationManager
   */
  public removeInstalledAugmentation(augmentation: AugmentationObject) {
    this.unpinAugmentation(augmentation);
    SidebarLoader.pinnedAugmentations = SidebarLoader.pinnedAugmentations.filter(
      (i) => i.id !== augmentation.id,
    );
    SidebarLoader.installedAugmentations = SidebarLoader.installedAugmentations.filter(
      (i) => i.id !== augmentation.id,
    );
    SidebarLoader.otherAugmentations = SidebarLoader.otherAugmentations.filter(
      (i) => i.id !== augmentation.id,
    );
    chrome.storage.local.remove(augmentation.id);
    const hasHideDomains = augmentation.actions.action_list.filter(
      ({ key }) => key === SEARCH_HIDE_DOMAIN_ACTION,
    );
    const hasSearchDomains = augmentation.actions.action_list.filter(
      ({ key }) => key === SEARCH_DOMAINS_ACTION,
    );
    if (hasSearchDomains) {
      hasSearchDomains.forEach(({ value }) =>
        window.postMessage(
          {
            name: REMOVE_SEARCHED_DOMAIN_MESSAGE,
            remove: augmentation.id,
            domain: value[0],
            selector: {
              link: SidebarLoader.customSearchEngine.querySelector?.['desktop'],
              featured: SidebarLoader.customSearchEngine.querySelector?.featured ?? Array(0),
              container: SidebarLoader.customSearchEngine.querySelector?.result_container_selector,
            },
          },
          '*',
        ),
      );
    }
    if (hasHideDomains) {
      hasHideDomains.forEach((domain) => {
        SidebarLoader.hideDomains = SidebarLoader.hideDomains.filter(
          (hidden) => hidden !== domain.value[0],
        );
        window.postMessage(
          {
            name: REMOVE_HIDE_DOMAIN_OVERLAY_MESSAGE,
            remove: augmentation.id,
            domain,
            selector: {
              link: SidebarLoader.customSearchEngine.querySelector?.['desktop'],
              featured: SidebarLoader.customSearchEngine.querySelector?.featured ?? Array(0),
              container: SidebarLoader.customSearchEngine.querySelector?.result_container_selector,
            },
          },
          '*',
        );
      });
    }
    chrome.runtime.sendMessage({ type: UPDATE_SIDEBAR_TABS_MESSAGE });
  }

  /**
   * Takes an augmentation as parameter and returns its corresponding relevancy data. The relevancy
   * is depending on the augmentation's matching condition and actions. We assume an augmentation is
   * relevant when it has at least one matching condition and does not overlap the SERP results more
   * times than its allowed. This number is determined by NUM_DOMAINS_TO_EXCLUDE.
   *
   * @param augmentation - The augmentation object
   * @returns The augmentation's relevancy object
   * @public
   * @method
   * @memberof AugmentationManager
   */
  public getAugmentationRelevancy(
    augmentation: AugmentationObject,
  ): {
    isHidden: boolean;
    isRelevant: boolean;
    hasPreventAutoexpand: boolean;
    domainsToLookAction: string[];
    domainsToLookCondition: string[];
    matchingIntent: string[];
    matchingDomainsAction: string[];
    matchingDomainsCondition: string[];
  } & NullPrototype<any> {
    if (!augmentation?.actions || !augmentation.conditions) {
      return Object.create(null);
    }

    // ! SEARCH DOMAINS
    const hasAnyPageCondition = !!augmentation.conditions.condition_list.filter(
      ({ key, unique_key }) =>
        (key === ANY_WEB_SEARCH_CONDITION &&
          SidebarLoader.isSerp &&
          !SidebarLoader.url.href.match(/amazon\.com/gi)) ||
        (unique_key === ANY_WEB_SEARCH_CONDITION &&
          SidebarLoader.isSerp &&
          !SidebarLoader.url.href.match(/amazon\.com/gi)) ||
        key === ANY_URL_CONDITION_MOBILE ||
        unique_key === ANY_URL_CONDITION_MOBILE,
    ).length;

    const domainsToLookCondition =
      augmentation.conditions.condition_list.reduce(
        (conditions, { key, unique_key, value }) =>
          // search contains domain
          unique_key === SEARCH_CONTAINS_CONDITION || key === SEARCH_CONTAINS_CONDITION
            ? conditions.concat(value)
            : conditions,
        [],
      ) ?? [];

    const domainsToLookAction =
      augmentation.actions?.action_list.reduce(
        (actions, { key, value }) =>
          key === SEARCH_DOMAINS_ACTION ? actions.concat(value) : actions,
        [],
      ) ?? [];

    const matchingDomainsCondition =
      SidebarLoader.domains?.filter((value) =>
        domainsToLookCondition?.find((i) => value?.search(new RegExp(`^${i}`, 'gi')) > -1),
      ) ?? [];

    const matchingDomainsAction =
      SidebarLoader.domains?.filter((value) =>
        domainsToLookAction?.find((i) => value?.search(new RegExp(`^${i}`, 'gi')) > -1),
      ) ?? [];

    const matchingDomains =
      // must have at least one matching domain
      matchingDomainsCondition
        .map(
          (domain) =>
            !!SidebarLoader.domains?.find((e) => e?.search(new RegExp(`^${domain}`, 'gi')) > -1),
        )
        .filter((isMatch) => !!isMatch).length > 0 &&
      // exclude if too much overlap
      matchingDomainsAction
        .map(
          (domain) =>
            !!SidebarLoader.domains?.find((e) => e?.search(new RegExp(`^${domain}`, 'gi')) > -1),
        )
        .filter((isMatch) => !!isMatch).length <
        (hasAnyPageCondition || !!SidebarLoader.url.searchParams.get('insight-tour')
          ? Infinity
          : NUM_DOMAINS_TO_EXCLUDE);

    // ! SEARCH QUERY
    const matchingQuery = augmentation.conditions?.condition_list.some(
      ({ key, unique_key, value }) =>
        (unique_key === SEARCH_QUERY_CONTAINS_CONDITION ||
          key === SEARCH_QUERY_CONTAINS_CONDITION) &&
        SidebarLoader.query?.search(value[0]) > -1,
    );

    // ! SEARCH INTENT
    let hasPreventAutoexpand = false;
    const matchingIntent = augmentation.conditions.condition_list
      .reduce((intents, { key, unique_key, value }) => {
        if (key === SEARCH_INTENT_IS_CONDITION || unique_key === SEARCH_INTENT_IS_CONDITION) {
          const matchingIntent = SearchEngineManager.intents.find(
            ({ intent_id }) => intent_id === value[0],
          );
          if (matchingIntent.stay_collapsed) {
            hasPreventAutoexpand = true;
          }
          if (matchingIntent) {
            // matching intent domains
            const intentDomains = matchingIntent.sites.split(',') ?? [];
            intentDomains.forEach(
              (domain) =>
                !!SidebarLoader.tabDomains['original']?.find(
                  (mainSerpDomain) => !!mainSerpDomain.match(domain)?.length,
                ) && intents.push(domain),
            );
            // matching intent elements on document
            if (matchingIntent.google_css) {
              intents.concat(Array.from(document.querySelectorAll(matchingIntent.google_css)));
            }
          }
        }
        return intents;
      }, [])
      .filter((isMatch) => !!isMatch);

    // ! SEARCH ENGINE
    const matchingEngine = !!augmentation.conditions.condition_list.find(
      ({ key, unique_key, value }) => {
        if (key === SEARCH_ENGINE_IS_CONDITION || unique_key === SEARCH_ENGINE_IS_CONDITION) {
          return (
            Object.entries(
              SidebarLoader.customSearchEngine.search_engine_json ?? Object.create(null),
            )
              .map(([entryKey, entryValue]) => {
                return Array.isArray(entryValue)
                  ? !!entryValue.find((subValue) => {
                      return (
                        Array.isArray(value[0][entryKey]) && value[0][entryKey].includes(subValue)
                      );
                    })
                  : entryValue === value[0][entryKey];
              })
              .indexOf(false) === -1
          );
        }
        return null;
      },
    );

    // ! URL/DOMAIN MATCH
    let numRegexConditions = 0;
    const regexConditions = [
      URL_EQUALS_CONDITION,
      URL_MATCHES_CONDITION,
      DOMAIN_EQUALS_CONDTION,
      DOMAIN_MATCHES_CONDITION,
    ];
    const matchingUrl = augmentation.conditions.condition_list.reduce((matches, condition) => {
      const { unique_key: key, value } = condition;
      if (regexConditions.includes(key)) {
        numRegexConditions += 1;
      }
      if (key === URL_EQUALS_CONDITION && SidebarLoader.url.href === value[0]) {
        matches.push(true);
      }
      if (key === URL_MATCHES_CONDITION && SidebarLoader.url.href.match(value[0])?.length) {
        matches.push(true);
      }
      if (
        key === DOMAIN_EQUALS_CONDTION &&
        extractUrlProperties(SidebarLoader.url.href).hostname === value[0]
      ) {
        matches.push(true);
      }
      if (
        key === DOMAIN_MATCHES_CONDITION &&
        extractUrlProperties(SidebarLoader.url.href).hostname.match(value[0])?.length
      ) {
        matches.push(true);
      }
      return matches;
    }, []);

    const evaluationMatch =
      augmentation.conditions.evaluate_with === 'AND'
        ? augmentation.conditions.condition_list.every(({ key }) => {
            switch (key) {
              case SEARCH_CONTAINS_CONDITION:
                return matchingDomains;
              case SEARCH_QUERY_CONTAINS_CONDITION:
                return matchingQuery;
              case SEARCH_ENGINE_IS_CONDITION:
                return matchingEngine;
              case SEARCH_INTENT_IS_CONDITION:
                return matchingIntent;
              case ANY_WEB_SEARCH_CONDITION:
              case ANY_URL_CONDITION_MOBILE:
                return hasAnyPageCondition;
              case URL_EQUALS_CONDITION:
              case URL_MATCHES_CONDITION:
              case DOMAIN_EQUALS_CONDTION:
              case DOMAIN_MATCHES_CONDITION:
                return numRegexConditions === matchingUrl.length;
            }
          })
        : true;

    return {
      isHidden: augmentation.installed && !augmentation.enabled,
      isRelevant:
        evaluationMatch &&
        (augmentation.enabled || !augmentation.installed) &&
        (hasAnyPageCondition ||
          matchingQuery ||
          matchingDomains ||
          !!matchingIntent.length ||
          matchingEngine ||
          !!matchingUrl.length ||
          augmentation.pinned),
      matchingIntent,
      hasPreventAutoexpand,
      domainsToLookAction,
      domainsToLookCondition,
      matchingDomainsAction,
      matchingDomainsCondition,
    };
  }

  /**
   * Encode the augmentation passed as first parameter to a valid base64 string and query
   * `extensions.insightbrowser.com` for creating a remote entry. When the remote process
   * was successful, the method will trigger a message to open the shareable page.
   *
   * @param augmentation - The augmentation object
   * @public
   * @method
   * @memberof AugmentationManager
   */
  public async shareAugmentation(encoded: string) {
    await fetch(`${EXTENSION_SHARE_URL}${encodeURIComponent(encoded)}`, {
      mode: 'no-cors',
    });
  }

  /**
   * Takes an augmentation as first parameter and its details as the second. The augmentation
   * will be modified according to the given details. Since this method will create a local copy,
   * the result will be stored as an installed augmentation. This method will update the sidebar.
   * When the updated augmentation has `SEARCH_HIDE_DOMAIN_ACTION`, the host page will be updated
   * to make overlays according to the related action.
   *
   * @param augmentation - The augmentation object
   * @param details - The modified augmentation details
   * @public
   * @method
   * @memberof AugmentationManager
   */
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
  ) {
    const customId = `${INSTALLED_PREFIX}-${
      augmentation.id !== '' ? augmentation.id : name.replace(/[\s]/g, '_').toLowerCase()
    }-${uuid()}`;
    const id =
      augmentation.id.startsWith(`${INSTALLED_PREFIX}-`) && !isPinning ? augmentation.id : customId;
    const updated = {
      ...augmentation,
      id,
      name: name ?? augmentation.name,
      description: description ?? augmentation.description,
      conditions: {
        condition_list: conditions ?? augmentation.conditions.condition_list,
        evaluate_with: conditionEvaluation ?? augmentation.conditions.evaluate_with,
      },
      actions: {
        ...augmentation.actions,
        action_list: actions
          ? actions
              .map((action) => ({
                ...action,
                value: action.value.filter((isValue) => !!isValue),
              }))
              .filter(({ value }) => !!value.length)
          : augmentation.actions.action_list.filter(({ value }) => !!value.length),
      },
      enabled: isActive ?? augmentation.enabled,
      installed: true,
    };
    chrome.storage.local.set({ [id]: updated });

    const { isRelevant, isHidden } = this.getAugmentationRelevancy(updated);

    if (isRelevant) {
      SidebarLoader.installedAugmentations = [
        updated,
        ...SidebarLoader.installedAugmentations.filter((i) => i.id !== updated.id),
      ];
      SidebarLoader.otherAugmentations = SidebarLoader.otherAugmentations.filter(
        (i) => i.id !== updated.id,
      );
      SidebarLoader.ignoredAugmentations = SidebarLoader.ignoredAugmentations.filter(
        (i) => i.id !== updated.id,
      );
    } else {
      SidebarLoader.installedAugmentations = SidebarLoader.installedAugmentations.filter(
        (i) => i.id !== updated.id,
      );
      if (isHidden) {
        SidebarLoader.ignoredAugmentations = [
          updated,
          ...SidebarLoader.ignoredAugmentations.filter((i) => i.id !== updated.id),
        ];
      } else {
        SidebarLoader.otherAugmentations = [
          updated,
          ...SidebarLoader.otherAugmentations.filter((i) => i.id !== updated.id),
        ];
      }
    }
    this.preparedLogMessage &&
      !SidebarLoader.strongPrivacy &&
      SidebarLoader.sendLogMessage(EXTENSION_AUGMENTATION_SAVE, {
        augmentation: this.preparedLogMessage.augmentation,
      });
    chrome.runtime.sendMessage({ type: UPDATE_SIDEBAR_TABS_MESSAGE });
    debug(
      'AugmentationManager - addOrEditAugmentation\n---\n\tOriginal',
      augmentation,
      '\n\tUpdated',
      updated,
      '\n---',
    );
  }
}

/**
 * Static instance of the augmentation manager.
 */
const instance = new AugmentationManager();

export default instance;

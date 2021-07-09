/**
 * @module lib:augmentations
 * @version 1.0.0
 * @license (C) Insight
 */

import { v4 as uuid } from 'uuid';
import SidebarLoader from 'lib/sidebar';
import SearchEngineManager from 'lib/engines';
import UserManager from 'lib/user';
import { debug, removeProtocol, encodeSpace, extractUrlProperties } from 'lib/helpers';
import {
  EXTENSION_SHARE_URL,
  NUM_DOMAINS_TO_EXCLUDE,
  UPDATE_SIDEBAR_TABS_MESSAGE,
  IGNORED_PREFIX,
  INSTALLED_PREFIX,
  PINNED_PREFIX,
  EXTENSION_BLOCKLIST_ADD_DOMAIN,
  EXTENSION_BLOCKLIST_REMOVE_DOMAIN,
  EXTENSION_AUGMENTATION_SAVE,
  MY_TRUSTLIST_TEMPLATE,
  DEDICATED_SERP_REGEX,
  ACTION_KEY,
  ACTION_LABEL,
  LEGACY_CONDITION_TYPE,
  CONDITION_KEY,
  AUGMENTATION_ID,
  DISABLED_KEYS,
  LUMOS_API_URL,
  ENV,
} from 'constant';

class AugmentationManager {
  /**
   * Helper property to track when to log the save action of an installed augmentation.
   */
  public preparedLogMessage: Record<'augmentation', Augmentation> | null;

  constructor() {
    debug('AugmentationManager - initialize\n---\n\tSingleton Instance', this, '\n---');
    this.preparedLogMessage = Object.create(null);
  }

  /**
   * Decide whether an augmentation is valid and can be used in the application.
   *
   * @param augmentation - The augmentation object
   * @returns boolean
   */
  public isAugmentationEnabled(augmentation: Augmentation) {
    const operations: Array<ActionObject | ConditionObject> = [
      ...augmentation.conditions.condition_list,
      ...augmentation.actions.action_list,
    ];

    return operations?.every((operation: ConditionObject | ActionObject) => {
      const key = (operation as ConditionObject).unique_key ?? operation.key;
      const hasValidKey = !(DISABLED_KEYS as readonly string[]).includes(key);
      return hasValidKey;
    });
  }

  /**
   * Add a domain (or publication) to the current user's blocklist
   *
   * @param domain - The domain to add
   */
  public async updateBlockList(domain: string) {
    const blockList = SidebarLoader.installedAugmentations
      .concat(SidebarLoader.otherAugmentations)
      .find(({ id }) => id === AUGMENTATION_ID.BLOCKLIST) as Augmentation;
    const isNewBlock = !blockList.actions.action_list.find(({ value }) => value[0] === domain);
    const newActionList: ActionObject[] = [
      ...blockList.actions.action_list.filter(
        (action) => action.value.length && !action.value.includes(domain),
      ),
      {
        key: ACTION_KEY.SEARCH_HIDE_DOMAIN,
        label: ACTION_LABEL.SEARCH_HIDE_DOMAIN,
        type: LEGACY_CONDITION_TYPE.LIST,
        value: [domain],
      },
    ];
    blockList.actions.action_list = newActionList;
    isNewBlock &&
      !UserManager.user.privacy &&
      SidebarLoader.sendLogMessage(EXTENSION_BLOCKLIST_ADD_DOMAIN, {
        domain,
      });
    this.addOrEditAugmentation(blockList, {
      actions: newActionList,
    });

    this.recordTrustBlock('BLOCK', domain, true);
  }

  /**
   * Remove a domain (or publication) from the current user's blocklist
   *
   * @param domain - The domain to remove
   */
  public async deleteFromBlockList(domain: string) {
    const blockList = SidebarLoader.installedAugmentations
      .concat(SidebarLoader.otherAugmentations)
      .find(({ id }) => id === AUGMENTATION_ID.BLOCKLIST) as Augmentation;
    const newActionList = [
      ...blockList.actions.action_list.filter(({ key, value }) =>
        key === ACTION_KEY.SEARCH_HIDE_DOMAIN ? value[0] !== domain : true,
      ),
    ];
    blockList.actions.action_list = newActionList;
    this.addOrEditAugmentation(blockList, {
      actions: newActionList,
    }),
      (SidebarLoader.hideDomains = SidebarLoader.hideDomains.filter((hidden) => hidden !== domain));
    !UserManager.user.privacy &&
      SidebarLoader.sendLogMessage(EXTENSION_BLOCKLIST_REMOVE_DOMAIN, {
        domain,
      });

    this.recordTrustBlock('BLOCK', domain, false);
  }

  /**
   * Toggle marking a domain as a trusted source.
   *
   * @param domain - The domain to be added or removed from the trusted sources
   */
  public async toggleTrustlist(domain: string) {
    const trustList = SidebarLoader.installedAugmentations
      .concat(SidebarLoader.otherAugmentations)
      .find(({ id }) => id === AUGMENTATION_ID.TRUSTLIST) as Augmentation;
    const existingDomain = !!(trustList.actions.action_list[0]?.value ?? []).includes(domain);
    const newActionValue = existingDomain
      ? (trustList.actions.action_list[0]?.value ?? []).filter((value) => value !== domain)
      : (trustList.actions.action_list[0]?.value ?? []).concat(domain);
    this.addOrEditAugmentation(trustList, {
      actions: [
        {
          ...(trustList.actions.action_list[0] ?? MY_TRUSTLIST_TEMPLATE.actions.action_list[0]),
          value: newActionValue,
        },
      ],
    });

    this.recordTrustBlock('TRUST', domain, !existingDomain);
  }

  /**
   * Transpose special characters in {@link ACTION_KEY.OPEN_URL open page} actions.
   * > Specification: https://bit.ly/3rUCl5d
   *
   * @param actionString - The action's value'
   * @param regexGroups - The possible RegExp groups from conditions
   * @returns The generated URL
   */
  public processOpenPageActionString(actionString: string, regexGroups: string[] = []) {
    let url = `https://${removeProtocol(actionString)}`;
    if (actionString.search(/%s[^r]+|%s$/gi) > -1) {
      url = url.replace('%s', encodeSpace(SidebarLoader.query));
    }
    if (actionString.indexOf('%u') > -1) url = url.replace('%u', SidebarLoader.url.href);
    if (actionString.search(/%sr[\d]{1,}/gi) > -1) {
      const domainIndices = url.match(/%sr[\d]*/gi) ?? [];
      domainIndices.forEach((actionString) => {
        const index = actionString.split('%sr')[1];
        url = url.replaceAll(
          `%sr${index}`,
          SidebarLoader.publicationSlices['original']?.[Number(index) - 1],
        );
      });
    }
    if (actionString.search(/%m[\d]{1,}/gi) > -1) {
      const domainIndices = url.match(/%m[\d]*/gi) ?? [];
      domainIndices.forEach((actionString) => {
        const index = actionString.split('%m')[1];
        url = url.replaceAll(`%m${index}`, regexGroups[Number(index) - 1]);
      });
    }
    return new URL(url);
  }

  /**
   * Create a new tab searching the same {@link SidebarLoader.query query } but using the specified custom engine.
   *
   * @param engine - The search engine object
   * @returns
   */
  public processSearchAlsoActionString(engine: SearchEngineObject['search_engine_json']) {
    const url = new URL(`https://${removeProtocol(engine.required_prefix)}`);
    engine.required_params.forEach((param) => url.searchParams.append(param, SidebarLoader.query));
    return url;
  }

  /**
   * Mark a suggested augmentation as hidden from the {@link SidebarLoader.fetchSubtabs subtabs response}.
   *
   * @param augmentation - The suggested augmentation to disable
   */
  public disableSuggestedAugmentation(augmentation: Augmentation) {
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

  /**
   * Remove hide marker from a suggested augmentation from the {@link SidebarLoader.fetchSubtabs subtabs response}.
   *
   * @param augmentation - The suggested augmentation to enable
   */
  public enableSuggestedAugmentation(augmentation: Augmentation) {
    SidebarLoader.ignoredAugmentations = SidebarLoader.ignoredAugmentations.filter(
      (i) => i.id !== augmentation.id,
    );
    chrome.storage.local.remove(`${IGNORED_PREFIX}-${augmentation.id}`);
    const { isRelevant } = this.getAugmentationRelevancy(augmentation);
    // prettier-ignore
    augmentation.pinned
      ? SidebarLoader.pinnedAugmentations.push(augmentation)
      : isRelevant
        ? SidebarLoader.suggestedAugmentations.push(augmentation)
        : SidebarLoader.otherAugmentations.push(augmentation);
    chrome.runtime.sendMessage({ type: UPDATE_SIDEBAR_TABS_MESSAGE });
  }

  /**
   * Mark an augmentation to be always visible in the Sidebar.
   *
   * @param augmentation - The augmentation to pin
   */
  public pinAugmentation(augmentation: Augmentation) {
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

  /**
   * Remove an augmentation from the pinned list.
   *
   * @param augmentation - The augmentation to unpin
   */
  public unpinAugmentation(augmentation: Augmentation) {
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
   * Permanently delete a custom user created augmentation from both the Sidebar and storage.
   *
   * @param augmentation - The installed augmentation to remove
   */
  public removeInstalledAugmentation(augmentation: Augmentation) {
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
    chrome.runtime.sendMessage({ type: UPDATE_SIDEBAR_TABS_MESSAGE });
  }

  /**
   * Decide if the augmentation's conditions evaluate to match the current page.
   *
   * @param augmentation - The augmentation to check
   * @returns - {@link AugmentationRelevancyResult}
   */
  public getAugmentationRelevancy(augmentation: Augmentation): AugmentationRelevancyResult {
    if (!augmentation?.actions || !augmentation.conditions) {
      return Object.create(null);
    }

    // ! SEARCH DOMAINS
    const hasAnyPageCondition = !!augmentation.conditions.condition_list.filter(
      ({ key, unique_key }) =>
        ((unique_key ?? key) === CONDITION_KEY.ANY_SEARCH_ENGINE &&
          SidebarLoader.isSerp &&
          SidebarLoader.url.href.match(DEDICATED_SERP_REGEX)) ||
        (unique_key ?? key) === CONDITION_KEY.ANY_URL,
    ).length;

    const domainsToLookCondition =
      augmentation.conditions.condition_list.reduce(
        (conditions, { key, unique_key, value }) =>
          (unique_key ?? key) === CONDITION_KEY.SEARCH_CONTAINS
            ? conditions.concat(value as unknown as string)
            : conditions,
        [] as string[],
      ) ?? [];

    const domainsToLookAction =
      augmentation.actions?.action_list.reduce(
        (actions, { key, value }) =>
          key === ACTION_KEY.SEARCH_DOMAINS ? actions.concat(value as unknown as string) : actions,
        [] as string[],
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
        (unique_key ?? key) === CONDITION_KEY.SEARCH_QUERY_CONTAINS &&
        SidebarLoader.query?.search(value[0] as string) > -1,
    );

    // ! SEARCH INTENT
    let hasPreventAutoexpand = false;
    const matchingIntent = augmentation.conditions.condition_list
      .reduce((intents, { key, unique_key, value }) => {
        if ((unique_key ?? key) === CONDITION_KEY.SEARCH_INTENT_IS) {
          const matchingIntent = SearchEngineManager.intents.find(
            ({ intent_id }) => intent_id === value[0],
          );
          if (matchingIntent?.stay_collapsed) {
            hasPreventAutoexpand = true;
          }
          if (matchingIntent) {
            // matching intent domains
            const intentDomains = matchingIntent.sites.split(',') ?? [];
            intentDomains.forEach(
              (domain) =>
                !!SidebarLoader.publicationSlices['original']?.find(
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
      }, [] as Array<string | Element>)
      .filter((isMatch) => !!isMatch);

    // ! SEARCH ENGINE
    const matchingEngine = !!augmentation.conditions.condition_list.find(
      ({ key, unique_key, value }) => {
        if ((unique_key ?? key) === CONDITION_KEY.SEARCH_ENGINE_IS) {
          const cse = value[0] as unknown as SearchEngineObject;
          const hasAllMatchingParams = (cse.search_engine_json ?? cse)?.required_params?.every(
            (param) => !!SidebarLoader.url.searchParams.get(param),
          );
          const hasRequiredPrefix =
            SidebarLoader.url.href.search((cse.search_engine_json ?? cse)?.required_prefix) > -1;
          return hasAllMatchingParams && hasRequiredPrefix;
        }
        return null;
      },
    );

    // ! URL/DOMAIN MATCH
    let numRegexConditions = 0;
    const regexConditions: KeyEventMap<ConditionKey> = [
      CONDITION_KEY.URL_EQUALS,
      CONDITION_KEY.URL_MATCHES,
      CONDITION_KEY.DOMAIN_EQUALS,
      CONDITION_KEY.DOMAIN_MATCHES,
      CONDITION_KEY.DOMAIN_CONTAINS,
    ];
    const matchingUrl = augmentation.conditions.condition_list.reduce((matches, condition) => {
      const { unique_key: key, value } = condition;
      if (!key) {
        return [];
      }
      if (regexConditions.includes(key)) {
        numRegexConditions += 1;
      }
      if (key === CONDITION_KEY.URL_EQUALS && SidebarLoader.url.href === value[0]) {
        matches.push(true);
      }
      if (
        key === CONDITION_KEY.URL_MATCHES &&
        SidebarLoader.url.href.match(value[0] as string)?.length
      ) {
        matches.push(true);
      }
      if (
        key === CONDITION_KEY.DOMAIN_EQUALS &&
        extractUrlProperties(SidebarLoader.url.href).hostname === value[0]
      ) {
        matches.push(true);
      }
      if (
        key === CONDITION_KEY.DOMAIN_MATCHES &&
        extractUrlProperties(SidebarLoader.url.href).hostname?.match(value[0] as string)?.length
      ) {
        matches.push(true);
      }
      if (
        key === CONDITION_KEY.DOMAIN_CONTAINS &&
        value.includes(extractUrlProperties(SidebarLoader.url.href).hostname ?? '')
      ) {
        matches.push(true);
      }
      return matches;
    }, [] as boolean[]);

    const isMatchingNote = !!augmentation.actions.action_list.find(({ key, value }) => {
      key === ACTION_KEY.URL_NOTE && SidebarLoader.url.href.includes(value[0] as string);
    });

    const evaluationMatch =
      augmentation.conditions.evaluate_with === 'AND'
        ? augmentation.conditions.condition_list?.every(({ key, unique_key }) => {
            const actualKey = unique_key ?? key;
            switch (actualKey) {
              case CONDITION_KEY.SEARCH_CONTAINS:
                return matchingDomains;
              case CONDITION_KEY.SEARCH_QUERY_CONTAINS:
                return matchingQuery;
              case CONDITION_KEY.SEARCH_ENGINE_IS:
                return matchingEngine;
              case CONDITION_KEY.SEARCH_INTENT_IS:
                return matchingIntent;
              case CONDITION_KEY.ANY_SEARCH_ENGINE:
              case CONDITION_KEY.ANY_URL:
                return hasAnyPageCondition;
              case CONDITION_KEY.URL_EQUALS:
              case CONDITION_KEY.URL_MATCHES:
              case CONDITION_KEY.DOMAIN_EQUALS:
              case CONDITION_KEY.DOMAIN_MATCHES:
                return numRegexConditions === matchingUrl.length;
            }
          })
        : true;

    return {
      isHidden: !!augmentation.installed && !augmentation.enabled,
      isRelevant:
        (augmentation.enabled || !augmentation.installed) &&
        (augmentation.pinned ||
          (evaluationMatch &&
            (hasAnyPageCondition ||
              matchingQuery ||
              matchingDomains ||
              !!matchingIntent.length ||
              matchingEngine ||
              !!matchingUrl.length ||
              isMatchingNote))),
      matchingIntent,
      hasPreventAutoexpand,
      domainsToLookAction,
      domainsToLookCondition,
      matchingDomainsAction,
      matchingDomainsCondition,
    };
  }

  /**
   * Send request to store an encoded (stringified) augmentation on the {@link EXTENSION_SHARE_URL extension site}
   *
   * @param encoded - The encoded augmentation
   */
  public async shareAugmentation(encoded: string) {
    await fetch(`${EXTENSION_SHARE_URL}${encodeURIComponent(encoded)}`, {
      mode: 'no-cors',
    });
  }

  /**
   * Create or edit an existing augmentation by the specified options.
   *
   * @param augmentation - The augmentation to add or edit
   * @param options - {@link AugmentationData}
   */
  public addOrEditAugmentation(
    augmentation: Augmentation,
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
      augmentation.id !== '' ? augmentation.id : name?.replace(/[\s]/g, '_').toLowerCase()
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
      !UserManager.user.privacy &&
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

  private recordTrustBlock = async (type: 'TRUST' | 'BLOCK', domain: string, toggle: boolean) => {
    const authorization = await UserManager.getAccessToken();

    if (UserManager.user.privacy !== false || !authorization) {
      return;
    }

    const endpoint = type === 'TRUST' ? 'trust' : 'block';
    const body = {
      url: domain,
      toggle,
    };
    await fetch(`${LUMOS_API_URL[ENV]}toggleList/${endpoint}`, {
      method: 'POST',
      headers: {
        authorization,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  };
}

/**
 * Static instance of the augmentation manager.
 */
const instance = new AugmentationManager();

export default instance;

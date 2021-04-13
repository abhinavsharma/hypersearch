/**
 * @module AugmentationManager
 * @author Matyas Angyal<matyas@laso.ai>
 * @license (C) Insight
 * @version 1.0.0
 */
import md5 from 'md5';
import { v4 as uuid } from 'uuid';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import SearchEngineManager from 'lib/SearchEngineManager/SearchEngineManager';
import {
  debug,
  removeProtocol,
  ANY_URL_CONDITION,
  EXTENSION_SHARE_URL,
  EXTENSION_SHORT_SHARE_URL,
  HIDE_DOMAINS_MESSAGE,
  NUM_DOMAINS_TO_EXCLUDE,
  OPEN_NEW_TAB_MESSAGE,
  SEARCH_CONTAINS_CONDITION,
  SEARCH_DOMAINS_ACTION,
  SEARCH_HIDE_DOMAIN_ACTION,
  SEARCH_INTENT_IS_CONDITION,
  SEARCH_QUERY_CONTAINS_CONDITION,
  UPDATE_SIDEBAR_TABS_MESSAGE,
  IGNORED_PREFIX,
  INSTALLED_PREFIX,
  PINNED_PREFIX,
} from 'utils';

class AugmentationManager {
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
      url = url.replace('%s', SidebarLoader.query);
    }
    if (value.indexOf('%u') > -1) url = url.replace('%u', SidebarLoader.url.href);
    if (value.search(/%sr[\d]{1,}/gi) > -1) {
      const domainIndices = url.match(/%sr[\d]/gi) ?? [];
      domainIndices.forEach((value) => {
        const index = value.split('%sr')[1];
        url = url.replace(`%sr${index}`, SidebarLoader.domains[index]);
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
    augmentation.pinned
      ? SidebarLoader.pinnedAugmentations.push(augmentation)
      : SidebarLoader.suggestedAugmentations.push(augmentation);
    chrome.runtime.sendMessage({ type: UPDATE_SIDEBAR_TABS_MESSAGE });
  }

  public pinAugmentation(augmentation: AugmentationObject) {
    augmentation.pinned = true;
    SidebarLoader.pinnedAugmentations.push(augmentation);
    chrome.storage.local.set({
      [`${PINNED_PREFIX}-${augmentation.id}`]: augmentation,
    });
    augmentation.installed
      ? (SidebarLoader.installedAugmentations = SidebarLoader.installedAugmentations.filter(
          (i) => i.id !== augmentation.id,
        ))
      : (SidebarLoader.suggestedAugmentations = SidebarLoader.suggestedAugmentations.filter(
          (i) => i.id !== augmentation.id,
        ));
    chrome.runtime.sendMessage({ type: UPDATE_SIDEBAR_TABS_MESSAGE });
  }

  public unpinAugmentation(augmentation: AugmentationObject) {
    augmentation.pinned = false;
    SidebarLoader.pinnedAugmentations = SidebarLoader.pinnedAugmentations.filter(
      (i) => i.id !== augmentation.id,
    );
    chrome.storage.local.remove(`${PINNED_PREFIX}-${augmentation.id}`);
    !this.getAugmentationRelevancy(augmentation).isRelevant
      ? SidebarLoader.otherAugmentations.push(augmentation)
      : augmentation.installed
      ? SidebarLoader.installedAugmentations.push(augmentation)
      : SidebarLoader.suggestedAugmentations.push(augmentation);
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
    const hasHideDomains = !!augmentation.actions.action_list.find(
      ({ key }) => key === SEARCH_HIDE_DOMAIN_ACTION,
    );
    if (hasHideDomains) {
      window.top.postMessage({ name: HIDE_DOMAINS_MESSAGE, remove: augmentation.id }, '*');
    }
    chrome.runtime.sendMessage({ type: UPDATE_SIDEBAR_TABS_MESSAGE });
  }

  /**
   * Takes an augmentation as parameter and returns its corresponding relevancy data. The relevancy
   * is depending on the augmentation's matching condition and actions. We assume an augmentation is
   * relevant when either has a matching query, domain or intent condition.
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
    isRelevant: boolean;
    hasPreventAutoexpand: boolean;
    domainsToLookAction: string[];
    domainsToLookCondition: string[];
    matchingDomainsAction: string[];
    matchingDomainsCondition: string[];
  } & NullPrototype<any> {
    if (!augmentation?.actions || !augmentation.conditions) {
      return Object.create(null);
    }

    const domainsToLookCondition = augmentation.conditions.condition_list.reduce(
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
      augmentation.conditions?.condition_list.find(
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

    let hasPreventAutoexpand = false;

    const matchingIntent = !!augmentation.conditions.condition_list
      .reduce((intents, { key, value }) => {
        if (key === SEARCH_INTENT_IS_CONDITION) {
          const matchingIntent = SearchEngineManager.intents.find(
            ({ intent_id }) => intent_id === value[0],
          );
          if (!!matchingIntent.stay_collapsed) {
            hasPreventAutoexpand = true;
          }
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
      isRelevant: matchingQuery || matchingDomains || matchingIntent || augmentation.pinned,
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
    chrome.storage.local.set({ [id]: updated });
    const hasHideActions = updated.actions.action_list.filter(
      ({ key }) => key === SEARCH_HIDE_DOMAIN_ACTION,
    );
    if (!!hasHideActions.length) {
      window.parent.postMessage(
        {
          augmentation: updated,
          name: HIDE_DOMAINS_MESSAGE,
          hideDomains: hasHideActions.map(({ value }) => value[0]),
          selector: {
            link:
              SidebarLoader.customSearchEngine.querySelector[
                window.top.location.href.search(/google\.com/) > -1 ? 'pad' : 'desktop'
              ],
            featured: SidebarLoader.customSearchEngine.querySelector.featured,
            container: SidebarLoader.customSearchEngine.querySelector.result_container_selector,
          },
        },
        '*',
      );
    }
    SidebarLoader.installedAugmentations = [
      updated,
      ...SidebarLoader.installedAugmentations.filter((i) => i.id !== updated.id),
    ];
    chrome.runtime.sendMessage({ type: UPDATE_SIDEBAR_TABS_MESSAGE });
    debug(
      'EditAugmentationPage - save\n---\n\tOriginal',
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

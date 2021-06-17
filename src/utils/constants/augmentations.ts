/**
 * @module constants:augmentation
 * @version 1.0.0
 * @license (C) Insight
 */

import { INSTALLED_PREFIX } from '.';

export const NUM_DOMAINS_TO_CONSIDER = 5;

export const NUM_DOMAINS_TO_EXCLUDE = 3;

export const SUBTABS_CACHE_EXPIRE_MIN = 30;

export const AUGMENTATION_TITLE = {
  NEW: '🎉 My Lens',
  FORKED: ' / Forked',
  TOURLENS: '🗞 My Trusted News',
  TRUSTLIST: '🤝 Sites I Trust',
  BLOCKLIST: '🙈 My Blocklist',
} as const;

export const AUGMENTATION_DESCRIPTION = {
  NEW: '',
  FORKED: '',
  TOURLENS: 'News sources I trust',
  TRUSTLIST: '',
  BLOCKLIST: '',
} as const;

export const AUGMENTATION_VALUE = {
  TOURLENS: ['cnn.com', 'foxnews.com', 'wsj.com', 'bloomberg.com', 'apnews.com'],
  SEARCH_INTENT_IS_NEWS: ['news_us'],
};

export const AUGMENTATION_ID = {
  TOURLENS: `${INSTALLED_PREFIX}-tourlens`,
  TRUSTLIST: `${INSTALLED_PREFIX}-my-trust-list`,
  BLOCKLIST: `${INSTALLED_PREFIX}-my-block-list`,
} as const;

export const BLOCKLIST = {
  ID: AUGMENTATION_ID.BLOCKLIST,
  TITLE: AUGMENTATION_TITLE.BLOCKLIST,
} as const;

export const TRUSTLIST = {
  ID: AUGMENTATION_ID.TRUSTLIST,
  TITLE: AUGMENTATION_TITLE.TRUSTLIST,
} as const;

export const PROTECTED_AUGMENTATIONS = [
  AUGMENTATION_ID.BLOCKLIST,
  AUGMENTATION_ID.TRUSTLIST,
] as const;

export const DISABLED_AUGMENTATIONS = [
  'inject_js', // ActionObject.Key: Inject JS
  '3ACDAD54-0527-4F20-84D4-73EBD1CD848F', // ID: Swipe Through Search ,
] as const;

//-----------------------------------------------------------------------------------------------
// ! Event
//-----------------------------------------------------------------------------------------------

export const AUGMENTATION_STATUS = {
  ENABLED: 'enabled',
  INSTALLED: 'installed',
  PINNED: 'pinned',
  SUGGESTED: 'suggested',
  IGNORED: 'ignored',
  OTHER: 'other',
  MATCHED: 'matched',
  FORCED: 'forced',
} as const;

export const AUGMENTATION_EVENT = {
  ENABLE: 'enable',
  IGNORE: 'ignore',
  INSTALL: 'install',
  UNINSTALL: 'uninstall',
  EDIT: 'edit',
  PIN: 'pin',
  UNPIN: 'unpin',
  SHARE: 'share',
  SUGGEST: 'suggest',
  USAGE: 'used',
} as const;

//-----------------------------------------------------------------------------------------------
// ! Label
//-----------------------------------------------------------------------------------------------

export const ACTION_LABEL = {
  NO_COOKIE: 'Open page with cookies disabled',
  OPEN_LINK_CSS: 'Open links matching CSS selector',
  OPEN_URL: 'Open page',
  SEARCH_ALSO: 'Search also',
  SEARCH_APPEND: 'Search with string appended',
  SEARCH_DOMAINS: 'Search only these domains',
  SEARCH_HIDE_DOMAIN: 'Hide results from domain',
  SEARCH_FEATURE: 'Highlight results from domain',
} as const;

export const CONDITION_LABEL = {
  ANY_SEARCH_ENGINE: 'Match any search engine (removes other conditions)',
  ANY_URL: 'Match any page (removes other conditions)',
  DOMAIN_CONTAINS: 'Domain is one of',
  DOMAIN_EQUALS: 'Domain equals',
  DOMAIN_MATCHES: 'Domain matches regex',
  EMPTY_CONDITION: '+ Choose Condition Type',
  SEARCH_CONTAINS: 'Search results contain domain',
  SEARCH_ENGINE_IS: 'Search engine is',
  SEARCH_INTENT_IS: 'Search intent is',
  SEARCH_QUERY_CONTAINS: 'Search query contains',
  URL_EQUALS: 'URL equals',
  URL_MATCHES: 'URL matches regex',
} as const;

//-----------------------------------------------------------------------------------------------
// ! Key
//-----------------------------------------------------------------------------------------------

export const ACTION_KEY = {
  INJECT_JS: 'inject_js',
  NO_COOKIE: 'no_cookie',
  OPEN_LINK_CSS: 'open_links_css',
  OPEN_URL: 'open_url',
  SEARCH_ALSO: 'search_also',
  SEARCH_APPEND: 'search_append',
  SEARCH_DOMAINS: 'search_domains',
  SEARCH_HIDE_DOMAIN: 'search_hide_domain',
  SEARCH_FEATURE: 'search_feature',
} as const;

export const CONDITION_KEY = {
  ANY_SEARCH_ENGINE: 'any_web_search_url',
  ANY_URL: 'any_url',
  DOMAIN_CONTAINS: 'domain_contains',
  DOMAIN_EQUALS: 'domain_equals',
  DOMAIN_MATCHES: 'domain_matches',
  SEARCH_CONTAINS: 'search_contains',
  SEARCH_ENGINE_IS: 'search_engine',
  SEARCH_INTENT_IS: 'search_intent',
  SEARCH_QUERY_CONTAINS: 'search_query',
  URL_EQUALS: 'url_equals',
  URL_MATCHES: 'url_matches',
} as const;

//-----------------------------------------------------------------------------------------------
// ! Evaluation
//-----------------------------------------------------------------------------------------------

export const ACTION_EVALUATION = {
  AND: 'AND',
  OR: 'OR',
} as const;

export const CONDITION_EVALUATION = {
  AND: 'AND',
  OR: 'OR',
} as const;

//-----------------------------------------------------------------------------------------------
// ! Deprecated
//-----------------------------------------------------------------------------------------------

/** @deprecated Only use for backwards compatibility */
export const LEGACY_ACTION_TYPE = {
  STRING: 'string',
  LIST: 'list',
  REGEX: 'regexp',
  JSON: 'json',
} as const;

/** @deprecated Only use for backwards compatibility */
export const LEGACY_CONDITION_TYPE = {
  STRING: 'string',
  LIST: 'list',
  REGEX: 'regexp',
  JSON: 'json',
} as const;

/** @deprecated Only use for backwards compatibility */
export const LEGACY_KEY = {
  URL: 'url',
  DOMAIN: 'domain',
} as const;

/** @deprecated Only use for backwards compatibility */
export const LEGACY_EVALUATION = {
  CONTAINS: 'contains',
  MATCHES: 'matches',
  EQUALS: 'equals',
  ANY: 'any',
} as const;

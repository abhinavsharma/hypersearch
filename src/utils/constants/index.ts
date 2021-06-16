import { ACTION_KEYS, CONDITION_KEYS } from './augmentations';

/**
 * ! STORAGE
 */
export const ARBITRARY_ENGINE_PREFIX = 'arbitrary-cse';
export const SYNC_EMAIL_KEY = 'userEmail';
export const SYNC_LICENSE_KEY = 'licenseActivated';
export const SYNC_PRIVACY_KEY = 'useServerSuggestions';
export const SYNC_FINISHED_KEY = 'hasFinishedIntro';
export const SYNC_DISTINCT_KEY = 'distinctId';
export const SYNC_PUBLICATION_TIME_TRACK_KEY = 'publicationTimeTrack';
export const SYNC_ALTERNATE_HOVER_ACTION = 'altHoverAction';
export const USER_JWT_TOKEN = 'cognito_user_jwt';
export const DEV_FEATURE_FLAGS = 'devFeatures';
export const CACHED_SUBTABS_KEY = 'cachedSubtabs';
export const USE_COUNT_PREFIX = 'augmentationUseCount';
export const IGNORED_PREFIX = 'ignored';
export const INSTALLED_PREFIX = 'cse-custom';
export const CSE_PREFIX = 'cse';
export const PINNED_PREFIX = 'pinned';
export const DEDICATED_ENGINE_PREFIX = 'dedicated-serp';
export const BOOKMARKS_LAST_FETCH = 'bookmarks_last_fetch';
export const BOOKMARKS_TO_ADD = 'bookmarks_to_add';
export const BOOKMARKS_TO_UPDATE = 'bookmarks_to_update';
export const BOOKMARKS_TO_DELETE = 'bookmarks_to_delete';
export const BOOKMARKS_REMOTE_TO_LOCAL_ID = 'bookmarks_remote_to_local_id';

/**
 * ! CUSTOM AUGMENTATIONS
 */
export const NEW_AUGMENTATION_TITLE = '🎉 My Lens';
export const FORKED_AUGMENTATION_APPENDAGE = ' / Forked';
export const MY_BLOCKLIST_NAME = '🙈 My Blocklist';
export const MY_BLOCKLIST_ID = `${INSTALLED_PREFIX}-my-block-list`;
export const MY_TRUSTLIST_NAME = '🤝 Sites I Trust';
export const MY_TRUSTLIST_ID = `${INSTALLED_PREFIX}-my-trust-list`;

/**
 * ! MAGICS
 */
export const APP_NAME = process.env.PROJECT === 'is' ? 'Insight' : 'Insight';
export const APP_NAME_LONG = 'Insight Lenses';
export const BAZAAR_URL = 'https://bazaar.insight.so';
// This will be sent as parameter to subtabs when strong privacy is enabled and page is SERP
export const DUMMY_SUBTABS_URL = 'https://www.google.com/search?q=react';
// This will be sent as parameter to subtabs when strong privacy is enabled and page is Amazon
export const DUMMY_AMAZON_SUBTABS_URL = 'https://www.amazon.com/s?k=dummy';
export const LUMOS_APP_BASE_URL_DEBUG = 'https://localhost:3000';
export const LUMOS_APP_BASE_URL_PROD = 'https://app.insight.space';
export const LUMOS_API_URL_PROD = 'https://zy6kcqa01a.execute-api.us-east-2.amazonaws.com/prod/';
export const LUMOS_API_URL_DEBUG = 'https://nwwcsdsuw2.execute-api.us-east-2.amazonaws.com/dev/';
export const IN_DEBUG_MODE = process.env.NODE_ENV || window.INSIGHT_FORCE_DEBUG;
export const LUMOS_API_URL = process.env.NODE_ENV ? LUMOS_API_URL_PROD : LUMOS_API_URL_PROD;
export const BOOKMARKS_READ_ENDPOINT = 'sync/bookmarks/read';
export const BOOKMARKS_SAVE_ENDPOINT = 'sync/bookmarks/save';
export const SPECIAL_URL_JUNK_STRING = 'qhfabdyvaykdf';
export const URL_PARAM_POSSIBLE_SERP_RESULT = 'insight-possible-serp-result';
export const URL_PARAM_TAB_TITLE_KEY = 'insight-tab-title';
export const URL_PARAM_NO_COOKIE_KEY = 'insight-no-cookie';
export const EXTERNAL_PDF_RENDERER_URL =
  'https://docs.google.com/viewer?url=<placeholder>&embedded=true';
export const SIDEBAR_Z_INDEX = 9999;
export const SIDEBAR_TAB_FAKE_URL = 'sidebar-fake-tab';
export const AIRTABLE_PUBLIC_LENSES_CREATE =
  'https://airtable.com/shrUAvfbGQqwlW7lI?prefill_base64=<base64>&prefill_name=<name>&prefill_description=<description>';
export const AIRTABLE_IMPROVE_SEARCH_LINK =
  'https://airtable.com/shrk6fAJxOfEnl4fo?prefill_sample_query=<query>';
export const INTENTS_BLOB_URL =
  'https://lumospublicassets.s3.us-east-2.amazonaws.com/search_intent_domains.json';
// Fetch URL where the custom search engine JSON is requested.
export const CUSTOM_SEARCH_ENGINES =
  'https://raw.githubusercontent.com/insightbrowser/augmentations/main/serp_query_selectors.json';
export const SAFARI_FALLBACK_URL = 'https://www.ecosia.org/search';
export const DEFAULT_FALLBACK_SEARCH_ENGINE_PREFIX = 'google.com/search';
export const FEATURE_FLAG_BLOB_URL =
  'https://raw.githubusercontent.com/insightbrowser/scripts/main/ios_feature_flags.json';
export const EXTENSION_HOST = 'extensions.insightbrowser.com';
export const EXTENSION_SHARE_URL = 'https://extensions.insightbrowser.com/extend?text=';
export const EXTENSION_SHORT_SHARE_URL = 'https://extensions.insightbrowser.com/extend/';
export const PRERENDER_TABS = 3;
// Set how much domains we consider when matching augmentations
export const NUM_DOMAINS_TO_CONSIDER = 5;
// Set how much domains should match to exclude an augmentation from suggested list
export const NUM_DOMAINS_TO_EXCLUDE = 3;
// Subtabs cache expire time in MINUTES when strong privacy is enabled
export const SUBTABS_CACHE_EXPIRE_MIN = 30;
// Used to logging analytics events on https://freshpaint.io
export const FRESHPAINT_API_ENDPOINT = 'https://api.perfalytics.com/track';
export const FRESHPAINT_API_TOKEN = 'ee065c1d-6cfa-4f63-8844-36c638543e2d';
// Minimum inner width of the tab to expand sidebar by default.
export const WINDOW_REQUIRED_MIN_WIDTH = 1200;
export const HOVER_EXPAND_REQUIRED_MIN_WIDTH = 1000;
// Mailchimp Configuration
export const MAILCHIMP_SERVER_PREFIX = 'us6';
export const MAILCHIMP_LIST_ID = '4df884a9d6';
export const MAILCHIMP_API_KEY = '1779b85b6ac29f101e1b9d119c9e9b80';
export const MAILCHIMP_URL = `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members/<placeholder>`;
export const AWS_COGNITO_POOL_ID = 'us-east-2_YuInMWEfg';
export const AWS_COGNITO_CLIENT_ID = '7bou6gv1lk6hs35ptm0ciqja77';

/**
 * ! FLAGS
 */
export const ENABLED_AUGMENTATION_TYPES = [
  CONDITION_KEYS.URL_EQUALS,
  CONDITION_KEYS.URL_MATCHES,
  CONDITION_KEYS.DOMAIN_EQUALS,
  CONDITION_KEYS.DOMAIN_MATCHES,
  CONDITION_KEYS.DOMAIN_CONTAINS,
  CONDITION_KEYS.ANY_SEARCH_ENGINE,
  CONDITION_KEYS.ANY_URL,
  CONDITION_KEYS.SEARCH_CONTAINS,
  CONDITION_KEYS.SEARCH_QUERY_CONTAINS,
  CONDITION_KEYS.SEARCH_INTENT_IS,
  CONDITION_KEYS.SEARCH_ENGINE_IS,
  ACTION_KEYS.OPEN_URL,
  ACTION_KEYS.OPEN_LINK_CSS,
  ACTION_KEYS.SEARCH_FEATURE,
  ACTION_KEYS.SEARCH_DOMAINS,
  ACTION_KEYS.SEARCH_HIDE_DOMAIN,
  ACTION_KEYS.SEARCH_APPEND,
  ACTION_KEYS.SEARCH_ALSO,
  ACTION_KEYS.NO_COOKIE,
];

export const PROTECTED_AUGMENTATIONS = [MY_BLOCKLIST_ID, MY_TRUSTLIST_ID];
export const BANNED_EXTENSION_IDS = [
  '3ACDAD54-0527-4F20-84D4-73EBD1CD848F' /* Swipe Through Search*/,
];

/**
 * ! MESSAGES
 */
export enum OPEN_BUILDER_PAGE {
  ACTIVE = 'active',
  GUTTER = 'gutter',
  BUILDER = 'builder',
  SETTINGS = 'settings',
  FEATURE = 'feature',
}

// ! INTERNAL MESSAGES
export const OPEN_AUGMENTATION_BUILDER_MESSAGE = 'OPEN_AUGMENTATION_BUILDER_MESSAGE';
export const ADD_LOCAL_AUGMENTATION_MESSAGE = 'ADD_LOCAL_AUGMENTATION_MESSAGE';
export const REMOVE_AUGMENTATION_SUCCESS_MESSAGE = 'EDIT_AUGMENTATION_SUCCESS';
export const UPDATE_SIDEBAR_TABS_MESSAGE = 'UPDATE_SIDEBAR_TABS';
export const DISABLE_SUGGESTED_AUGMENTATION = 'DISABLE_SUGGESTED_AUGMENTATION';
export const URL_UPDATED_MESSAGE = 'URL_UPDATED_MESSAGE';
export const SEND_FRAME_INFO_MESSAGE = 'SEND_FRAME_INFO_MESSAGE';
export const GET_TAB_DOMAINS_MESSAGE = 'GET_TAB_DOMAINS_MESSAGE';
export const SET_TAB_DOMAINS_MESSAGE = 'SET_TAB_DOMAINS_MESSAGE';
export const PROCESS_SERP_OVERLAY_MESSAGE = 'PROCESS_SERP_OVERLAY_MESSAGE';
export const REMOVE_HIDE_DOMAIN_OVERLAY_MESSAGE = 'REMOVE_HIDE_DOMAIN_OVERLAY_MESSAGE';
export const REMOVE_SEARCHED_DOMAIN_MESSAGE = 'REMOVE_SEARCHED_DOMAIN_MESSAGE';
export const REMOVE_FEATURED_DOMAIN_MESSAGE = 'REMOVE_FEATURED_DOMAIN_MESSAGE';
export const OPEN_NEW_TAB_MESSAGE = 'OPEN_NEW_TAB_MESSAGE';
export const SWITCH_TO_TAB = 'SWITCH_TO_TAB';
export const UPDATE_MY_BLOCK_LIST = 'UPDATE_MY_BLOCK_LIST';
export const EXTENSION_SHORT_URL_RECEIVED = 'EXTENSION_SHORT_URL_RECEIVED';
export const TOGGLE_BLOCKED_DOMAIN_MESSAGE = 'TOGGLE_BLOCKED_DOMAIN_MESSAGE';
export const TOGGLE_TRUSTED_DOMAIN_MESSAGE = 'TOGGLE_TRUSTED_DOMAIN_MESSAGE';
export const OPEN_SETTINGS_PAGE_MESSAGE = 'OPEN_SETTINGS_PAGE_MESSAGE';
export const TRIGGER_PUBLICATION_TIMER_MESSAGE = 'TRIGGER_PUBLICATION_TIMER_MESSAGE';
export const TRIGGER_START_TRACK_TIMER_MESSAGE = 'TRIGGER_START_TRACK_TIMER_MESSAGE';
export const TRIGGER_STOP_TRACK_TIMER_MESSAGE = 'TRIGGER_STOP_TRACK_TIMER_MESSAGE';
export const HIDE_FRAME_OVERLAY_MESSAGE = 'HIDE_FRAME_OVERLAY_MESSAGE;';
export const TRIGGER_FRAME_SCROLL_LOG_MESSAGE = 'TRIGGER_FRAME_SCROLL_LOG_MESSAGE';
export const TRIGGER_GUTTER_HOVEROPEN_MESSAGE = 'TRIGGER_GUTTER_HOVEROPEN_MESSAGE';
export const SYNC_START_MESSAGE = 'SYNC_START_MESSAGE';
export const SYNC_END_MESSAGE = 'SYNC_END_MESSAGE';
export const ADD_EXTERNAL_AUGMENTATION_MESSAGE = 'ADD_EXTERNAL_AUGMENTATION_MESSAGE';
export const ACTIVATE_EMAIL_MESSAGE = 'ACTIVATE_EMAIL_MESSAGE';

// ! LOG MESSAGES
export const SEND_LOG_MESSAGE = 'SEND_LOG_MESSAGE';
export const EXTENSION_SERP_LOADED = 'EXTENSION_SERP_LOADED';
export const EXTENSION_SERP_FILTER_LOADED = 'EXTENSION_SERP_FILTER_LOADED';
export const EXTENSION_SERP_LINK_CLICKED = 'EXTENSION_SERP_LINK_CLICKED';
export const EXTENSION_SERP_FILTER_LINK_CLICKED = 'EXTENSION_SERP_FILTER_LINK_CLICKED';
export const EXTENSION_BLOCKLIST_ADD_DOMAIN = 'EXTENSION_BLOCKLIST_ADD_DOMAIN';
export const EXTENSION_BLOCKLIST_REMOVE_DOMAIN = 'EXTENSION_BLOCKLIST_REMOVE_DOMAIN';
export const EXTENSION_AUGMENTATION_SAVE = 'EXTENSION_AUGMENTATION_SAVE';
export const EXTENSION_AUTO_EXPAND = 'EXTENSION_AUTO_EXPAND';
export const EXTENSION_SERP_SUBTAB_CLICKED = 'EXTENSION_SERP_SUBTAB_CLICKED';
export const EXTENSION_SUBTAB_SCROLL = 'EXTENSION_SUBTAB_SCROLL';
export const EXTENSION_SERP_LINK_HOVEROPEN = 'EXTENSION_SERP_LINK_HOVEROPEN';

/**
 * ! SELECTORS
 */
export const INSIGHT_SEARCH_BY_SELECTOR = 'insight-searched-by';
export const INSIGHT_SEARCHED_DOMAIN_SELECTOR = 'insight-searched-domain';
export const INSIGHT_SEARCHED_RESULT_SELECTOR = 'insight-searched-result';
export const INSIGHT_BLOCKED_BY_SELECTOR = 'insight-blocked-by';
export const INSIGHT_BLOCKED_DOMAIN_SELECTOR = 'insight-blocked-domain';
export const INSIGHT_HIDDEN_RESULT_SELECTOR = 'insight-hidden-result';
export const INSIGHT_ALLOWED_RESULT_SELECTOR = 'insight-allowed-result';
export const INSIGHT_FEATURED_BY_SELECTOR = 'insight-featured-by-selector';
export const INSIGHT_HAS_CREATED_SUBTAB_SELECTOR = 'insight-has-created-subtab';
export const INSIGHT_RESULT_URL_SELECTOR = 'insight-result-url';
export const GOOGLE_SERP_RESULT_DIV_SELECTOR = '.mnr-c.xpd .KJDcUb';
export const GOOGLE_SERP_RESULT_CONTAINER = '[data-hveid]';
export const GOOGLE_SERP_RESULT_A_SELECTOR = '.KJDcUb a.BmP5tf';
export const GOOGLE_SERP_RESULT_DOMAIN_SELECTOR_FULL = '.mnr-c.xpd .KJDcUb a.BmP5tf';
export const BANNED_DOMAINS = ['duckduckgo.com/y.js'];
export const KP_SELECTORS = [
  '.kp-wholepage',
  '#imso-root',
  '.b_ans',
  '.module--about',
  '.knowledge-panel',
];

/**
 * ! REGEX
 */
export const DEDICATED_SERP_REGEX = new RegExp(
  /google\.com|ecosia\.org|duckduckgo\.com|bing\.com/gi,
);
export const FORCE_FALLBACK_CSE = new RegExp(/amazon\.com/gi);
export const IMAGE_URL_PARAM = new RegExp(/(ia[\w]?=images|tbm=isch)/gi);
export const DOMAINS_TO_RELEVANT_SLICE: Record<string, RegExp> = {
  'reddit.com': new RegExp(/^reddit\.com\/r\/[\w-]+/), // reddit.com/r/{tag}
  'medium.com': new RegExp(/^^medium\.com\/(?!tag|about|creators|membership)(@{0,1}[\w-]+)/), // medium.com/{@?username} ban: medium.com/(tag|about|creators|membership)/*
  'dev.to': new RegExp(/^dev\.to\/(?!t\/)([\w-]+)/), // dev.to/{username} ban: dev.to/t/*
  'github.com': new RegExp(
    /^github\.com\/(?!explore|login|about|pricing|features|marketplace|mobile|collections)([\w-]+)/,
  ), // github.com/*
  'twitter.com': new RegExp(/^twitter\.com\/(?!search.*)([\w-]+)/), // twitter.com/{username} ban twitter.com/search*
  'instagram.com': new RegExp(/^instagram\.com\/(?!explore.*)([\w-]+)/), // instagram.com/{username} ban instagram.com/explore*
};

export * from './templates';
export * from './augmentations';
export * from './ad_block';
export * from './keyboard';

/**
 * @module constant:index
 * @version 1.0.0
 * @license (C) Insight
 */

//-----------------------------------------------------------------------------------------------
// ! Sidebar
//-----------------------------------------------------------------------------------------------

export const PAGE = {
  ACTIVE: 'active',
  BUILDER: 'builder',
  FEATURE: 'feature',
  GUTTER: 'gutter',
  SETTINGS: 'settings'
} as const;

export const SPECIAL_URL_JUNK_STRING = 'qhfabdyvaykdf';
export const URL_PARAM_POSSIBLE_SERP_RESULT = 'insight-possible-serp-result';
export const URL_PARAM_TAB_TITLE_KEY = 'insight-tab-title';
export const URL_PARAM_NO_COOKIE_KEY = 'insight-no-cookie';

//-----------------------------------------------------------------------------------------------
// ! Storage
//-----------------------------------------------------------------------------------------------
export const SYNC_PRIVACY_KEY = 'useServerSuggestions';
export const SYNC_FINISHED_KEY = 'hasFinishedIntro';
export const SYNC_DISTINCT_KEY = 'distinctId';
export const SYNC_USER_TAGS = "user_tags";
export const SYNC_LAST_USED_TAGS = "last_user_tags"
export const NOTE_PREFIX = "note-";
export const ARBITRARY_ENGINE_PREFIX = 'arbitrary-cse';
export const DEV_FEATURE_FLAGS = 'devFeatures';
export const USE_COUNT_PREFIX = 'augmentationUseCount';
export const IGNORED_PREFIX = 'ignored';
export const INSTALLED_PREFIX = 'cse-custom';
export const CSE_PREFIX = 'cse';
export const PINNED_PREFIX = 'pinned';
export const DEDICATED_ENGINE_PREFIX = 'dedicated-serp';
export const PUBLICATION_REDIRECT_URL = "publication_redirect_url"

//-----------------------------------------------------------------------------------------------
// ! External
//-----------------------------------------------------------------------------------------------
export const BAZAAR_URL = 'https://bazaar.insight.so';
export const EXTERNAL_PDF_RENDERER_URL = 'https://docs.google.com/viewer?url=<placeholder>&embedded=true';
export const AIRTABLE_PUBLIC_LENSES_CREATE ='https://airtable.com/shrUAvfbGQqwlW7lI?prefill_base64=<base64>&prefill_name=<name>&prefill_description=<description>';
export const AIRTABLE_IMPROVE_SEARCH_LINK = 'https://airtable.com/shrk6fAJxOfEnl4fo?prefill_sample_query=<query>';
export const INTENTS_BLOB_URL = 'https://lumospublicassets.s3.us-east-2.amazonaws.com/search_intent_domains.json';
export const CUSTOM_SEARCH_ENGINES = 'https://raw.githubusercontent.com/insightbrowser/augmentations/main/serp_query_selectors.json';
export const FEATURE_FLAG_BLOB_URL = 'https://raw.githubusercontent.com/insightbrowser/scripts/main/ios_feature_flags.json';
export const PUBLICATION_INFO_BLOB_URL = "https://raw.githubusercontent.com/insightbrowser/augmentations/main/publication_info.json"
export const SUGGESTED_AUGMENTATIONS = 'https://raw.githubusercontent.com/abhinavsharma/hypersearch/master/constants_extensions.json';

//-----------------------------------------------------------------------------------------------
// ! Notes
//-----------------------------------------------------------------------------------------------

export const NOTE_TAB_TITLE = 'Notes';

//-----------------------------------------------------------------------------------------------
// ! Extension
//-----------------------------------------------------------------------------------------------

export const EXTENSION_HOST = 'extensions.hyperweb.app';
export const EXTENSION_SHARE_URL = 'https://extensions.hyperweb.app/extend?text=';

//-----------------------------------------------------------------------------------------------
// ! Logging
//-----------------------------------------------------------------------------------------------

export const FRESHPAINT_API_ENDPOINT = '';
export const FRESHPAINT_API_TOKEN = '';

//-----------------------------------------------------------------------------------------------
// ! Chrome
//-----------------------------------------------------------------------------------------------

export const ADD_LOCAL_AUGMENTATION_MESSAGE = 'ADD_LOCAL_AUGMENTATION_MESSAGE';
export const REMOVE_AUGMENTATION_SUCCESS_MESSAGE = 'EDIT_AUGMENTATION_SUCCESS';
export const UPDATE_SIDEBAR_TABS_MESSAGE = 'UPDATE_SIDEBAR_TABS';
export const REFRESH_SIDEBAR_TABS_MESSAGE = 'REFRESH_SIDEBAR_TABS_MESSAGE';
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
export const HIDE_FRAME_OVERLAY_MESSAGE = 'HIDE_FRAME_OVERLAY_MESSAGE;';
export const TRIGGER_FRAME_SCROLL_LOG_MESSAGE = 'TRIGGER_FRAME_SCROLL_LOG_MESSAGE';
export const TRIGGER_GUTTER_HOVEROPEN_MESSAGE = 'TRIGGER_GUTTER_HOVEROPEN_MESSAGE';
export const ACTIVATE_EMAIL_MESSAGE = 'ACTIVATE_EMAIL_MESSAGE';
export const POST_TAB_UPDATE_MESSAGE = 'POST_TAB_UPDATE_MESSAGE';
export const FETCH_REQUEST_MESSAGE = 'FETCH_REQUEST_MESSAGE';
export const IS_TOP_WINDOW_DARK_MESSAGE = 'IS_TOP_WINDOW_DARK_MESSAGE';

//-----------------------------------------------------------------------------------------------
// ! Logging
//-----------------------------------------------------------------------------------------------

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

//-----------------------------------------------------------------------------------------------
// ! Selectors
//-----------------------------------------------------------------------------------------------

export const INSIGHT_GUTTER_ACTION_BAR_LEFT_SELECTOR = 'insight-gutter-action-bar-left';
export const INSIGHT_GUTTER_ACTION_BAR_RIGHT_SELECTOR = 'insight-gutter-action-bar-right';
export const INSIGHT_GUTTER_PUBLICATION_TAG_SELECTOR = 'insight-gutter-publication-tag';
export const INSIGHT_SHOW_GUTTER_ICON_SELECTOR = 'insight-show-gutter-icon';
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
export const INSIGHT_BLOCKED = 'insight-blocked';
export const GOOGLE_SERP_RESULT_DIV_SELECTOR = '.mnr-c.xpd .KJDcUb';
export const GOOGLE_SERP_RESULT_CONTAINER = '[data-hveid]';
export const GOOGLE_SERP_RESULT_A_SELECTOR = '.KJDcUb a.BmP5tf';
export const GOOGLE_SERP_RESULT_DOMAIN_SELECTOR_FULL = '.mnr-c.xpd .KJDcUb a.BmP5tf';
export const GOOGLE_VERTICAL_NEWS_LINK_SELECTOR = '.EPLo7b a';
export const GOOGLE_HORIZONTAL_NEWS_LINK_SELECTOR = '.JJZKK a';
export const BANNED_DOMAINS = ['duckduckgo.com/y.js'];
export const KP_SELECTORS = [
  '.kp-wholepage',
  '#imso-root',
  '.b_ans',
  '.module--about',
  '.knowledge-panel',
];

//-----------------------------------------------------------------------------------------------
// ! Regular Expressions
//-----------------------------------------------------------------------------------------------

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

//-----------------------------------------------------------------------------------------------
// ! Exports
//-----------------------------------------------------------------------------------------------

export * from './adblock';
export * from './application';
export * from './augmentations';
export * from './keyboard';
export * from './message'
export * from './templates';

import {
  INSTALLED_PREFIX,
  NOTE_TAB_TITLE,
  ACTION_EVALUATION,
  ACTION_KEY,
  ACTION_LABEL,
  AUGMENTATION_ID,
  AUGMENTATION_TITLE,
  CONDITION_EVALUATION,
  CONDITION_KEY,
  CONDITION_LABEL,
  LEGACY_ACTION_TYPE,
  LEGACY_CONDITION_TYPE,
  LEGACY_EVALUATION,
} from 'constant';

export const NOTE_AUGMENTATION_ID = `${INSTALLED_PREFIX}-note`

export const EMPTY_AUGMENTATION = {
  actions: {
    action_list: [],
    evaluate_with: ACTION_EVALUATION.AND,
  },
  conditions: {
    condition_list: [
      {
        evaluation: LEGACY_EVALUATION.CONTAINS,
        key: CONDITION_KEY.SEARCH_CONTAINS,
        unique_key: CONDITION_KEY.SEARCH_CONTAINS,
        label: CONDITION_LABEL.SEARCH_CONTAINS,
        type: LEGACY_CONDITION_TYPE.LIST,
        value: [],
      },
    ],
    evaluate_with: CONDITION_EVALUATION.OR,
  },
  description: '',
  enabled: false,
  id: '',
  installed: false,
  name: '',
} as Augmentation;

export const ANY_SEARCH_ENGINE_CONDITION_TEMPLATE = {
  evaluation: LEGACY_EVALUATION.MATCHES,
  key: CONDITION_KEY.ANY_SEARCH_ENGINE,
  unique_key: CONDITION_KEY.ANY_SEARCH_ENGINE,
  label: CONDITION_LABEL.ANY_SEARCH_ENGINE,
  type: LEGACY_CONDITION_TYPE.LIST,
  value: ['.*'],
};

export const ANY_URL_CONDITION_TEMPLATE = {
  evaluation: LEGACY_EVALUATION.MATCHES,
  key: CONDITION_KEY.ANY_URL,
  unique_key: CONDITION_KEY.ANY_URL,
  label: CONDITION_LABEL.ANY_URL,
  type: LEGACY_CONDITION_TYPE.LIST,
  value: ['.*'],
};

export const SEARCH_INTENT_IS_US_NEWS_TEMPLATE = {
  key: CONDITION_KEY.SEARCH_INTENT_IS,
  unique_key: CONDITION_KEY.SEARCH_INTENT_IS,
  label: CONDITION_LABEL.SEARCH_INTENT_IS,
  type: LEGACY_CONDITION_TYPE.LIST,
  value: ['news_us'],
};

export const TOUR_AUGMENTATION = {
  name: '🗞 My Trusted News',
  description: 'News sources I trust',
  conditions: {
    condition_list: [SEARCH_INTENT_IS_US_NEWS_TEMPLATE],
    evaluate_with: CONDITION_EVALUATION.OR,
  },
  actions: {
    action_list: [
      {
        key: ACTION_KEY.SEARCH_DOMAINS,
        label: ACTION_LABEL.SEARCH_DOMAINS,
        type: LEGACY_ACTION_TYPE.LIST,
        value: ['cnn.com', 'foxnews.com', 'wsj.com', 'bloomberg.com', 'apnews.com'],
      },
    ],
  },
} as Augmentation;

export const MY_BLOCKLIST_TEMPLATE = {
  ...EMPTY_AUGMENTATION,
  id: AUGMENTATION_ID.BLOCKLIST,
  name: AUGMENTATION_TITLE.BLOCKLIST,
  enabled: true,
  conditions: {
    ...EMPTY_AUGMENTATION.conditions,
    condition_list: [ANY_SEARCH_ENGINE_CONDITION_TEMPLATE],
  },
  actions: {
    ...EMPTY_AUGMENTATION.actions,
    action_list: [
      {
        key: ACTION_KEY.SEARCH_HIDE_DOMAIN,
        label: ACTION_LABEL.SEARCH_HIDE_DOMAIN,
        type: LEGACY_ACTION_TYPE.LIST,
        value: [],
      },
    ],
  },
} as Augmentation;

export const MY_TRUSTLIST_TEMPLATE = {
  ...EMPTY_AUGMENTATION,
  id: AUGMENTATION_ID.TRUSTLIST,
  name: AUGMENTATION_TITLE.TRUSTLIST,
  enabled: true,
  conditions: {
    ...EMPTY_AUGMENTATION.conditions,
    condition_list: [ANY_SEARCH_ENGINE_CONDITION_TEMPLATE],
  },
  actions: {
    ...EMPTY_AUGMENTATION.actions,
    action_list: [
      {
        key: ACTION_KEY.SEARCH_DOMAINS,
        label: ACTION_LABEL.SEARCH_DOMAINS,
        type: LEGACY_ACTION_TYPE.LIST,
        value: [],
      },
    ],
  },
} as Augmentation;

export const createNote = (url: string) => ({
  ...EMPTY_AUGMENTATION,
  id: NOTE_AUGMENTATION_ID,
  name: NOTE_TAB_TITLE,
  enabled: true,
  conditions: {
    ...EMPTY_AUGMENTATION.conditions,
    condition_list: [ANY_URL_CONDITION_TEMPLATE],
  },
  actions: {
    ...EMPTY_AUGMENTATION.actions,
    action_list: [
      {
        key: ACTION_KEY.URL_NOTE,
        label: ACTION_LABEL.URL_NOTE,
        type: LEGACY_ACTION_TYPE.LIST,
        value: [url],
      },
    ],
  },
});

export const EMPTY_CUSTOM_SEARCH_ENGINE_BLOB = {
  querySelector: {
    desktop: '',
    featured: [],
    pad: '',
    phone: '',
    container: '',
    result_container_selector: '',
  },
  search_engine_json: {
    required_params: [],
    required_prefix: '',
  },
} as SearchEngineObject;

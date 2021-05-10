import { MY_BLOCKLIST_ID, MY_BLOCKLIST_NAME, MY_TRUSTLIST_ID, MY_TRUSTLIST_NAME } from './index';
import {
  ACTION_KEYS,
  ACTION_LABELS,
  ACTION_LIST_EVALUATIONS,
  ACTION_TYPES,
  CONDITION_KEYS,
  CONDITION_LABELS,
  CONDITION_LIST_EVALUATIONS,
  CONDITION_TYPES,
  LEGACY_EVALUATION,
} from './augmentations';

export const EMPTY_AUGMENTATION = {
  actions: {
    action_list: [],
    evaluate_with: ACTION_LIST_EVALUATIONS.AND,
  },
  conditions: {
    condition_list: [
      {
        evaluation: LEGACY_EVALUATION.CONTAINS,
        key: CONDITION_KEYS.SEARCH_CONTAINS,
        unique_key: CONDITION_KEYS.SEARCH_CONTAINS,
        label: CONDITION_LABELS.SEARCH_CONTAINS,
        type: CONDITION_TYPES.LIST,
        value: [],
      },
    ],
    evaluate_with: CONDITION_LIST_EVALUATIONS.OR,
  },
  description: '',
  enabled: false,
  id: '',
  installed: false,
  name: '',
} as AugmentationObject;

export const ANY_URL_CONDITION_TEMPLATE = {
  evaluation: LEGACY_EVALUATION.MATCHES,
  key: CONDITION_KEYS.ANY_SEARCH_ENGINE,
  unique_key: CONDITION_KEYS.ANY_SEARCH_ENGINE,
  label: CONDITION_LABELS.ANY_SEARCH_ENGINE,
  type: CONDITION_TYPES.LIST,
  value: ['.*'],
};

export const SEARCH_INTENT_IS_US_NEWS_TEMPLATE = {
  key: CONDITION_KEYS.SEARCH_INTENT_IS,
  unique_key: CONDITION_KEYS.SEARCH_INTENT_IS,
  label: CONDITION_LABELS.SEARCH_INTENT_IS,
  type: CONDITION_TYPES.LIST,
  value: ['news_us'],
};

export const TOUR_AUGMENTATION = {
  name: '🗞 My Trusted News',
  description: 'News sources I trust',
  conditions: {
    condition_list: [SEARCH_INTENT_IS_US_NEWS_TEMPLATE],
    evaluate_with: CONDITION_LIST_EVALUATIONS.OR,
  },
  actions: {
    action_list: [
      {
        key: ACTION_KEYS.SEARCH_DOMAINS,
        label: ACTION_LABELS.SEARCH_DOMAINS,
        type: ACTION_TYPES.LIST,
        value: ['cnn.com', 'foxnews.com', 'wsj.com', 'bloomberg.com', 'apnews.com'],
      },
    ],
  },
} as AugmentationObject;

export const MY_BLOCKLIST_TEMPLATE = {
  ...EMPTY_AUGMENTATION,
  id: MY_BLOCKLIST_ID,
  name: MY_BLOCKLIST_NAME,
  enabled: true,
  conditions: {
    ...EMPTY_AUGMENTATION.conditions,
    condition_list: [ANY_URL_CONDITION_TEMPLATE],
  },
  actions: {
    ...EMPTY_AUGMENTATION.actions,
    action_list: [
      {
        key: ACTION_KEYS.SEARCH_HIDE_DOMAIN,
        label: ACTION_LABELS.SEARCH_HIDE_DOMAIN,
        type: ACTION_TYPES.LIST,
        value: [],
      },
    ],
  },
} as AugmentationObject;

export const MY_TRUSTLIST_TEMPLATE = {
  ...EMPTY_AUGMENTATION,
  id: MY_TRUSTLIST_ID,
  name: MY_TRUSTLIST_NAME,
  enabled: true,
  conditions: {
    ...EMPTY_AUGMENTATION.conditions,
    condition_list: [ANY_URL_CONDITION_TEMPLATE],
  },
  actions: {
    ...EMPTY_AUGMENTATION.actions,
    action_list: [
      {
        key: ACTION_KEYS.SEARCH_DOMAINS,
        label: ACTION_LABELS.SEARCH_DOMAINS,
        type: ACTION_TYPES.LIST,
        value: [],
      },
    ],
  },
} as AugmentationObject;

export const EMPTY_CUSTOM_SEARCH_ENGINE_BLOB = {
  querySelector: {
    desktop: '',
    featured: [],
    pad: '',
    phone: '',
    result_container_selector: '',
  },
  search_engine_json: {
    required_params: [],
    required_prefix: '',
  },
} as CustomSearchEngine;

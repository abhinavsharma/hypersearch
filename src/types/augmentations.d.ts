declare type Condition = {
  evaluate_with: import('utils/constants').CONDITION_LIST_EVALUATIONS;
  condition_list: ConditionObject[];
};

declare type Action = {
  evaluate_with: import('utils/constants').ACTION_LIST_EVALUATIONS;
  action_list: ActionObject[];
};

declare type ActionObject = {
  label: import('utils/constants').ACTION_LABELS;
  key: import('utils/constants').ACTION_KEYS | import('utils/constants').LEGACY_KEYS;
  type: import('utils/constants').ACTION_TYPES;
  value: string[];
};

declare type ConditionObject = {
  label: import('utils/constants').CONDITION_LABELS;
  key: import('utils/constants').CONDITION_KEYS | import('utils/constants').LEGACY_KEYS;
  unique_key?: import('utils/constants').CONDITION_KEYS;
  type: import('utils/constants').CONDITION_TYPES;
  value: string[];
  evaluation?: import('utils/constants').LEGACY_EVALUATION;
};

declare type AugmentationObject = {
  id: string;
  name: string;
  description: string;
  conditions: Condition;
  actions: Action;
  enabled?: boolean;
  installed?: boolean;
  pinned?: boolean;
  stats?: number;
};

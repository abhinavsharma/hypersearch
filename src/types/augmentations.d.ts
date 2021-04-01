declare type Condition = {
  evaluate_with: 'AND' | 'OR';
  condition_list: ConditionObject[];
};

declare type Action = {
  evaluate_with: 'AND' | 'OR';
  action_list: ActionObject[];
};

declare type ActionObject = {
  label: string;
  key: string;
  type: string;
  value: string[];
};

declare type ConditionObject = {
  label: string;
  key: string;
  type: string;
  value: string[];
  evaluation?: string;
};

declare type AugmentationObject = {
  id: string;
  name: string;
  description: string;
  conditions: Condition;
  actions: Action;
  enabled?: boolean;
  installed?: boolean;
};

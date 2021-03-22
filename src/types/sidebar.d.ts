declare type AugmentationContext = {
  url: string;
  originalTabs: SidebarTab[];
  installed: AugmentationObject[];
  suggested: AugmentationObject[];
};

declare type SidebarTab = {
  id: string;
  title: string;
  url: URL;
  default: boolean;
  readable?: string;
  matchingDomainsCondition?: string[];
  matchingDomainsAction?: string[];
  isCse?: boolean;
  isSuggested?: boolean;
  isPinnedTab?: boolean;
};

declare type SidebarResponseArrayObject = {
  url: string | null;
  preview_url: string | null;
  default: boolean;
  title: string | null;
  readable_content: string | null;
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

declare type Condition = {
  evaluate_with: 'AND' | 'OR';
  condition_list: ConditionObject[];
};

declare type Action = {
  evaluate_with: 'AND' | 'OR';
  action_list: ActionObject[];
};

declare type AugmentationObject = {
  id: string;
  name: string;
  description: string;
  conditions: Condition;
  actions: Action;
  enabled?: boolean;
};

declare type CustomSearchEngine = {
  querySelector: {
    phone: string;
    pad: string;
    desktop: string;
  };
  search_engine_json: {
    required_params: string[];
    required_prefix: string;
  };
};

declare type SubtabsResponse = {
  subtabs: SidebarResponseArrayObject[];
  suggested_augmentations?: AugmentationObject[];
};

declare module 'serp.json';

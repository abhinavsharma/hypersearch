declare type SidebarTab = {
  title: string;
  url: URL;
  default: boolean;
  isPinnedTab?: boolean;
};

declare type SidebarResponseArrayObject = {
  url: string | null;
  preview_url: string | null;
  default: boolean;
  title: string | null;
  readable_content: string | null;
};

declare type AugmentationSingleActionObject = {
  label: string;
  key: string;
  type: string;
  value: string | string[];
};

declare type AugmentationSingleConditionObject = {
  label: string;
  key: string;
  evaluation: string;
  type: string;
  value: string | string[];
};

declare type AugmentationAllCondtitionsObject = {
  evaluate_with: 'AND' | 'OR';
  condition_list: AugmentationSingleConditionObject[];
};

declare type AugmentationActionsObject = {
  evaluate_with: 'AND' | 'OR';
  action_list: AugmentationSingleActionObject[];
};

declare type SuggestedAugmentationObject = {
  id: string;
  name: string;
  description: string;
  conditions: AugmentationAllCondtitionsObject;
  actions: AugmentationActionsObject;
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
  suggested_augmentations?: SuggestedAugmentationObject[];
};

declare module 'serp.json';

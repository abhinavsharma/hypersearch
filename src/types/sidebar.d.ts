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
  isCse?: boolean;
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

declare type ActionObject = {
  label: string;
  key: string;
  evaluation?: string;
  type: string;
  value: string | string[];
};

declare type Condition = {
  evaluate_with: 'AND' | 'OR';
  condition_list: ActionObject[];
};

declare type Action = {
  evaluate_with: 'AND' | 'OR';
  action_list: AugmentationSingleActionObject[];
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

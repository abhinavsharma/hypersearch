declare type SidebarTab = {
  title: string;
  url: URL;
  default: boolean;
  isPinnedTab?: boolean;
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

declare module 'serp.json';

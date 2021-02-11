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
  check_url_prefix: string;
};

declare module 'serp.json';

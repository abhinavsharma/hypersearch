declare type CustomSearchEngine = {
  querySelector: {
    phone: string;
    pad: string;
    desktop: string;
    featured: string[];
    result_container_selector: string;
  };
  search_engine_json: {
    required_params: string[];
    required_prefix: string;
  };
};

declare type SearchIntent = {
  name: string;
  intent_id: string;
  google_css: string;
  sites: string;
};

export enum CONDITION_KEYS {
  ANY_URL = 'any_url',
  ANY_SEARCH_ENGINE = 'any_web_search_url',
  SEARCH_CONTAINS = 'search_contains',
  SEARCH_QUERY_CONTAINS = 'search_query',
  SEARCH_INTENT_IS = 'search_intent',
  SEARCH_ENGINE_IS = 'search_engine',
  URL_EQUALS = 'url_equals',
  URL_MATCHES = 'url_matches',
  DOMAIN_EQUALS = 'domain_equals',
  DOMAIN_MATCHES = 'domain_matches',
  DOMAIN_CONTAINS = "domain_contains"
}

export enum ACTION_KEYS {
  OPEN_URL = 'open_url',
  SEARCH_DOMAINS = 'search_domains',
  SEARCH_HIDE_DOMAIN = 'search_hide_domain',
  SEARCH_APPEND = 'search_append',
  INJECT_JS = 'inject_js',
  SEARCH_ALSO = 'search_also',
  OPEN_LINK_CSS = 'open_link_css',
}

export enum CONDITION_LABELS {
  EMPTY_CONDITION = '+ Choose Condition Type',
  // ! SEARCH CONDITIONS
  SEARCH_CONTAINS = 'Search results contain domain',
  SEARCH_QUERY_CONTAINS = 'Search query contains',
  SEARCH_INTENT_IS = 'Search intent is',
  SEARCH_ENGINE_IS = 'Search engine is',
  ANY_SEARCH_ENGINE = 'Match any search engine (removes other conditions)',
  ANY_URL = 'Match any page (removes other conditions)',
  // ! URL CONDITIONS
  URL_EQUALS = 'URL equals',
  URL_MATCHES = 'URL matches regex',
  // ! DOMAIN CONDITIONS
  DOMAIN_EQUALS = 'Domain equals',
  DOMAIN_MATCHES = 'Domain matches regex',
  DOMAIN_CONTAINS = 'Domain is one of',
}

export enum ACTION_LABELS {
  // ! SEARCH ACTIONS
  SEARCH_DOMAINS = 'Search only these domains',
  SEARCH_HIDE_DOMAIN = 'Hide results from domain',
  SEARCH_APPEND = 'Search with string appended',
  SEARCH_ALSO = 'Search also',
  // ! URL ACTION
  OPEN_URL = 'Open page',
  OPEN_LINK_CSS = 'Open links matching CSS selector',
}

export enum CONDITION_LIST_EVALUATIONS {
  AND = 'AND',
  OR = 'OR',
}

export enum ACTION_LIST_EVALUATIONS {
  AND = 'AND',
  OR = 'OR',
}

export enum CONDITION_TYPES {
  STRING = 'string',
  LIST = 'list',
  REGEX = 'regexp',
  JSON = 'json',
}

export enum ACTION_TYPES {
  STRING = 'string',
  LIST = 'list',
  REGEX = 'regexp',
  JSON = 'json',
}

export enum LEGACY_EVALUATION {
  CONTAINS = 'contains',
  MATCHES = 'matches',
  EQUALS = 'equals',
  ANY = 'any',
}

export enum LEGACY_KEYS {
  URL = 'url',
  DOMAIN = 'domain',
}

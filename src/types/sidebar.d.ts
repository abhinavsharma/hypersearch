declare type SidebarTab = {
  id: string;
  title: string;
  description?: string;
  url: URL;
  default: boolean;
  actionTypes?: string[];
  conditionTypes?: string[];
  isCse?: boolean;
  hideDomains?: string[];
  isSuggested?: boolean;
  matchingDomainsAction?: string[];
  matchingDomainsCondition?: string[];
  readable?: string;
};

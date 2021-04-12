declare type SidebarTab = {
  id: string;
  title: string;
  description?: string;
  url: URL;
  augmentation?: AugmentationObject;
  isCse?: boolean;
  matchingDomainsAction?: string[];
  matchingDomainsCondition?: string[];
  readable?: string;
};

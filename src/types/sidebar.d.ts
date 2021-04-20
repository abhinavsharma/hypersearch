declare type SidebarTab = {
  id: string;
  title: string;
  description?: string;
  url: URL;
  augmentation?: AugmentationObject;
  isCse?: boolean;
  matchingIntent?: string[];
  matchingDomainsAction?: string[];
  matchingDomainsCondition?: string[];
  readable?: string;
};

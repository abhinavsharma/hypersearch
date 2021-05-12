declare type SidebarTab = {
  id: string;
  title: string;
  description: string;
  url: URL;
  augmentation: AugmentationObject;
  isCse?: boolean;
  matchingIntent?: Array<string | Element>;
  matchingDomainsAction?: string[];
  matchingDomainsCondition?: string[];
  readable?: string;
};

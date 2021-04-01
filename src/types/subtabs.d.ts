declare type SubtabsResponse = {
  subtabs: SidebarResponseArrayObject[];
  suggested_augmentations?: AugmentationObject[];
};

declare type SidebarResponseArrayObject = {
  url: string | null;
  preview_url: string | null;
  default: boolean;
  title: string | null;
  readable_content: string | null;
};

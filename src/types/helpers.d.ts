/* eslint-disable @typescript-eslint/ban-types */
declare interface Window {
  INSIGHT_FORCE_DEBUG: boolean;
}

declare interface Array<T> {
  findLastIndex(arg: (value: T, index: number, obj: T[]) => boolean): number;
}

declare type TSidebarLoader = typeof import('lib/SidebarLoader/SidebarLoader').default;

/* eslint-disable @typescript-eslint/ban-types */
declare type NullPrototype<
  T,
  U extends string | number | symbol = string | number | symbol,
  K extends string | number | symbol = (string | number | symbol) & U,
  OPK extends keyof Object = keyof Object & U,
> = { [P in K]?: T } & ({ [Q in keyof Object]?: never } | { [R in OPK]?: T });
/* eslint-enable @typescript-eslint/ban-types */

declare type ProcessSerpOverlayMessage = MessageEvent<{
  augmentation: AugmentationObject;
  name: string;
  tab?: string;
  hideDomains: string[];
  featureDomains: string[];
  hoverAltered: boolean;
  createdUrls: string[];
  selector: {
    link: string;
    featured: string[];
    container: string;
  };
  customLink?: boolean;
}>;

declare type RemoveSearchedDomainMessage = MessageEvent<{
  name: string;
  remove: AugmentationObject['id'];
  domains: ActionObject['value'] | ConditionObject['value'];
  selector: {
    link: string;
    featured: string[];
    container: string;
  };
}>;

declare type PublicationTimeTrackerMessage = {
  type: string;
  event: 'start' | 'stop';
  domain?: string;
  stopTime?: number;
};

declare type RemoveHideDomainOverlayMessage = MessageEvent<{
  domain: string;
  domains: string;
  name: string;
  remove: string;
}>;

declare type RemoveMessage = ProcessSerpOverlayMessage &
  RemoveHideDomainOverlayMessage &
  RemoveSearchedDomainMessage;

declare type ResultMessageData = ProcessSerpOverlayMessage['data'] &
  RemoveHideDomainOverlayMessage['data'] &
  RemoveSearchedDomainMessage['data'];

declare type OpenActivePageMessage = {
  type: string;
  page: import('utils/constants').OPEN_BUILDER_PAGE.ACTIVE;
};

declare type OpenGutterPageMessage = {
  type: string;
  page: import('utils/constants').OPEN_BUILDER_PAGE.GUTTER;
  augmentations: AugmentationObject[];
  publication: string;
};

declare type OpenBuilderMessage = {
  type: string;
  page: import('utils/constants').OPEN_BUILDER_PAGE.BUILDER;
  augmentation: AugmentationObject;
  create?: boolean;
};

declare type ExtractedURLProperties = {
  hostname: string;
  params: string[];
  full: string;
};

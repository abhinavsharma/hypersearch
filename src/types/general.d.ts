/**
 * @module types:general
 * @version 1.0.0
 * @license (C) Insight
 */

//-----------------------------------------------------------------------------------------------
// ! Sidebar
//-----------------------------------------------------------------------------------------------
declare type SidebarTab = {
  url: URL;
  matchingDomainsCondition?: string[];
  matchingDomainsAction?: string[];
  matchingIntent?: (Intent | string)[];
  augmentation: Augmentation;
};

declare type SidebarPage = TSidebarPage[keyof TSidebarPage];
type TSidebarPage = typeof import('constant').PAGE;

//-----------------------------------------------------------------------------------------------
// ! Engine
//-----------------------------------------------------------------------------------------------

declare type SearchEngineObject = {
  querySelector: SearchEngineQuerySelector;
  search_engine_json: SearchEngineSearchParams;
};

declare type SearchEngineQuerySelector = {
  phone: string;
  pad: string;
  desktop: string;
  featured: string[];
  container: string;
  result_container_selector: string;
};

declare type SearchEngineSearchParams = {
  required_params: string[];
  required_prefix: string;
};

//-----------------------------------------------------------------------------------------------
// ! Intent
//-----------------------------------------------------------------------------------------------

declare type SearchIntent = {
  name: string;
  intent_id: string;
  google_css: string;
  sites: string;
  stay_collapsed: boolean;
};

declare type SearchIntentResults = {
  intentDomains: string[];
  intentElements: HTMLElement[];
};

//-----------------------------------------------------------------------------------------------
// ! Subtabs
//-----------------------------------------------------------------------------------------------

declare type Subtab = {
  url: string | null;
  preview_url: string | null;
  default: boolean;
  title: string | null;
  readable_content: string | null;
};

declare type SubtabsResponse = {
  subtabs: Subtab[];
  suggested_augmentations?: Augmentation[];
};

//-----------------------------------------------------------------------------------------------
// ! Publication
//-----------------------------------------------------------------------------------------------

declare type PublicationTag = {
  text: string;
  rating: number;
};

declare type PublicationInfo = {
  tags: PublicationTag[];
  url?: string;
  publication?: string;
};

//-----------------------------------------------------------------------------------------------
// ! Log
//-----------------------------------------------------------------------------------------------

declare type AllowedLogProperties = {
  url?: string;
  query?: string;
  augmentation?: Augmentation;
  [key: string]: any;
} | null;

declare type FreshpaintTrackEvent = {
  event: string;
  properties: {
    distinct_id: string;
    token: string;
    time: number;
    [key: string]: any;
  };
};

//-----------------------------------------------------------------------------------------------
// ! Helpers
//-----------------------------------------------------------------------------------------------

declare interface Window {
  INSIGHT_FORCE_DEBUG: boolean;
}

declare interface process {
  env: {
    DEBUG_AUGMENTATION_EVENT: boolean;
  };
}

declare interface Array<T> {
  findLastIndex(arg: (value: T, index: number, obj: T[]) => boolean): number;
}

//-----------------------------------------------------------------------------------------------
// ! Application
//-----------------------------------------------------------------------------------------------

declare type PublicationSlices = Record<string, Record<string, string[]>> &
  Record<'original', string[]>;

declare type NoteRecord = {
  id: string;
  note: string;
  slice?: string;
  key?: string;
  external?: boolean;
  date?: string;
  tags?: string[];
};

declare type Prefix = TPrefix[keyof TPrefix];

//-----------------------------------------------------------------------------------------------
// ! Helper
//-----------------------------------------------------------------------------------------------

declare const InstallTrigger:
  | {
      enabled: boolean;
    }
  | undefined;

declare type AnyRecord = Record<string, string | number>;
declare type AnyFunction = ({ ...args }: any) => any | void;
declare type AnyElement = HTMLElement & Element;
declare type AnyKey = Record<'key' | 'value' | 'label', string>;

declare type UIModule = React.ReactElement;

declare type KeyList<TKey> = readonly TKey[keyof TKey];

declare type KeyEventMap<TKey, TEvent = string | AnyFunction | AnyElement> = {
  [key: TKeyEvent<TKey, TEvent>]: ReturnType<TEvent>;
} & { [key: string]: any };

type TKeyEvent<TKey, TEvent> = TKeyEventMap[keyof TKeyEventMap<TKey, TEvent>];
type TKeyEventMap<TKey, TEvent> = Record<TKey, TEvent>;

declare type NullPrototype<
  T = any,
  U extends string | number | symbol = string | number | symbol,
  K extends string | number | symbol = (string | number | symbol) & U,
  OPK extends keyof Record<string, unknown> = keyof Record<string, unknown> & U,
> = { [P in K]?: T } & ({ [Q in keyof Record<string, unknown>]?: never } | { [R in OPK]?: T });

//-----------------------------------------------------------------------------------------------
// ! Modules
//-----------------------------------------------------------------------------------------------

declare module '*.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare type TSidebarLoader = typeof import('lib/sidebar').default;

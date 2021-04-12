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
  OPK extends keyof Object = keyof Object & U
> = { [P in K]?: T } & ({ [Q in keyof Object]?: never } | { [R in OPK]?: T });
/* eslint-enable @typescript-eslint/ban-types */

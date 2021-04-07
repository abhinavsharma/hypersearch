declare interface Window {
  INSIGHT_FORCE_DEBUG: boolean;
}

declare interface Array<T> {
  findLastIndex(arg: (value: T, index: number, obj: T[]) => boolean): number;
}

declare module './hideSerpResults' {
  type HideSerpResults = (
    nodes: HTMLElement[],
    selector: string,
    details: Record<'text' | 'header', string>,
    selectorString: string,
    augmentations?: Record<string, AugmentationObject[]>,
    preventHideOnClick?: boolean,
  ) => void;
}

export {};

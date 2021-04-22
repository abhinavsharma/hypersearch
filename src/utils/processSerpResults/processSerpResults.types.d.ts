declare module './processSerpResults' {
  type ProcessSerpResults = (
    nodes: Record<'block' | 'search', HTMLElement[]>,
    selector: string,
    details: Record<'text' | 'header', string>,
    selectorString: string,
    augmentations?: Record<string, Record<'block' | 'search', AugmentationObject[]>>,
    preventHideOnClick?: boolean,
  ) => void;
}

export {};

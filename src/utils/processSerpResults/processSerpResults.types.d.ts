declare module './processSerpResults' {
  type ProcessSerpResults = (
    nodes: HTMLElement[],
    selector: string,
    details: Record<'text' | 'header' | 'selectorString', string>,
    augmentations: Record<string, Record<'block' | 'search', AugmentationObject[]>> | string,
    createdUrls?: string[],
  ) => void;
}

export {};

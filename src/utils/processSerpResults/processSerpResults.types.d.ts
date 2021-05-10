declare module './processSerpResults' {
  type ProcessSerpResults = (
    nodes: HTMLElement[],
    selector: string,
    details: Record<'text' | 'header' | 'selectorString', string>,
    augmentations: Record<'block' | 'search', Record<string, AugmentationObject[]>> | string,
    createdUrls?: string[],
  ) => void;
}

export {};

declare module './processSerpResults' {
  type ProcessSerpResults = (
    nodes: HTMLElement[],
    selector: string,
    details: Record<'text' | 'header' | 'selectorString', string> & Record<'hoverAltered', boolean>,
    augmentations: Record<'block' | 'search', Record<string, AugmentationObject[]>> | string,
    createdUrls?: string[],
    processAsOpenPage?: boolean,
  ) => void;
}

export {};

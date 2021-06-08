declare module './processSerpResults' {
  type ProcessSerpResults = (
    nodes: HTMLElement[],
    selector: string,
    details: Record<'text' | 'header' | 'selectorString', string>,
    augmentations: Record<
      'block' | 'search' | 'feature',
      Record<string, AugmentationObject[]>
    > | null,
    createdUrls?: string[],
    processAsOpenPage?: boolean,
  ) => void;
}

export {};

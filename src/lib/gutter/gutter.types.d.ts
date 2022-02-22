declare type ProcessSerpResults = (
  nodes: HTMLElement[],
  selector: string,
  details: Record<'text' | 'header' | 'selectorString', string>,
  augmentations: Record<'block' | 'search' | 'feature', Record<string, Augmentation[]>> | null,
  createdUrls?: string[],
  processAsOpenPage?: boolean,
  processAsAdBlock?: boolean,
) => void;

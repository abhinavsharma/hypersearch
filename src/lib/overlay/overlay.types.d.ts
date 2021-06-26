declare type CreateResultOverlay = (
  serpResult: HTMLElement,
  blockingAugmentations: Augmentation[],
  details: Record<'text' | 'header' | 'selectorString', string>,
) => void;

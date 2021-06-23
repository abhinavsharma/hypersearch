declare type FlipSidebar = (
  document: Document,
  force: 'hide' | 'show',
  tabsLength: number,
  maxAvailableWidth: number,
  preventOverlay?: boolean,
) => void;

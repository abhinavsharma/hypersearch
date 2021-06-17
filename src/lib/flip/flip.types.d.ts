declare type FlipSidebar = (
  document: Document,
  force: 'hide' | 'show',
  loader: TSidebarLoader,
  preventOverlay?: boolean,
) => void;

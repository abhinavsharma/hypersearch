declare module './flipSidebar' {
  type FlipSidebar = (
    document: Document,
    force: 'hide' | 'show',
    tabsLength: number,
    preventOverlay?: boolean,
  ) => void;
}

export {};

declare module './keyEventTranslator' {
  type KeyEventTranslator = (e: KeyboardEvent, sidebarContainer: HTMLDivElement) => void;
}

export {};

declare module './hideSerpResults' {
  type HideSerpResults = (
    nodes: HTMLElement[],
    selector: string,
    details: Record<'text' | 'header', string>,
  ) => void;
}

export {};

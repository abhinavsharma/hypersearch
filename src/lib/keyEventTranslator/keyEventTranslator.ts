export const keyEventTranlator: KeyEventTranslator = (e, container) => {
  if (
    container.style.visibility === 'visible' &&
    (e.key === 'ArrowRight' || e.key === 'ArrowLeft')
  ) {
    const tabContainer = document.getElementById('lumos_sidebar_tabs');
    if (tabContainer) {
      let selectedChild: HTMLElement;
      let next: Element;
      let prev: Element;

      function triggerEvent(elem, event) {
        var clickEvent = new Event(event); // Create the event.
        elem.dispatchEvent(clickEvent); // Dispatch the event.
      }

      tabContainer.childNodes.forEach((child, i) => {
        const c = child as HTMLElement;
        if (c.style.backgroundColor == 'white') {
          selectedChild = c;
          prev = c.previousElementSibling
            ? c.previousElementSibling
            : tabContainer.lastElementChild;
          next = c.nextElementSibling ? c.nextElementSibling : tabContainer.firstElementChild;
        }
      });

      if (selectedChild && prev && next) {
        if (e.key === 'ArrowLeft') {
          triggerEvent(prev, 'click');
        } else if (e.key === 'ArrowRight') {
          triggerEvent(next, 'click');
        }
      }
    }
  }
};

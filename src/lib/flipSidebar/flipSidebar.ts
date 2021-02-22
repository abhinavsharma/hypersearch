export const flipSidebar: FlipSidebar = (outerDocument, force) => {
  const innerDocument = outerDocument.getElementById('sidebar-root-iframe') as HTMLIFrameElement;
  const document = innerDocument.contentWindow.document.documentElement;

  const sidebarContainer = document.getElementsByClassName(
    'insight-sidebar-container',
  )[0] as HTMLDivElement;

  const hideButton = document.getElementsByClassName(
    'insight-sidebar-close-button',
  )[0] as HTMLDivElement;

  const tabsContainer = document.getElementsByClassName(
    'insight-tab-container',
  )[0] as HTMLDivElement;

  const showButton = document.getElementsByClassName(
    'insight-sidebar-toggle-button',
  )[0] as HTMLDivElement;

  if (force === 'hide') {
    sidebarContainer.style.width = '0px';
    setTimeout(() => {
      tabsContainer.style.visibility = 'hidden';
      hideButton.style.visibility = 'hidden';
      outerDocument.getElementById('sidebar-root').setAttribute(
        'style',
        `
        width: 0;
      `,
      );
      outerDocument.getElementById('sidebar-root-iframe').setAttribute(
        'style',
        `
        position: fixed;
        width: 150px;
        min-height: 100px;
        height: 150px;
        top: auto;
        right: 0;
        background: transparent;
    `,
      );
      showButton.style.visibility = 'visible';
      showButton.style.display = 'flex';
    }, 500);
  } else {
    sidebarContainer.style.visibility = 'visible';
    showButton.style.visibility = 'hidden';
    hideButton.style.visibility = 'visible';
    sidebarContainer.style.width = '450px';
    tabsContainer.style.visibility = 'visible';
    outerDocument.getElementById('sidebar-root').setAttribute(
      'style',
      `
      width: 465px;
      transition-property: width;
      transition-duration: 0.5s;
      transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
  `,
    );
    outerDocument.getElementById('sidebar-root-iframe').setAttribute(
      'style',
      `
      position: fixed;
      display: block !important;
      right: 0;
      top: 0;
      bottom: 0;
      width: 465px;
      height: 100%;
      background: transparent;
      border-width: 0 !important;
      transition-property: width;
      transition-duration: 0.5s;
      transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
      z-index: 9999;
    `,
    );
  }
};

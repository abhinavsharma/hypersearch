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

  const contentContainer = document.getElementsByClassName('insight-full-tab')[0] as HTMLDivElement;

  const showButton = document.getElementsByClassName(
    'insight-sidebar-toggle-button',
  )[0] as HTMLDivElement;

  if (force === 'hide') {
    if (tabsContainer && contentContainer) {
      tabsContainer.style.visibility = 'hidden';
      contentContainer.style.visibility = 'hidden';
    }
    sidebarContainer.style.visibility = 'hidden';
    showButton.style.visibility = 'visible';
    showButton.style.display = 'flex';
    hideButton.style.visibility = 'hidden';
    sidebarContainer.style.width = '0px';
    outerDocument.getElementById('sidebar-root-iframe').setAttribute(
      'style',
      `
      position: fixed;
      width: 150px;
      min-height: 100px;
      height: 250px;
      top: auto;
      right: 0;
      bottom: 30px;
      z-index: 9997 !important;
    `,
    );
  } else {
    sidebarContainer.style.visibility = 'visible';
    showButton.style.visibility = 'hidden';
    hideButton.style.visibility = 'visible';
    sidebarContainer.style.width = '450px';
    tabsContainer.style.visibility = 'visible';
    contentContainer.style.visibility = 'visible';
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
      background: white;
      transition-property: all;
      transition-duration: 0.5s;
      transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
      border-width: 0 !important;
      z-index: 9999;
    `,
    );
  }
};

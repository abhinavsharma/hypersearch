export const expandSidebar = () => {
  const sidebarRoot = document.getElementById('sidebar-root') as HTMLDivElement;
  const sidebarRootIframe = document.getElementById('sidebar-root-iframe') as HTMLIFrameElement;
  const frameDocument = sidebarRootIframe.contentWindow.document;
  const sidebarContainer = frameDocument.getElementById(
    'insight-sidebar-container',
  ) as HTMLDivElement;
  const closeButton = frameDocument.getElementById('insight-sidebar-close-button');
  const sidebarTitle = frameDocument.getElementById('insight-sidebar-title');
  const tabFrames = Array.from(frameDocument.getElementsByClassName('insight-tab-iframe'));

  document.documentElement.style.overflow = 'hidden';

  sidebarRoot.classList.add('expanded');
  sidebarRoot.setAttribute(
    'style',
    `
    position: fixed;
    display: flex !important;
    width: 100% !important;
    justify-content: center;
    transition-property: width;
    transition-duration: 0.5s;
    transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
    z-index: 9999;
  `,
  );

  sidebarRootIframe.classList.add('expanded');
  sidebarRootIframe.setAttribute(
    'style',
    `
    position: fixed;
    display: flex;
    margin: 0 auto;
    width: 100%;
    height: 100%;
    right: 0;
    left: 0;
    top: 0;
    bottom: 0;
    background: grey;
  `,
  );

  sidebarContainer.classList.add('expanded');
  sidebarContainer.setAttribute(
    'style',
    `
    position: static;
    margin: 0 auto;
    width: 100%;
  `,
  );

  closeButton.style.display = 'none';
  closeButton.style.visibility = 'hidden';
  sidebarTitle.style.display = 'none';
  sidebarTitle.style.visibility = 'hidden';

  tabFrames.forEach((frame) => frame.classList.add('expanded'));
};

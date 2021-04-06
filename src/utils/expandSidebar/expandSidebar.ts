import { flipSidebar } from 'utils';

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

  if (!sidebarRoot.classList.contains('expanded')) {
    if (sidebarContainer.style.width === '0px') {
      flipSidebar(document, 'show', 1);
    }
    document.documentElement.style.overflow = 'hidden';
    sidebarRoot.classList.add('expanded');
    sidebarRoot.setAttribute(
      'style',
      `
      position: fixed;
      border: 0;
      right: 0;
      top: 0;
      display: flex !important;
      width: 100% !important;
      outline: 0;
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
      border: 0;
      display: flex;
      margin: 0;
      width: 100%;
      height: 100%;
      right: 0;
      top: 0;
      outline: 0;
      transition-property: width;
      transition-duration: 0.5s;
      transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
    `,
    );
    sidebarContainer.classList.add('expanded');
    sidebarContainer.setAttribute(
      'style',
      `
      position: fixed;
      border: 0;
      margin: 0;
      right: 0;
      width: 100%;
      outline: 0;
      transition-property: width;
      transition-duration: 0.5s;
      transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
    `,
    );
    closeButton.style.display = 'none';
    closeButton.style.visibility = 'hidden';
    sidebarTitle.style.display = 'none';
    sidebarTitle.style.visibility = 'hidden';
    tabFrames.forEach((frame) => frame.classList.add('expanded'));
  } else {
    sidebarRoot.classList.remove('expanded');
    sidebarRootIframe.classList.remove('expanded');
    sidebarContainer.classList.remove('expanded');
    document.documentElement.style.overflow = 'auto';
    closeButton.style.display = 'flex';
    closeButton.style.visibility = 'visible';
    sidebarTitle.style.display = 'block';
    sidebarTitle.style.visibility = 'visible';
    sidebarContainer.setAttribute(
      'style',
      `
      background: white;
      position: fixed;
      top: 0;
      bottom: 0;
      right: 0;
      width: 480px;
    `,
    );
    flipSidebar(document, 'show', 1);
  }
};

import { flipSidebar } from 'utils';

export const expandSidebar = (tabsNum: number) => {
  const sidebarRoot = document.getElementById('sidebar-root') as HTMLDivElement;
  const sidebarRootIframe = document.getElementById('sidebar-root-iframe') as HTMLIFrameElement;
  const frameDocument = sidebarRootIframe?.contentWindow?.document;

  if (!frameDocument) return;

  const sidebarContainer = frameDocument.getElementById(
    'insight-sidebar-container',
  ) as HTMLDivElement;
  const tabFrames = Array.from(frameDocument.getElementsByClassName('insight-tab-iframe'));

  if (!sidebarRoot.classList.contains('insight-expanded')) {
    flipSidebar(document, 'show', tabsNum);
    document.documentElement.style.overflow = 'hidden';
    sidebarRoot.classList.add('insight-expanded');
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
    sidebarRootIframe.classList.add('insight-expanded');
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
    sidebarContainer.classList.add('insight-expanded');
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
    tabFrames.forEach((frame) => frame.classList.add('insight-expanded'));
  } else {
    sidebarRoot.classList.remove('insight-expanded');
    sidebarRootIframe.classList.remove('insight-expanded');
    sidebarContainer.classList.remove('insight-expanded');
    document.documentElement.style.overflow = 'auto';
    sidebarContainer.setAttribute(
      'style',
      `
      background: white;
      position: fixed;
      top: 0;
      bottom: 0;
      right: 0;
      width: 450px;
    `,
    );
    tabFrames.forEach((frame) => frame.classList.remove('insight-expanded'));
    flipSidebar(document, 'show', tabsNum);
  }
};

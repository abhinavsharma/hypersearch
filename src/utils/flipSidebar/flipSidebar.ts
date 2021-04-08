import { SIDEBAR_Z_INDEX } from 'utils/constants';

export const flipSidebar: FlipSidebar = (outerDocument, force, tabsLength) => {
  const innerDocument = outerDocument.getElementById('sidebar-root-iframe') as HTMLIFrameElement;
  const document = innerDocument.contentWindow.document;

  const sidebarContainer = document.getElementById('insight-sidebar-container');

  const nameNub = document.getElementById('insight-sidebar-title') as HTMLDivElement;

  const tabsContainer = document.getElementsByClassName(
    'insight-tab-container',
  )[0] as HTMLDivElement;

  const showButton = document.getElementsByClassName(
    'insight-sidebar-toggle-button',
  )[0] as HTMLDivElement;

  const hideButton = document.getElementById('insight-sidebar-close-button') as HTMLDivElement;

  const activeAugmentationHeader = document.getElementsByClassName(
    'add-augmentation-tab-header',
  )[0] as HTMLDivElement;

  if (!showButton || innerDocument.classList.contains('insight-expanded')) return;

  if (force === 'hide') {
    sidebarContainer.style.width = '0px';
    nameNub.setAttribute('style', 'right: 0;');
    if (activeAugmentationHeader) {
      activeAugmentationHeader.style.display = 'none';
    }
    // We need the timeout to ensure the proper animation
    setTimeout(() => {
      tabsContainer.style.visibility = 'hidden';
      outerDocument.getElementById('sidebar-root').setAttribute(
        'style',
        `
        width: 0;
      `,
      );
      showButton.setAttribute(
        'style',
        `
        position: absolute;
        width: ${tabsLength === 0 ? '200px' : '150px'} !important;
      `,
      );
      hideButton.style.visibility = 'hidden';
      outerDocument.getElementById('sidebar-root-iframe').setAttribute(
        'style',
        `
        position: fixed;
        height: ${tabsLength === 0 ? ' 200px' : tabsLength * 30 + 150 + 'px'};
        border-width: 0 !important;
        width: 250px;
        top: auto;
        right: 0;
        bottom: 0;
        background: transparent;
        z-index: ${SIDEBAR_Z_INDEX};
    `,
      );
      nameNub.setAttribute('style', 'display: none;');
      showButton.style.visibility = 'visible';
      showButton.style.display = 'flex';
      showButton.style.flexDirection = 'column';
    }, 500);
  } else {
    sidebarContainer.style.visibility = 'visible';
    showButton.style.visibility = 'hidden';
    nameNub.style.display = 'visible';
    nameNub.setAttribute('style', 'right: 450px;');
    hideButton.style.visibility = 'visible';
    sidebarContainer.style.width = '450px';
    tabsContainer.style.visibility = 'visible';
    outerDocument.getElementById('sidebar-root').setAttribute(
      'style',
      `
      display: block;
      width: 480px;
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
      width: 480px;
      min-height: 200px;
      height: 100%;
      background: transparent;
      border-width: 0 !important;
      transition-property: width;
      transition-duration: 0.5s;
      transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
      z-index: ${SIDEBAR_Z_INDEX};
    `,
    );
    // We need the timeout to ensure the proper animation
    setTimeout(() => {
      if (activeAugmentationHeader) {
        activeAugmentationHeader.style.left = '20px';
        activeAugmentationHeader.style.display = 'flex';
      }
    }, 300);
  }
};

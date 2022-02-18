import { SIDEBAR_TAB_FAKE_URL, SIDEBAR_Z_INDEX } from 'constant';
import { isDark } from 'lib/helpers';
import variables from 'styles/variables.scss';

let animationTimeout: any = -1;

export const flipSidebar: FlipSidebar = (outerDocument, force, loader, preventOverlay) => {
  const maxAvailableWidth = loader.maxAvailableSpace;
  const tabsLength = loader.sidebarTabs.filter(
    ({ url }) => url.href !== SIDEBAR_TAB_FAKE_URL,
  ).length;

  const availableWidth = Number(
    maxAvailableWidth > Number(variables.sidebarMaxWidth.slice(0, -2))
      ? maxAvailableWidth
      : variables.sidebarMaxWidth.slice(0, -2),
  );
  const actualWidth = Number(
    availableWidth > Number(variables.sidebarStretchedMaxWidth.slice(0, -2))
      ? variables.sidebarStretchedMaxWidth.slice(0, -2)
      : availableWidth,
  );

  const innerDocument = outerDocument.getElementById('sidebar-root-iframe') as HTMLIFrameElement;
  const document = innerDocument?.contentWindow?.document;

  if (!document) return;

  const sidebarContainer = document.getElementById('insight-sidebar-container');

  const existingOverlay = document.getElementById('sidebar-overlay');
  const sidebarOverlay = existingOverlay || document.createElement('div');
  if (!preventOverlay) {
    sidebarOverlay.id = 'sidebar-overlay';
    sidebarOverlay.setAttribute(
      'style',
      `
        z-index: ${SIDEBAR_Z_INDEX + 3};
        background: ${isDark() ? '#1b1e1f' : '#F9F9F9'};
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        opacity: 1;
        transition: opacity 250ms ease-out;
        width: ${actualWidth - 30}px;
      `,
    );

    if (force === 'hide') {
      sidebarOverlay.style.left = '0px';
    }
  }

  if (!sidebarContainer) return null;

  sidebarContainer.appendChild(sidebarOverlay);

  const tabsContainer = document.getElementsByClassName(
    'insight-tab-container',
  )[0] as HTMLDivElement;

  const showButton = (document.getElementsByClassName('insight-sidebar-toggle-button')[0] ??
    document.createElement('div')) as HTMLDivElement;

  const ratingButton = (document.getElementsByClassName(
    'insight-sidebar-publication-rating-nub',
  )[0] ?? document.createElement('div')) as HTMLDivElement;

  if (innerDocument.classList.contains('insight-expanded')) return;

  const sidebarRootIframe = outerDocument.getElementById('sidebar-root-iframe');
  if (sidebarRootIframe) {
    sidebarRootIframe.style.boxShadow = '';
  }

  clearTimeout(animationTimeout);
  if (force === 'hide') {
    sidebarContainer.style.width = '0px';
    // We need the timeout to ensure the proper animation
    animationTimeout = setTimeout(() => {
      tabsContainer.style.visibility = 'hidden';
      outerDocument.getElementById('sidebar-root')?.setAttribute(
        'style',
        `
        height: ${loader.showPublicationRating ? 130 : 0}px;
        width: ${loader.showPublicationRating ? 200 : 0}px;
      `,
      );
      showButton.setAttribute(
        'style',
        `
        position: absolute;
        width: ${tabsLength === 0 ? '200px' : '150px'} !important;
      `,
      );
      outerDocument.getElementById('sidebar-root-iframe')?.setAttribute(
        'style',
        `
        position: fixed;
        min-height: ${tabsLength === 0 ? (!loader.showPublicationRating ? '0' : '120px') : '120px'};
        height: ${
          loader.showPublicationRating ? '150' : showButton.getAttribute('data-height') ?? '0'
        }px;
        width: ${tabsLength === 0 ? (!loader.showPublicationRating ? '0' : '350px') : '160px'};
        border-width: 0 !important;
        top: auto;
        right: 0;
        bottom: 0;
        background: transparent;
        z-index: ${SIDEBAR_Z_INDEX};
    `,
      );
      showButton.style.visibility = 'visible';
      showButton.style.display = 'flex';
      ratingButton.style.visibility = 'visible';
      ratingButton.style.display = 'flex';
      showButton.style.flexDirection = 'row';
      if (!preventOverlay) {
        sidebarOverlay.style.opacity = '0';
        animationTimeout = setTimeout(() => {
          sidebarOverlay.parentElement?.removeChild(sidebarOverlay);
        }, 150);
      }
    }, 500);
  } else {
    const sidebarWidth = actualWidth - 30;

    sidebarContainer.style.visibility = 'visible';
    showButton.style.display = 'none';
    showButton.style.visibility = 'hidden';
    ratingButton.style.display = 'none';
    ratingButton.style.visibility = 'hidden';
    sidebarContainer.style.width = `${sidebarWidth}px`;
    sidebarContainer.style.maxWidth = `${variables.sidebarStretchedMaxWidth}`;
    tabsContainer.style.visibility = 'visible';
    outerDocument.getElementById('sidebar-root')?.setAttribute(
      'style',
      `
          display: block;
          width: ${sidebarWidth}px;
          max-width: ${variables.sidebarStretchedMaxWidth};
          transition-property: width;
          transition-duration: 0.5s;
          transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
      `,
    );
    outerDocument.getElementById('sidebar-root-iframe')?.setAttribute(
      'style',
      `
        position: fixed;
        display: block !important;
        right: 0;
        top: 0;
        bottom: 0;
        width: ${sidebarWidth}px;
        max-width: ${variables.sidebarStretchedMaxWidth};
        min-height: 200px;
        height: 100%;
        background: transparent;
        border-width: 0 !important;
        transition-property: width;
        transition-duration: 0.5s;
        transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
        z-index: ${SIDEBAR_Z_INDEX};
        box-shadow: -1px -1px 6px 1px rgb(0 0 0 / 20%);
      `,
    );

    // We need the timeout to ensure the proper animation
    animationTimeout = setTimeout(() => {
      if (!preventOverlay) {
        animationTimeout = setTimeout(() => {
          sidebarOverlay.style.opacity = '0';
          animationTimeout = setTimeout(() => {
            sidebarOverlay.parentElement?.removeChild(sidebarOverlay);
          }, 250);
        }, 350);
      } else if (sidebarOverlay) {
        sidebarOverlay.style.opacity = '0';
        sidebarOverlay.parentElement?.removeChild(sidebarOverlay);
      }
    }, 300);
  }
};

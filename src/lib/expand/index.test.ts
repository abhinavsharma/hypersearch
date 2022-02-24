import React, { ReactElement } from "react";
import { render } from 'react-dom';
import { expandSidebar } from ".";
import { Sidebar } from 'modules/sidebar';
import SidebarLoader from 'lib/sidebar';

function reactInjector(el: HTMLElement, reactEl: ReactElement, frameId: string) {
  const iframe = document.createElement('iframe');
  iframe.id = frameId;
  el.appendChild(iframe);
  const injector = () => {
    const doc = iframe.contentWindow?.document;
    if (!doc) {
      return null;
    }
    const link = doc.createElement('link');
    link.setAttribute('type', 'text/css');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', chrome.runtime.getURL('bundle.css'));
    doc.head.appendChild(link);
    doc.body.id = 'insight-sidebar';
    doc.documentElement.setAttribute('style', 'overflow: hidden;');
    const div = document.createElement('div');
    const root = doc.body.appendChild(div);
    render(reactEl, root);
  };
  // Firefox is a special case, we need to set IFrame source to make it work.
  // Here we add an empty HTML file as source, so the browser won't complain.
  if (navigator.userAgent.search('Firefox') > -1) {
    iframe.src = chrome.runtime.getURL('index.html');
    iframe.onload = () => injector();
  } else {
    injector();
  }
}

describe('Expand tests', () => {

  beforeEach(() => {
    (global.matchMedia as any) = () => false;

    SidebarLoader.url = new URL('https://www.google.com/');

    const wrapper = document.createElement('div');
    wrapper.id = 'sidebar-root';
    wrapper.style.display = 'none';
    document.body.appendChild(wrapper);
    const sidebarInit = React.createElement(Sidebar);
    reactInjector(wrapper, sidebarInit, 'sidebar-root-iframe');
  });

  afterEach(() => {
    const sidebarRoot = document.getElementById('sidebar-root') as HTMLDivElement;
    sidebarRoot.remove();
  });

  test('expand should add expanded class', async () => {
    // Given
    const sidebarRoot = document.getElementById('sidebar-root') as HTMLDivElement;
    const sidebarRootIframe = document.getElementById('sidebar-root-iframe') as HTMLIFrameElement;
    const sidebarContainer = sidebarRootIframe!
      .contentWindow!.document.getElementById('insight-sidebar-container') as HTMLDivElement;

    document.documentElement.style.overflow = 'none';

    expect(sidebarRoot.classList.contains('insight-expanded')).toBe(false);
    expect(sidebarRootIframe.classList.contains('insight-expanded')).toBe(false);
    expect(sidebarContainer.classList.contains('insight-expanded')).toBe(false);

    // When
    expandSidebar(SidebarLoader);

    // Then
    expect(sidebarRoot.classList.contains('insight-expanded')).toBe(true);
    expect(sidebarRootIframe.classList.contains('insight-expanded')).toBe(true);
    expect(sidebarContainer.classList.contains('insight-expanded')).toBe(true);
    expect(document.documentElement.style.overflow).toBe('hidden');
  });

  test('expand again should hide it', async () => {
    // Given
    const sidebarRoot = document.getElementById('sidebar-root') as HTMLDivElement;
    const sidebarRootIframe = document.getElementById('sidebar-root-iframe') as HTMLIFrameElement;
    const sidebarContainer = sidebarRootIframe!
      .contentWindow!.document.getElementById('insight-sidebar-container') as HTMLDivElement;

    expandSidebar(SidebarLoader);

    expect(sidebarRoot.classList.contains('insight-expanded')).toBe(true);
    expect(sidebarRootIframe.classList.contains('insight-expanded')).toBe(true);
    expect(sidebarContainer.classList.contains('insight-expanded')).toBe(true);

    // When
    expandSidebar(SidebarLoader);

    // Then
    expect(sidebarRoot.classList.contains('insight-expanded')).toBe(false);
    expect(sidebarRootIframe.classList.contains('insight-expanded')).toBe(false);
    expect(sidebarContainer.classList.contains('insight-expanded')).toBe(false);
    expect(document.documentElement.style.overflow).toBe('auto');
  });

})

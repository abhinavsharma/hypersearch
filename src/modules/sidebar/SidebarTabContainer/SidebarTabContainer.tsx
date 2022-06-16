import React, { useEffect, useRef, useState } from 'react';
import Spin from 'antd/lib/spin';
import SidebarLoader from 'lib/sidebar';
import Skeleton from 'antd/lib/skeleton';
import { debug, decodeSpace, triggerSerpProcessing } from 'lib/helpers';
import { keyboardHandler, keyUpHandler } from 'lib/keyboard';
import {
  EXTENSION_SERP_FILTER_LOADED,
  SIDEBAR_TAB_FAKE_URL,
  URL_PARAM_TAB_TITLE_KEY,
  EXTERNAL_PDF_RENDERER_URL,
} from 'constant';
import 'antd/lib/skeleton/style/index.css';
import 'antd/lib/spin/style/index.css';

export const SidebarTabContainer: SidebarTabContainer = ({ tab, isSelected, index }) => {
  const [loadedTab, setLoadedTab] = useState<SidebarTab | null>(null);
  const [canLoad, setCanLoad] = useState(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const handleKeyDown = (event: KeyboardEvent) => keyboardHandler(event, SidebarLoader);
  const handleKeyUp = (event: KeyboardEvent) => keyUpHandler(event);

  useEffect(() => {
    isSelected && setCanLoad(true);
  }, [isSelected]);

  useEffect(() => {
    if (loadedTab === null || tab.augmentation.id !== loadedTab.augmentation.id) {
      setLoadedTab(loadedTab);
      setIsLoaded(false);
    }
  }, [tab]);

  useEffect(() => {
    const { current: frame } = frameRef;

    frame?.contentWindow?.addEventListener('keydown', handleKeyDown);
    frame?.contentWindow?.addEventListener('keyup', handleKeyUp);
    return () => {
      frame?.contentWindow?.removeEventListener('keydown', handleKeyDown);
      frame?.contentWindow?.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleLoad = () => {
    debug('--> Test: tab loaded', 'index:', index, SidebarLoader.time())

    setTimeout(() => setIsLoaded(true), 100);
    triggerSerpProcessing(SidebarLoader, true);
    SidebarLoader.sendLogMessage(EXTENSION_SERP_FILTER_LOADED, {
      query: SidebarLoader.query,
      filter_name: tab.augmentation.name,
      domains_to_search: SidebarLoader.domainsToSearch[tab.augmentation.id],
    });
  };

  const handleError = () => setIsLoaded(true);

  const OVERLAY_STYLE = {
    height: containerRef?.current?.clientHeight
      ? `${containerRef?.current?.clientHeight}px`
      : '100%',
  };

  if (tab.url.href === SIDEBAR_TAB_FAKE_URL) {
    return null;
  }

  return (
    <div ref={containerRef} className="insight-tab-iframe-container">
      <div className={ `insight-tab-loader${ isLoaded ? ' insight-loader-hide' : '' }` }>
        <Spin size="large" />
      </div>
      {canLoad && <iframe
        key={decodeSpace(tab.url.href)}
        ref={frameRef}
        style={{ opacity: isLoaded ? 1 : 0 }}
        sandbox="allow-forms allow-presentation allow-scripts allow-same-origin allow-popups"
        src={
          tab.url.pathname?.match(/\.pdf$/)
            ? EXTERNAL_PDF_RENDERER_URL.replace('<placeholder>', decodeSpace(tab.url.href))
            : decodeSpace(tab.url.href)
        }
        className="insight-tab-iframe"
        onError={handleError}
        onLoad={handleLoad}
      />}
      {!isLoaded && tab.url.searchParams?.get(URL_PARAM_TAB_TITLE_KEY) && (
        <div className="insight-frame-overlay" ref={overlayRef} style={OVERLAY_STYLE}>
          {Array(Math.trunc(window.innerHeight / 120))
            .fill(null)
            .map((_, i) => (
              <Skeleton active key={i} />
            ))}
        </div>
      )}
    </div>
  );
};

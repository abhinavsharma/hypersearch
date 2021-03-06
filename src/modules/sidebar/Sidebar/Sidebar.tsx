/**
 * @module modules:sidebar
 * @version 1.0.0
 * @license (C) Insight
 */

import React, { useCallback, useEffect, useState } from 'react';
import md5 from 'md5';
import { useDebouncedFn } from 'beautiful-react-hooks';
import UserManager from 'lib/user';
import SidebarLoader from 'lib/sidebar';
import AugmentationManager from 'lib/augmentations';
import { flipSidebar } from 'lib/flip';
import { debug, getFirstValidTabIndex, isKnowledgePage, triggerSerpProcessing } from 'lib/helpers';
import { SidebarTabs, SidebarToggleButton } from 'modules/sidebar';
import {
  DISABLE_SUGGESTED_AUGMENTATION,
  EXTENSION_AUTO_EXPAND,
  POST_TAB_UPDATE_MESSAGE,
  SIDEBAR_TAB_FAKE_URL,
  TOGGLE_BLOCKED_DOMAIN_MESSAGE,
  TOGGLE_TRUSTED_DOMAIN_MESSAGE,
  UPDATE_SIDEBAR_TABS_MESSAGE,
  WINDOW_REQUIRED_MIN_WIDTH,
} from 'constant';
import './Sidebar.scss';

//-----------------------------------------------------------------------------------------------
// ! Component
//-----------------------------------------------------------------------------------------------
export const Sidebar: Sidebar = () => {
  const [sidebarTabs, setSidebarTabs] = useState<SidebarTab[]>(SidebarLoader.sidebarTabs);
  const [activeKey, setActiveKey] = useState<string>(
    getFirstValidTabIndex(SidebarLoader.sidebarTabs),
  );

  //-----------------------------------------------------------------------------------------------
  // ! Handlers
  //-----------------------------------------------------------------------------------------------
  const firstValidTab = getFirstValidTabIndex(SidebarLoader.sidebarTabs);
  const isSmallWidth = window.innerWidth <= WINDOW_REQUIRED_MIN_WIDTH;
  const isTabsLength = firstValidTab !== '0';
  const isKpPage = isKnowledgePage(document);
  const validTabsLength = SidebarLoader.sidebarTabs.filter(
    ({ url }) => url.href !== SIDEBAR_TAB_FAKE_URL,
  ).length;

  const shouldPreventExpand =
    !new URL(window.location.href).searchParams.get('auth_email') &&
    !SidebarLoader.tourStep &&
    (isSmallWidth || !isTabsLength || isKpPage || SidebarLoader.preventAutoExpand);

  const handleResize = useDebouncedFn(() => {
    if (SidebarLoader.isPreview || !shouldPreventExpand) {
      flipSidebar(document, 'show', SidebarLoader);
    }
  }, 300);

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    debug('--> Test: sidebar', 'shouldPreventExpand:', shouldPreventExpand, SidebarLoader.time())

    if (shouldPreventExpand) {
      if (!SidebarLoader.isPreview) {
        flipSidebar(document, 'hide', SidebarLoader);
      }
    } else {
      flipSidebar(document, 'show', SidebarLoader, SidebarLoader.isPreview);
      SidebarLoader.isPreview ??= true;
    }

    SidebarLoader.sendLogMessage(EXTENSION_AUTO_EXPAND, {
      url: SidebarLoader.url.href,
      subtabs: UserManager.user.privacy
        ? SidebarLoader.sidebarTabs.map(({ url }) => md5(url.href))
        : SidebarLoader.sidebarTabs.map(({ augmentation: { name } }) => name),
      details: {
        isKpPage,
        firstValidTabIndex: `${firstValidTab} / ${validTabsLength}`,
        isExpanded: !shouldPreventExpand,
        isSerp: SidebarLoader.isSerp,
        isTour: !!SidebarLoader.tourStep,
        preventAutoExpand: SidebarLoader.preventAutoExpand,
        screenWidth: `${window.innerWidth}px`,
      },
    });

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize, firstValidTab, isKpPage, shouldPreventExpand, validTabsLength]);

  const refreshTabs = useCallback(() => {
    let isMounted = true;

    SidebarLoader.getTabsAndAugmentations()
      .then((newTabs) => {
        isMounted && setSidebarTabs(newTabs);
      });

    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    chrome.runtime.onMessage.addListener((msg) => {
      switch (msg.type) {
        case UPDATE_SIDEBAR_TABS_MESSAGE:
          refreshTabs();
          triggerSerpProcessing(SidebarLoader);
          setTimeout(() => chrome.runtime.sendMessage({ type: POST_TAB_UPDATE_MESSAGE }), 300);
          break;
        case DISABLE_SUGGESTED_AUGMENTATION:
          AugmentationManager.disableSuggestedAugmentation(msg.augmentation);
          break;
        case TOGGLE_BLOCKED_DOMAIN_MESSAGE:
          (async () => {
            !msg.isBlocked
              ? await AugmentationManager.updateBlockList(msg.publication)
              : await AugmentationManager.deleteFromBlockList(msg.publication);
          })();
          break;
        case TOGGLE_TRUSTED_DOMAIN_MESSAGE:
          (async () => await AugmentationManager.toggleTrustlist(msg.publication))();
          break;
        default:
          break;
      }
    });
  }, [refreshTabs]);

  const tabsLength = !!sidebarTabs.filter(({ url }) => url?.href !== SIDEBAR_TAB_FAKE_URL).length;
  const shouldShowButton = !!tabsLength || !SidebarLoader.isSerp;

  //-----------------------------------------------------------------------------------------------
  // ! Render
  //-----------------------------------------------------------------------------------------------
  return (
    <>
      <div id="insight-sidebar-container" className="insight-full-size-fixed">
        <SidebarTabs tabs={sidebarTabs} activeKey={activeKey} setActiveKey={setActiveKey} />
      </div>
      {shouldShowButton && <SidebarToggleButton tabs={sidebarTabs} />}
    </>
  );
};

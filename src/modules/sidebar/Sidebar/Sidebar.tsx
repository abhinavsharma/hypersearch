/**
 * @module Sidebar
 * @author Matyas Angyal<matyas@laso.ai>
 * @license (C) Insight
 * @version 1.0.0
 */
import React, { useEffect, useState } from 'react';
import md5 from 'md5';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import AugmentationManager from 'lib/AugmentationManager/AugmentationManager';
import { flipSidebar } from 'utils/flipSidebar/flipSidebar';
import { getFirstValidTabIndex, isKnowledgePage, triggerSerpProcessing } from 'utils/helpers';
import { SidebarTabs, SidebarToggleButton } from 'modules/sidebar';
import {
  DISABLE_SUGGESTED_AUGMENTATION,
  EXTENSION_AUTO_EXPAND,
  HIDE_TAB_FAKE_URL,
  TOGGLE_BLOCKED_DOMAIN_MESSAGE,
  TOGGLE_TRUSTED_DOMAIN_MESSAGE,
  UPDATE_SIDEBAR_TABS_MESSAGE,
  WINDOW_REQUIRED_MIN_WIDTH,
} from 'utils/constants';
import './Sidebar.scss';
import { useDebouncedFn } from 'beautiful-react-hooks';

const Sidebar: Sidebar = () => {
  const [sidebarTabs, setSidebarTabs] = useState<SidebarTab[]>(SidebarLoader.sidebarTabs);
  const [activeKey, setActiveKey] = useState<string>(
    getFirstValidTabIndex(SidebarLoader.sidebarTabs),
  );

  const firstValidTab = getFirstValidTabIndex(SidebarLoader.sidebarTabs);
  const isSmallWidth = window.innerWidth <= WINDOW_REQUIRED_MIN_WIDTH;
  const isTabsLength = firstValidTab !== '0';
  const isSearchTabs = SidebarLoader.sidebarTabs?.find(({ isCse }) => isCse);
  const isKpPage = isKnowledgePage(document);
  const validTabsLength = SidebarLoader.sidebarTabs.filter(
    ({ url }) => url.href !== HIDE_TAB_FAKE_URL,
  ).length;

  const shouldPreventExpand =
    !SidebarLoader.tourStep &&
    (isSmallWidth || !isTabsLength || !isSearchTabs || isKpPage || SidebarLoader.preventAutoExpand);

  const handleResize = useDebouncedFn(() => {
    if (SidebarLoader.isPreview || !shouldPreventExpand) {
      flipSidebar(document, 'show', validTabsLength, SidebarLoader.maxAvailableSpace);
    }
  }, 300);

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    if (shouldPreventExpand && !SidebarLoader.isPreview) {
      flipSidebar(document, 'hide', validTabsLength, SidebarLoader.maxAvailableSpace, true);
    } else {
      SidebarLoader.isPreview = true;
      flipSidebar(document, 'show', validTabsLength, SidebarLoader.maxAvailableSpace, true);
    }

    SidebarLoader.sendLogMessage(EXTENSION_AUTO_EXPAND, {
      url: SidebarLoader.url.href,
      subtabs: SidebarLoader.strongPrivacy
        ? SidebarLoader.sidebarTabs.map(({ url }) => md5(url.href))
        : SidebarLoader.sidebarTabs.map(({ title }) => title),
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

  useEffect(() => {
    chrome.runtime.onMessage.addListener((msg) => {
      switch (msg.type) {
        case UPDATE_SIDEBAR_TABS_MESSAGE:
          setSidebarTabs(SidebarLoader.getTabsAndAugmentations());
          triggerSerpProcessing(SidebarLoader);
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
  }, []);

  const tabsLength = !!sidebarTabs.filter(({ url }) => url?.href !== HIDE_TAB_FAKE_URL).length;

  return (
    <>
      <div id="insight-sidebar-container" className="insight-full-size-fixed">
        <SidebarTabs tabs={sidebarTabs} activeKey={activeKey} setActiveKey={setActiveKey} />
      </div>
      {tabsLength && <SidebarToggleButton tabs={sidebarTabs} />}
    </>
  );
};

export { Sidebar };

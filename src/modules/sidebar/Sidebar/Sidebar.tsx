/**
 * @module Sidebar
 * @author Matyas Angyal<matyas@laso.ai>
 * @license (C) Insight
 * @version 1.0.0
 */
import React, { useEffect, useState } from 'react';
import md5 from 'md5';
import SidebarLoader from 'lib/sidebar';
import AugmentationManager from 'lib/augmentations';
import { flipSidebar } from 'lib/flip';
import { getFirstValidTabIndex, isKnowledgePage, triggerSerpProcessing } from 'lib/helpers';
import { SidebarTabs, SidebarToggleButton } from 'modules/sidebar';
import {
  DISABLE_SUGGESTED_AUGMENTATION,
  EXTENSION_AUTO_EXPAND,
  SIDEBAR_TAB_FAKE_URL,
  TOGGLE_BLOCKED_DOMAIN_MESSAGE,
  TOGGLE_TRUSTED_DOMAIN_MESSAGE,
  UPDATE_SIDEBAR_TABS_MESSAGE,
  WINDOW_REQUIRED_MIN_WIDTH,
} from 'constant';
import './Sidebar.scss';
import { useDebouncedFn } from 'beautiful-react-hooks';
import UserManager from 'lib/user';

const Sidebar: Sidebar = () => {
  const [sidebarTabs, setSidebarTabs] = useState<SidebarTab[]>(SidebarLoader.sidebarTabs);
  const [activeKey, setActiveKey] = useState<string>(
    getFirstValidTabIndex(SidebarLoader.sidebarTabs),
  );

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
      flipSidebar(document, 'show', validTabsLength, SidebarLoader.maxAvailableSpace);
    }
  }, 300);

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    if (shouldPreventExpand && !SidebarLoader.isPreview) {
      flipSidebar(document, 'hide', validTabsLength, SidebarLoader.maxAvailableSpace, true);
    } else {
      flipSidebar(
        document,
        'show',
        validTabsLength,
        SidebarLoader.maxAvailableSpace,
        SidebarLoader.isPreview,
      );
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

  const tabsLength = !!sidebarTabs.filter(({ url }) => url?.href !== SIDEBAR_TAB_FAKE_URL).length;

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

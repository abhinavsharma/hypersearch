/**
 * @module modules:sidebar
 * @version 1.0.0
 * @license (C) Insight
 */

import React, { useCallback, useEffect, useState } from 'react';
import md5 from 'md5';
import { useDebouncedFn } from 'beautiful-react-hooks';
import { usePublicationInfo } from 'lib/publication';
import UserManager from 'lib/user';
import SidebarLoader from 'lib/sidebar';
import AugmentationManager from 'lib/augmentations';
import { flipSidebar } from 'lib/flip';
import { getFirstValidTabIndex, isKnowledgePage, triggerSerpProcessing } from 'lib/helpers';
import { SidebarTabs, SidebarToggleButton } from 'modules/sidebar';
import {
  createNote,
  DEFAULT_FALLBACK_SEARCH_ENGINE_PREFIX,
  DISABLE_SUGGESTED_AUGMENTATION,
  EXTENSION_AUTO_EXPAND,
  NOTE_AUGMENTATION_ID,
  NOTE_TAB_TITLE,
  POST_TAB_UPDATE_MESSAGE,
  SIDEBAR_TAB_FAKE_URL,
  SIDEBAR_TAB_NOTE_TAB,
  TOGGLE_BLOCKED_DOMAIN_MESSAGE,
  TOGGLE_TRUSTED_DOMAIN_MESSAGE,
  UPDATE_SIDEBAR_TABS_MESSAGE,
  URL_PARAM_TAB_TITLE_KEY,
  WINDOW_REQUIRED_MIN_WIDTH,
} from 'constant';
import './Sidebar.scss';
import { useFeature } from 'lib/features';

//-----------------------------------------------------------------------------------------------
// ! Component
//-----------------------------------------------------------------------------------------------
export const Sidebar: Sidebar = () => {
  const { publicationInfo, averageRating } = usePublicationInfo(window.location.hostname);
  const [rating, setRating] = useState<number>(0);
  const [sidebarTabs, setSidebarTabs] = useState<SidebarTab[]>(SidebarLoader.sidebarTabs);
  const [publicationFeature] = useFeature('desktop_ratings');
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

  const injectNotesTab = useCallback(() => {
    if (publicationFeature && !SidebarLoader.isSerp) {
      const noteUrl = new URL(`https://${DEFAULT_FALLBACK_SEARCH_ENGINE_PREFIX}`);
      noteUrl.href = SIDEBAR_TAB_NOTE_TAB;
      noteUrl.searchParams.append(URL_PARAM_TAB_TITLE_KEY, NOTE_TAB_TITLE);
      SidebarLoader.publicationSlices[NOTE_AUGMENTATION_ID] = Object.create(null);
      SidebarLoader.sidebarTabs.unshift({
        augmentation: createNote(SidebarLoader.url.href),
        url: noteUrl,
      });
    }
  }, [publicationFeature]);

  useEffect(() => {
    injectNotesTab();
    setActiveKey(getFirstValidTabIndex(SidebarLoader.sidebarTabs));
  }, [injectNotesTab]);

  useEffect(() => {
    SidebarLoader.showPublicationRating = averageRating > 0;
    setRating(averageRating);
  }, [averageRating]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    if (shouldPreventExpand && !SidebarLoader.isPreview) {
      flipSidebar(document, 'hide', SidebarLoader);
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
  }, [handleResize, firstValidTab, isKpPage, shouldPreventExpand, validTabsLength, rating]);

  useEffect(() => {
    chrome.runtime.onMessage.addListener((msg) => {
      switch (msg.type) {
        case UPDATE_SIDEBAR_TABS_MESSAGE:
          setSidebarTabs(() => {
            SidebarLoader.getTabsAndAugmentations();
            injectNotesTab();
            return SidebarLoader.sidebarTabs;
          });
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
  }, [injectNotesTab]);

  const tabsLength = !!sidebarTabs.filter(({ url }) => url?.href !== SIDEBAR_TAB_FAKE_URL).length;

  const shouldShowButton =
    !!publicationInfo.tags?.length || !!averageRating || !!tabsLength || !SidebarLoader.isSerp;

  //-----------------------------------------------------------------------------------------------
  // ! Render
  //-----------------------------------------------------------------------------------------------
  return (
    <>
      <div id="insight-sidebar-container" className="insight-full-size-fixed">
        <SidebarTabs tabs={sidebarTabs} activeKey={activeKey} setActiveKey={setActiveKey} />
      </div>
      {shouldShowButton && (
        <SidebarToggleButton tabs={sidebarTabs} rating={averageRating} info={publicationInfo} />
      )}
    </>
  );
};

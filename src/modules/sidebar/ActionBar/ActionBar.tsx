/**
 * @module modules:sidebar
 * @version 1.0.0
 * @license (C) Insight
 */

import React, { Suspense, useRef } from 'react';
import { v4 as uuid } from 'uuid';
import Button from 'antd/lib/button';
import Tooltip from 'antd/lib/tooltip';
import { GitMerge, EyeOff, Edit, MapPin } from 'react-feather';
import { ShareButton } from 'modules/shared';
import SidebarLoader from 'lib/sidebar';
import AugmentationManager from 'lib/augmentations';
import UserManager from 'lib/user';
import { getFirstValidTabIndex } from 'lib/helpers';
import { CSE_PREFIX, MESSAGE, PAGE, PROTECTED_AUGMENTATIONS, SIDEBAR_Z_INDEX } from 'constant';
import 'antd/lib/button/style/index.css';
import 'antd/lib/tooltip/style/index.css';
import './ActionBar.scss';

//-----------------------------------------------------------------------------------------------
// ! Magics
//-----------------------------------------------------------------------------------------------
const EDIT_INSTALLED_AUGMENTATION_BUTTON_TEXT = 'Edit local lens';
const EDIT_SUGGESTED_AUGMENTATION_BUTTON_TEXT = 'Fork: Duplicate lens and edit locally';
const PIN_AUGMENTATION_BUTTON_TEXT = 'Temporarily pin this lens';
const UNPIN_AUGMENTATION_BUTTON_TEXT = 'Unpin this lens';
const DISABLE_INSTALLED_AUGMENTATION_BUTTON_TEXT = 'Disable local lens';
const DISABLE_SUGGESTED_AUGMENTATION_BUTTON_TEXT = 'Hide lens';
const ICON_SELECTED_COLOR = 'rgb(23, 191, 99)';
const ICON_UNSELECTED_COLOR = '#999';

//-----------------------------------------------------------------------------------------------
// ! Component
//-----------------------------------------------------------------------------------------------
export const ActionBar: ActionBar = ({ tab, setActiveKey }) => {
  const tooltipContainer = useRef<HTMLDivElement>(null);

  //-----------------------------------------------------------------------------------------------
  // ! Handlers
  //-----------------------------------------------------------------------------------------------
  const handleOpenAugmentationBuilder = (isEdit?: boolean) => {
    AugmentationManager.preparedLogMessage =
      isEdit || UserManager.user.privacy
        ? null
        : {
            augmentation: tab.augmentation,
          };
    chrome.runtime.sendMessage({
      type: MESSAGE.OPEN_PAGE,
      page: PAGE.BUILDER,
      augmentation: {
        ...tab.augmentation,
        id: isEdit ? tab.augmentation.id : `${CSE_PREFIX}-${uuid()}`,
        enabled: isEdit,
        installed: isEdit,
      },
    });
  };

  const handleDisableInstalled = () => {
    setActiveKey(
      getFirstValidTabIndex(
        SidebarLoader.sidebarTabs.filter(({ augmentation: { id } }) => id !== tab.augmentation.id),
      ),
    );
    AugmentationManager.addOrEditAugmentation(tab.augmentation, { isActive: false });
  };

  const handlePin = () => {
    AugmentationManager.pinAugmentation(tab.augmentation);
  };

  const handleUnpin = () => {
    AugmentationManager.unpinAugmentation(tab.augmentation);
  };

  const handleHideSuggested = (tab: SidebarTab) => {
    setActiveKey(
      getFirstValidTabIndex(
        SidebarLoader.sidebarTabs.filter(({ augmentation: { id } }) => id !== tab.augmentation.id),
      ),
    );
    AugmentationManager.disableSuggestedAugmentation(tab.augmentation);
  };

  const handleHide = () =>
    tab.augmentation?.installed ? handleDisableInstalled() : handleHideSuggested(tab);

  const handleEditInstalled = () => handleOpenAugmentationBuilder(true);

  const handleEditSuggested = () => handleOpenAugmentationBuilder(false);

  const keepParent = { keepParent: false };
  const containerStyle = { zIndex: SIDEBAR_Z_INDEX + 1 };
  const getPopupContainer = () => tooltipContainer.current as HTMLDivElement;

  //-----------------------------------------------------------------------------------------------
  // ! Render
  //-----------------------------------------------------------------------------------------------
  return (
    <div id="actionbar">
      <div className="insight-suggested-tab-popup">
        {!(PROTECTED_AUGMENTATIONS as readonly string[]).includes(tab.augmentation?.id) && (
          <Tooltip
            title={
              tab.augmentation?.installed
                ? DISABLE_INSTALLED_AUGMENTATION_BUTTON_TEXT
                : DISABLE_SUGGESTED_AUGMENTATION_BUTTON_TEXT
            }
            destroyTooltipOnHide={keepParent}
            getPopupContainer={getPopupContainer}
            placement="bottom"
          >
            <Button
              type="link"
              onClick={handleHide}
              icon={<EyeOff size={15} stroke={ICON_UNSELECTED_COLOR} />}
            />
          </Tooltip>
        )}

        {tab.augmentation?.pinned ? (
          <Tooltip
            title={UNPIN_AUGMENTATION_BUTTON_TEXT}
            destroyTooltipOnHide={keepParent}
            getPopupContainer={getPopupContainer}
            placement="bottom"
          >
            <Button
              type="link"
              onClick={handleUnpin}
              icon={
                <Suspense fallback={null}>
                  <MapPin size={15} stroke={ICON_SELECTED_COLOR} />
                </Suspense>
              }
            />
          </Tooltip>
        ) : (
          <Tooltip
            title={PIN_AUGMENTATION_BUTTON_TEXT}
            destroyTooltipOnHide={keepParent}
            getPopupContainer={getPopupContainer}
            placement="bottom"
          >
            <Button
              type="link"
              onClick={handlePin}
              icon={
                <Suspense fallback={null}>
                  <MapPin size={15} stroke={ICON_UNSELECTED_COLOR} />
                </Suspense>
              }
            />
          </Tooltip>
        )}

        {tab.augmentation?.installed && (
          <Tooltip
            title={EDIT_INSTALLED_AUGMENTATION_BUTTON_TEXT}
            destroyTooltipOnHide={keepParent}
            getPopupContainer={getPopupContainer}
            placement="bottom"
          >
            <Button
              type="link"
              onClick={handleEditInstalled}
              icon={
                <Suspense fallback={null}>
                  <Edit size={15} stroke={ICON_UNSELECTED_COLOR} />
                </Suspense>
              }
            />
          </Tooltip>
        )}

        <Tooltip
          title={EDIT_SUGGESTED_AUGMENTATION_BUTTON_TEXT}
          destroyTooltipOnHide={keepParent}
          getPopupContainer={getPopupContainer}
          placement="bottom"
        >
          <Button
            type="link"
            onClick={handleEditSuggested}
            icon={<GitMerge size={15} stroke={ICON_UNSELECTED_COLOR} />}
          />
        </Tooltip>

        <ShareButton icon augmentation={tab.augmentation} />
      </div>
      <div className="tooltip-container" ref={tooltipContainer} style={containerStyle} />
    </div>
  );
};

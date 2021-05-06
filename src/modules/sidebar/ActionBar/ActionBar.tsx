import React, { Suspense, useRef } from 'react';
import { v4 as uuid } from 'uuid';
import Button from 'antd/lib/button';
import Tooltip from 'antd/lib/tooltip';
import { GitMerge, EyeOff, Edit, MapPin } from 'react-feather';
import { ShareButton } from 'modules/shared';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import AugmentationManager from 'lib/AugmentationManager/AugmentationManager';
import {
  CSE_PREFIX,
  getFirstValidTabIndex,
  OPEN_AUGMENTATION_BUILDER_MESSAGE,
  OPEN_BUILDER_PAGE,
  PROTECTED_AUGMENTATIONS,
  SIDEBAR_Z_INDEX,
} from 'utils';
import 'antd/lib/button/style/index.css';
import 'antd/lib/tooltip/style/index.css';
import './ActionBar.scss';

const ICON_SELECTED_COLOR = 'rgb(23, 191, 99)';
const ICON_UNSELECTED_COLOR = '#999';

export const ActionBar: ActionBar = ({ tab, setActiveKey }) => {
  const tooltipContainer = useRef(null);

  const handleOpenAugmentationBuilder = (_e, isEdit?: boolean) => {
    AugmentationManager.preparedLogMessage =
      isEdit || SidebarLoader.strongPrivacy
        ? null
        : {
            augmentation: tab.augmentation,
          };
    chrome.runtime.sendMessage({
      type: OPEN_AUGMENTATION_BUILDER_MESSAGE,
      page: OPEN_BUILDER_PAGE.BUILDER,
      augmentation: {
        ...tab.augmentation,
        id: isEdit ? tab.augmentation.id : `${CSE_PREFIX}-${uuid()}`,
        enabled: isEdit,
        installed: isEdit,
      },
    } as OpenBuilderMessage);
  };

  const handleDisableInstalled = () => {
    setActiveKey(
      getFirstValidTabIndex(SidebarLoader.sidebarTabs.filter(({ id }) => id !== tab.id)),
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
      getFirstValidTabIndex(SidebarLoader.sidebarTabs.filter(({ id }) => id !== tab.id)),
    );
    AugmentationManager.disableSuggestedAugmentation(tab.augmentation);
  };

  return (
    <div id="actionbar">
      <div className="insight-suggested-tab-popup">
        {!PROTECTED_AUGMENTATIONS.includes(tab.augmentation?.id) && (
          <Tooltip
            title={tab.augmentation?.installed ? 'Disable local lens' : 'Hide lens'}
            destroyTooltipOnHide={{ keepParent: false }}
            getPopupContainer={() => tooltipContainer.current}
            placement="bottom"
          >
            <Button
              type="link"
              onClick={() =>
                tab.augmentation?.installed ? handleDisableInstalled() : handleHideSuggested(tab)
              }
              icon={<EyeOff size={15} stroke={ICON_UNSELECTED_COLOR} />}
            />
          </Tooltip>
        )}

        {tab.augmentation?.pinned ? (
          <Tooltip
            title="Unpin this lens"
            destroyTooltipOnHide={{ keepParent: false }}
            getPopupContainer={() => tooltipContainer.current}
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
            title="Temporarily pin this lens"
            destroyTooltipOnHide={{ keepParent: false }}
            getPopupContainer={() => tooltipContainer.current}
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
            title="Edit local lens"
            destroyTooltipOnHide={{ keepParent: false }}
            getPopupContainer={() => tooltipContainer.current}
            placement="bottom"
          >
            <Button
              type="link"
              onClick={(e) => handleOpenAugmentationBuilder(e, true)}
              icon={
                <Suspense fallback={null}>
                  <Edit size={15} stroke={ICON_UNSELECTED_COLOR} />
                </Suspense>
              }
            />
          </Tooltip>
        )}

        <Tooltip
          title="Fork: Duplicate lens and edit locally"
          destroyTooltipOnHide={{ keepParent: false }}
          getPopupContainer={() => tooltipContainer.current}
          placement="bottom"
        >
          <Button
            type="link"
            onClick={handleOpenAugmentationBuilder}
            icon={<GitMerge size={15} stroke={ICON_UNSELECTED_COLOR} />}
          />
        </Tooltip>

        <ShareButton icon augmentation={tab.augmentation} />
      </div>
      <div
        className="tooltip-container"
        ref={tooltipContainer}
        style={{ zIndex: SIDEBAR_Z_INDEX + 1 }}
      />
    </div>
  );
};

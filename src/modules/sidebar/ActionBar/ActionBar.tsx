import React, { Suspense, useRef } from 'react';
import { v4 as uuid } from 'uuid';
import { Link } from 'route-lite';
import Button from 'antd/lib/button';
import Tooltip from 'antd/lib/tooltip';
import { EditAugmentationPage } from 'modules/augmentations/';
import { ShareButton } from 'modules/shared';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import AugmentationManager from 'lib/AugmentationManager/AugmentationManager';
import {
  CSE_PREFIX,
  getFirstValidTabIndex,
  OPEN_AUGMENTATION_BUILDER_MESSAGE,
  SIDEBAR_Z_INDEX,
} from 'utils';
import 'antd/lib/button/style/index.css';
import 'antd/lib/tooltip/style/index.css';
import './ActionBar.scss';

const BranchesOutlined = React.lazy(
  async () => await import('@ant-design/icons/BranchesOutlined').then((mod) => mod),
);

const PushpinOutlined = React.lazy(
  async () => await import('@ant-design/icons/PushpinOutlined').then((mod) => mod),
);

const PushpinFilled = React.lazy(
  async () => await import('@ant-design/icons/PushpinFilled').then((mod) => mod),
);

const CloseCircleOutlined = React.lazy(
  async () => await import('@ant-design/icons/CloseCircleOutlined').then((mod) => mod),
);

const EditOutlined = React.lazy(
  async () => await import('@ant-design/icons/EditOutlined').then((mod) => mod),
);

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
      augmentation: {
        ...tab.augmentation,
        id: isEdit ? tab.augmentation.id : `${CSE_PREFIX}-${uuid()}`,
        enabled: isEdit,
        installed: isEdit,
      },
    });
  };

  const handleDisableInstalled = () => {
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
            icon={
              <Suspense fallback={null}>
                <CloseCircleOutlined />
              </Suspense>
            }
          />
        </Tooltip>

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
                  <PushpinFilled />
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
                  <PushpinOutlined />
                </Suspense>
              }
            />
          </Tooltip>
        )}

        {tab.augmentation?.installed && (
          <Link
            component={EditAugmentationPage}
            componentProps={{
              augmentation: tab.augmentation,
              setActiveKey,
            }}
            key={uuid()}
          >
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
                    <EditOutlined />
                  </Suspense>
                }
              />
            </Tooltip>
          </Link>
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
            icon={
              <Suspense fallback={null}>
                <BranchesOutlined />
              </Suspense>
            }
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

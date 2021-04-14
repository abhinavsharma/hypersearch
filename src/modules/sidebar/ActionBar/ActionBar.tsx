import React, { Suspense, useRef } from 'react';
import { Link } from 'route-lite';
import Button from 'antd/lib/button';
import Tooltip from 'antd/lib/tooltip';
import { EditAugmentationPage } from 'modules/augmentations/';
import { ShareButton } from 'modules/shared';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import AugmentationManager from 'lib/AugmentationManager/AugmentationManager';
import { getFirstValidTabIndex, OPEN_AUGMENTATION_BUILDER_MESSAGE, SIDEBAR_Z_INDEX } from 'utils';
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

const DeleteOutlined = React.lazy(
  async () => await import('@ant-design/icons/DeleteOutlined').then((mod) => mod),
);

export const ActionBar: ActionBar = ({ tab, setActiveKey }) => {
  const tooltipContainer = useRef(null);

  const handleOpenAugmentationBuilder = () => {
    chrome.runtime.sendMessage({
      type: OPEN_AUGMENTATION_BUILDER_MESSAGE,
      augmentation: tab.augmentation,
    });
  };

  const handlePin = () => AugmentationManager.pinAugmentation(tab.augmentation);
  const handleUnpin = () => {
    AugmentationManager.unpinAugmentation(tab.augmentation);
    setActiveKey(getFirstValidTabIndex(SidebarLoader.sidebarTabs));
  };

  const handleRemoveInstalled = () => {
    setActiveKey(
      getFirstValidTabIndex(SidebarLoader.sidebarTabs.filter(({ id }) => id !== tab.id)),
    );
    AugmentationManager.removeInstalledAugmentation(tab.augmentation);
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
        {tab.augmentation.installed ? (
          <Link
            component={EditAugmentationPage}
            componentProps={{
              augmentation: tab.augmentation,
              setActiveKey,
            }}
            key={tab.id}
          >
            <Tooltip
              title="Edit local lens"
              destroyTooltipOnHide={{ keepParent: false }}
              getPopupContainer={() => tooltipContainer.current}
              placement="bottom"
            >
              <Button
                type="link"
                onClick={handleOpenAugmentationBuilder}
                icon={
                  <Suspense fallback={null}>
                    <EditOutlined />
                  </Suspense>
                }
              />
            </Tooltip>
          </Link>
        ) : (
          <Link
            component={EditAugmentationPage}
            componentProps={{
              augmentation: {
                ...tab.augmentation,
                description: !tab.augmentation.installed ? '' : tab.augmentation.description,
                installed: tab.augmentation.installed,
              },
              setActiveKey,
            }}
            key={tab.id}
          >
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
          </Link>
        )}
        {tab.augmentation.pinned ? (
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
        {tab.augmentation.installed && (
          <Tooltip
            title="Delete local lens"
            destroyTooltipOnHide={{ keepParent: false }}
            getPopupContainer={() => tooltipContainer.current}
            placement="bottom"
          >
            <Button
              type="link"
              onClick={handleRemoveInstalled}
              icon={
                <Suspense fallback={null}>
                  <DeleteOutlined style={{ color: 'red' }} />
                </Suspense>
              }
            />
          </Tooltip>
        )}
        {!tab.augmentation.installed && (
          <Tooltip
            title="Hide lens"
            destroyTooltipOnHide={{ keepParent: false }}
            getPopupContainer={() => tooltipContainer.current}
            placement="bottom"
          >
            <Button
              type="link"
              onClick={() => handleHideSuggested(tab)}
              icon={
                <Suspense fallback={null}>
                  <CloseCircleOutlined />
                </Suspense>
              }
            />
          </Tooltip>
        )}
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

import React, { Suspense } from 'react';
import { Link } from 'route-lite';
import Button from 'antd/lib/button';
import { EditAugmentationPage } from 'modules/augmentations/';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import AugmentationManager from 'lib/AugmentationManager/AugmentationManager';
import {
  ANY_URL_CONDITION,
  ANY_URL_CONDITION_TEMPLATE,
  OPEN_AUGMENTATION_BUILDER_MESSAGE,
  UPDATE_SIDEBAR_TABS_MESSAGE,
} from 'utils/constants';
import './ActionBar.scss';
import Tooltip from 'antd/lib/tooltip';
import 'antd/lib/tooltip/style/index.css';

const BranchesOutlined = React.lazy(
  async () => await import('@ant-design/icons/BranchesOutlined').then((mod) => mod),
);

const PushpinOutlined = React.lazy(
  async () => await import('@ant-design/icons/PushpinOutlined').then((mod) => mod),
);

const ToolOutlined = React.lazy(
  async () => await import('@ant-design/icons/ToolOutlined').then((mod) => mod),
);

const CloseCircleOutlined = React.lazy(
  async () => await import('@ant-design/icons/CloseCircleOutlined').then((mod) => mod),
);

const ShareAltOutlined = React.lazy(
  async () => await import('@ant-design/icons/ShareAltOutlined').then((mod) => mod),
);

export const ActionBar: ActionBar = ({ tab, setActiveKey }) => {
  const augmentation = (tab.isSuggested
    ? SidebarLoader.suggestedAugmentations
    : SidebarLoader.installedAugmentations
  ).find(({ id }) => id === tab.id);

  const isPinned = !!augmentation.conditions.condition_list.find(
    (i) => i.key === ANY_URL_CONDITION,
  );

  const handleShare = () => {
    AugmentationManager.shareAugmentation(augmentation);
  };

  const handleAddSuggested = () => {
    chrome.runtime.sendMessage({ type: OPEN_AUGMENTATION_BUILDER_MESSAGE });
  };

  const handleAddPinned = () => {
    AugmentationManager.addOrEditAugmentation(augmentation, {
      conditions: [ANY_URL_CONDITION_TEMPLATE],
      name: `${tab.title} / Pinned`,
      isActive: true,
      isPinning: true,
    });
  };

  const handleHideSuggested = (tab: SidebarTab) => {
    const augmentation = SidebarLoader.suggestedAugmentations.find((i) => i.id === tab.id);
    SidebarLoader.ignoredAugmentations.push(augmentation);
    chrome.storage.local.set({
      [`ignored-${tab.id}`]: augmentation,
    });
    SidebarLoader.suggestedAugmentations = SidebarLoader.suggestedAugmentations.filter(
      (i) => i.id !== augmentation.id,
    );
    const numInstalledAugmentations = SidebarLoader.installedAugmentations.filter(
      (i) => !!i.enabled,
    ).length;
    const numSuggestedAugmentations = SidebarLoader.suggestedAugmentations.length;
    !numSuggestedAugmentations && !numInstalledAugmentations
      ? setActiveKey('0')
      : setActiveKey('1');
    chrome.runtime.sendMessage({ type: UPDATE_SIDEBAR_TABS_MESSAGE });
  };

  return (
    <div className="insight-suggested-tab-popup">
      <Link
        component={EditAugmentationPage}
        componentProps={{
          augmentation: {
            ...augmentation,
            description: tab.isSuggested ? '' : augmentation.description,
            installed: !tab.isSuggested,
          },
          isAdding: tab.isSuggested,
          setActiveKey,
        }}
        key={tab.id}
      >
        <Tooltip title="Duplicate and edit locally" destroyTooltipOnHide={{ keepParent: false }}>
          <Button
            type="link"
            onClick={handleAddSuggested}
            style={{ marginBottom: tab.isSuggested ? 0 : 7 }}
            icon={
              <Suspense fallback={null}>
                <BranchesOutlined />
              </Suspense>
            }
          />
        </Tooltip>
      </Link>
      {!isPinned && (
        <Tooltip title="Always show this lens" destroyTooltipOnHide={{ keepParent: false }}>
          <Button
            type="link"
            onClick={handleAddPinned}
            style={{ marginBottom: tab.isSuggested ? 0 : 7 }}
            icon={
              <Suspense fallback={null}>
                <PushpinOutlined />
              </Suspense>
            }
          />
        </Tooltip>
      )}
      {tab.isSuggested && (
        <Tooltip title="Hide Lens" destroyTooltipOnHide={{ keepParent: false }}>
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
      {tab.isCse && !tab.id.startsWith('cse-custom-') && (
        <Tooltip title="Improve Lens for Everyone" destroyTooltipOnHide={{ keepParent: false }}>
          <Button
            type="link"
            target="_blank"
            href={
              'https://airtable.com/shrQCthknXg1jf6oU?prefill_Search%20Engine%20Name=' +
              tab.title +
              '&prefill_sample_query=' +
              new URLSearchParams(window.location.search).get('q')
            }
            icon={
              <Suspense fallback={null}>
                <ToolOutlined />
              </Suspense>
            }
          />
        </Tooltip>
      )}
      <Tooltip title="Share Lens" destroyTooltipOnHide={{ keepParent: false }}>
        <Button
          type="link"
          onClick={handleShare}
          icon={
            <Suspense fallback={null}>
              <ShareAltOutlined />
            </Suspense>
          }
        />
      </Tooltip>
    </div>
  );
};

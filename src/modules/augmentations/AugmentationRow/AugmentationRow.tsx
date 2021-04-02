import React from 'react';
import { goTo } from 'route-lite';
import Tag from 'antd/lib/tag';
import AugmentationManager from 'lib/AugmentationManager/AugmentationManager';
import { EditAugmentationPage } from 'modules/augmentations';
import { ANY_URL_CONDITION, ANY_URL_CONDITION_TEMPLATE, UPDATE_SIDEBAR_TABS_MESSAGE } from 'utils';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import 'antd/lib/tag/style/index.css';
import 'antd/lib/button/style/index.css';
import './AugmentationRow.scss';

export const AugmentationRow: AugmentationRow = ({ augmentation, setActiveKey, ignored }) => {
  const isPinned = !!augmentation.conditions.condition_list.find(
    (i) => i.key === ANY_URL_CONDITION,
  );
  const isSuggested = !augmentation.hasOwnProperty('enabled');

  const handlePin = () => {
    AugmentationManager.addOrEditAugmentation(augmentation, {
      name: `${augmentation.name} /\u00a0Pinned`,
      conditions: [ANY_URL_CONDITION_TEMPLATE],
      isActive: augmentation.hasOwnProperty('enabled') ? augmentation.enabled : true,
      isPinning: true,
    });
  };

  const handleUnIgnore = () => {
    SidebarLoader.ignoredAugmentations = SidebarLoader.ignoredAugmentations.filter(
      (i) => i.id !== augmentation.id,
    );
    chrome.storage.local.remove(`ignored-${augmentation.id}`);
    SidebarLoader.suggestedAugmentations.push(augmentation);
    chrome.runtime.sendMessage({ type: UPDATE_SIDEBAR_TABS_MESSAGE });
  };

  const handleDelete = () => AugmentationManager.removeInstalledAugmentation(augmentation);

  const handleEdit = () =>
    goTo(EditAugmentationPage, {
      augmentation: {
        ...augmentation,
        description: isSuggested ? '' : augmentation.description,
      },
      setActiveKey,
      initiatedFromActives: true,
      isAdding: !augmentation.hasOwnProperty('enabled'),
    });

  return (
    <div className="augmentation-row">
      <span className="augmentation-name">
        {!augmentation.hasOwnProperty('installed') ? augmentation.name : `${augmentation.name} ◾`}
      </span>
      <Tag
        color="geekblue"
        className={`augmentation-row-button force-left-margin`}
        onClick={handleEdit}
      >
        Edit Locally
      </Tag>
      {ignored ? (
        <Tag className="augmentation-row-button" color="geekblue" onClick={handleUnIgnore}>
          Unhide
        </Tag>
      ) : (
        !isPinned && (
          <Tag className="augmentation-row-button" color="geekblue" onClick={handlePin}>
            Pin Locally
          </Tag>
        )
      )}
      {augmentation.installed ? (
        <Tag className="augmentation-row-button" color="volcano" onClick={handleDelete}>
          Remove
        </Tag>
      ) : null}
    </div>
  );
};

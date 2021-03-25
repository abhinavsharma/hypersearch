import React from 'react';
import { goTo } from 'route-lite';
import Button from 'antd/lib/button';
import AugmentationManager from 'lib/AugmentationManager/AugmentationManager';
import { EditAugmentationPage } from 'modules/augmentations';
import { ANY_URL_CONDITION_TEMPLATE, UPDATE_SIDEBAR_TABS_MESSAGE } from 'utils/constants';
import 'antd/lib/button/style/index.css';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';

export const AugmentationRow: AugmentationRow = ({ augmentation, setActiveKey, ignored }) => {
  const handlePin = () => {
    AugmentationManager.addOrEditAugmentation(
      { ...augmentation, isPinned: true },
      {
        name: `${augmentation.name} / Pinned`,
        conditions: [ANY_URL_CONDITION_TEMPLATE],
        isActive: augmentation.hasOwnProperty('enabled') ? augmentation.enabled : true,
        isPinning: true,
      },
    );
  };

  const handleUnIgnore = () => {
    SidebarLoader.ignoredAugmentations = SidebarLoader.ignoredAugmentations.filter(
      (i) => i.id !== augmentation.id,
    );
    chrome.storage.local.remove(`ignored-${augmentation.id}`);
    SidebarLoader.suggestedAugmentations.push(augmentation);
    chrome.runtime.sendMessage({ type: UPDATE_SIDEBAR_TABS_MESSAGE });
  };

  return (
    <div className="augmentation-row">
      <span className="augmentation-name">
        {!augmentation.hasOwnProperty('installed')
          ? augmentation.name
          : `${augmentation.name} ${augmentation.isPinned ? '📌' : '◾'}`}
      </span>
      <Button
        size="small"
        type="ghost"
        className={`${augmentation.isPinned ? 'force-left-margin' : ''}`}
        onClick={() =>
          goTo(EditAugmentationPage, {
            augmentation,
            setActiveKey,
            initiatedFromActives: true,
            isAdding: !augmentation.hasOwnProperty('enabled'),
          })
        }
      >
        Edit Locally
      </Button>
      {ignored ? (
        <Button size="small" type="ghost" onClick={handleUnIgnore}>
          Unhide
        </Button>
      ) : (
        !augmentation.isPinned && (
          <Button size="small" type="ghost" onClick={handlePin}>
            Always Show
          </Button>
        )
      )}
    </div>
  );
};

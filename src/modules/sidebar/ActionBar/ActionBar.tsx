import React from 'react';
import { Link } from 'route-lite';
import Button from 'antd/lib/button';
import { EditAugmentationPage } from 'modules/augmentations/';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import AugmentationManager from 'lib/AugmentationManager/AugmentationManager';
import {
  ANY_URL_CONDITION_TEMPLATE,
  OPEN_AUGMENTATION_BUILDER_MESSAGE,
  UPDATE_SIDEBAR_TABS_MESSAGE,
} from 'utils/constants';
import './ActionBar.scss';

export const ActionBar: ActionBar = ({ tab, setActiveKey }) => {
  const augmentation = (tab.isSuggested
    ? SidebarLoader.suggestedAugmentations
    : [...SidebarLoader.installedAugmentations, ...SidebarLoader.pinnedAugmentations]
  ).find((i) => i.id === tab.id);

  const handleAddSuggested = () => {
    chrome.runtime.sendMessage({ type: OPEN_AUGMENTATION_BUILDER_MESSAGE });
  };

  const handleAddPinned = () => {
    AugmentationManager.addOrEditAugmentation(
      { ...augmentation, isPinned: true },
      {
        conditions: [ANY_URL_CONDITION_TEMPLATE],
        name: `${tab.title} / Pinned`,
        isActive: true,
        isPinning: true,
      },
    );
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
            installed: !tab.isSuggested,
          },
          isAdding: tab.isSuggested,
          setActiveKey,
        }}
        key={tab.id}
      >
        <Button
          type="link"
          onClick={handleAddSuggested}
          style={{ marginBottom: tab.isSuggested ? 0 : 7 }}
        >
          {tab.isSuggested ? '🔎 Edit Lens Locally' : '✏️ Edit Lens'}
        </Button>
      </Link>
      {!tab.isPinned && (
        <Button
          type="link"
          onClick={handleAddPinned}
          style={{ marginBottom: tab.isSuggested ? 0 : 7 }}
        >
          Always Show
        </Button>
      )}
      {tab.isCse && !tab.id.startsWith('cse-custom-') && (
        <Button
          type="link"
          target="_blank"
          href={
            'https://airtable.com/shrQCthknXg1jf6oU?prefill_Search%20Engine%20Name=' +
            tab.title +
            '&prefill_sample_query=' +
            new URLSearchParams(window.location.search).get('q')
          }
        >
          🤔 Send Feedback
        </Button>
      )}
      {tab.isSuggested && (
        <Button type="link" onClick={() => handleHideSuggested(tab)}>
          × Hide
        </Button>
      )}
    </div>
  );
};

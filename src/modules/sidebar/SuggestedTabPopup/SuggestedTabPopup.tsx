import React from 'react';
import { Link } from 'route-lite';
import Button from 'antd/lib/button';
import { EditAugmentationPage } from 'modules/augmentations/';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import { OPEN_AUGMENTATION_BUILDER_MESSAGE, UPDATE_SIDEBAR_TABS_MESSAGE } from 'utils/constants';

export const SuggestedTabPopup: SuggestedTabPopup = ({ tab, setActiveKey }) => {
  const handleAddSuggested = () => {
    chrome.runtime.sendMessage({ type: OPEN_AUGMENTATION_BUILDER_MESSAGE });
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
      {tab.isCse && !tab.id.startsWith('cse-custom-') && (
        <Button
          type="link"
          target="_blank"
          href={
            'http://share.insightbrowser.com/14?prefill_Search%20Engine%20Name=' +
            tab.title +
            '&prefill_sample_query=' +
            new URLSearchParams(window.location.search).get('q')
          }
        >
          🤔 Report Filter
        </Button>
      )}
      <Link
        component={EditAugmentationPage}
        componentProps={{
          augmentation: {
            ...SidebarLoader.suggestedAugmentations.find((i) => i.id === tab.id),
            installed: false,
          },
          isAdding: true,
        }}
        key={tab.id}
      >
        <Button type="link" onClick={handleAddSuggested}>
          ⑃ Fork
        </Button>
      </Link>
      <Button type="link" onClick={() => handleHideSuggested(tab)}>
        × Hide
      </Button>
    </div>
  );
};

import { useEffect, useState } from 'react';
import { goTo } from 'route-lite';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import { EditAugmentationPage } from 'modules/augmentations';
import {
  EMPTY_AUGMENTATION,
  OPEN_AUGMENTATION_BUILDER_MESSAGE,
  UPDATE_SIDEBAR_TABS_MESSAGE,
} from 'utils';

export const useActiveAugmentationPage = (setActiveKey) => {
  const [installedAugmentations, setInstalledAugmentations] = useState<AugmentationObject[]>(
    SidebarLoader.installedAugmentations,
  );
  const [suggestedAugmentations, setSuggestedAugmentations] = useState<AugmentationObject[]>(
    SidebarLoader.suggestedAugmentations,
  );
  const [ignoredAugmentations, setIgnoredAugmentations] = useState<AugmentationObject[]>(
    SidebarLoader.ignoredAugmentations,
  );
  const [otherAugmentations, setOtherAugmentations] = useState<AugmentationObject[]>(
    SidebarLoader.otherAugmentations,
  );
  const [pinnedAugmentations, setPinnedAugmentations] = useState<AugmentationObject[]>(
    SidebarLoader.pinnedAugmentations,
  );

  const augmentationSorter = (a: AugmentationObject, b: AugmentationObject) => {
    if (!a.installed && b.installed) return 1;
    return (
      a.name.match(/[\w]/)[0].toLowerCase().charCodeAt(0) -
      b.name.match(/[\w]/)[0].toLowerCase().charCodeAt(0)
    );
  };

  const handleEdit = () =>
    goTo(EditAugmentationPage, {
      augmentation: EMPTY_AUGMENTATION,
      isAdding: true,
      initiatedFromActives: true,
      setActiveKey,
    });

  useEffect(() => {
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.type === UPDATE_SIDEBAR_TABS_MESSAGE) {
        setInstalledAugmentations(SidebarLoader.installedAugmentations);
        setSuggestedAugmentations(SidebarLoader.suggestedAugmentations);
        setIgnoredAugmentations(SidebarLoader.ignoredAugmentations);
        setOtherAugmentations(SidebarLoader.otherAugmentations);
        setPinnedAugmentations(SidebarLoader.pinnedAugmentations);
      }
      if (msg.type === OPEN_AUGMENTATION_BUILDER_MESSAGE) {
        (msg.augmentation || msg.create) &&
          goTo(EditAugmentationPage, {
            augmentation: msg.create ? EMPTY_AUGMENTATION : msg.augmentation,
            isAdding: msg.create,
            setActiveKey,
          });
      }
    });
  }, []);

  return {
    installedAugmentations,
    suggestedAugmentations,
    ignoredAugmentations,
    otherAugmentations,
    pinnedAugmentations,
    augmentationSorter,
    handleEdit,
  };
};

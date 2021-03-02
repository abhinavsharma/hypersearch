import { getLocalAugmentations } from 'lib/getLocalAugmentations/getLocalAugmentations';
import { EDIT_AUGMENTATION_SUCCESS } from 'utils/messages';

export const removeLocalAugmentation: RemoveLocalAugmentation = async (id) => {
  const installedAugmentations = await getLocalAugmentations();
  const augmentations = installedAugmentations.filter((installed) => installed !== id);
  chrome.storage.local.set({ augmentations });
  chrome.runtime.sendMessage({ type: EDIT_AUGMENTATION_SUCCESS });
};

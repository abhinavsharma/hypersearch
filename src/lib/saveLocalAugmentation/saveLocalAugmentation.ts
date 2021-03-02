import { getLocalAugmentations } from 'lib/getLocalAugmentations/getLocalAugmentations';
import { EDIT_AUGMENTATION_SUCCESS } from 'utils/messages';

export const saveLocalAugmentation: SaveLocalAugmentation = async (id) => {
  const existingAugmentations = await getLocalAugmentations();
  const augmentations = [...existingAugmentations, id];
  if (existingAugmentations.indexOf(id) === -1) {
    chrome.storage.local.set({ augmentations });
    chrome.runtime.sendMessage({ type: EDIT_AUGMENTATION_SUCCESS });
  }
  return augmentations;
};

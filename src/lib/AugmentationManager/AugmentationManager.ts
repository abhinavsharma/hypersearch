import { v4 as uuid } from 'uuid';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import { debug } from 'utils/helpers';
import { UPDATE_SIDEBAR_TABS_MESSAGE } from 'utils/constants';

class AugmentationManager {
  public addOrEditAugmentation(
    augmentation: AugmentationObject,
    { actions, conditions, conditionEvaluation, description, name, isActive }: AugmentationData,
  ) {
    const customId = `cse-custom-${
      augmentation.id !== '' ? augmentation.id : name.replace(/[\s]/g, '_').toLowerCase()
    }-${uuid()}`;
    const id =
      augmentation.id.startsWith('cse-custom-') && !augmentation.isPinned
        ? augmentation.id
        : customId;
    const updated = {
      ...augmentation,
      id,
      name,
      description,
      conditions: {
        condition_list: conditions ?? augmentation.conditions.condition_list,
        evaluate_with: conditionEvaluation ?? augmentation.conditions.evaluate_with,
      },
      actions: {
        ...augmentation.actions,
        action_list: actions
          ? actions.map((action) => ({
              ...action,
              value: action.value.filter((i) => i !== ''),
            }))
          : augmentation.actions.action_list,
      },
      enabled: isActive ?? augmentation.enabled,
      installed: true,
    };
    debug(
      'EditAugmentationPage - save\n---\n\tOriginal',
      augmentation,
      '\n\tUpdated',
      updated,
      '\n---',
    );
    !augmentation.isPinned
      ? (SidebarLoader.installedAugmentations = [
          updated,
          ...SidebarLoader.installedAugmentations.filter((i) => i.id !== updated.id),
        ])
      : (SidebarLoader.pinnedAugmentations = [
          updated,
          ...SidebarLoader.pinnedAugmentations.filter((i) => i.id !== updated.id),
        ]);
    chrome.storage.local.set({ [id]: updated });
    chrome.runtime.sendMessage({ type: UPDATE_SIDEBAR_TABS_MESSAGE });
  }
}

const instance = new AugmentationManager();

export default instance;

import { v4 as uuid } from 'uuid';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import { debug } from 'utils/helpers';
import { SEARCH_HIDE_DOMAIN_ACTION, UPDATE_SIDEBAR_TABS_MESSAGE } from 'utils/constants';

class AugmentationManager {
  public addOrEditAugmentation(
    augmentation: AugmentationObject,
    {
      actions,
      conditions,
      conditionEvaluation,
      description,
      name,
      isActive,
      isPinning,
    }: AugmentationData,
    refresh?: boolean,
  ) {
    const customId = `cse-custom-${
      augmentation.id !== '' ? augmentation.id : name.replace(/[\s]/g, '_').toLowerCase()
    }-${uuid()}`;
    const id = augmentation.id.startsWith('cse-custom-') && !isPinning ? augmentation.id : customId;
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
    SidebarLoader.installedAugmentations = [
      updated,
      ...SidebarLoader.installedAugmentations.filter((i) => i.id !== updated.id),
    ];
    chrome.storage.local.set({ [id]: updated });
    chrome.runtime.sendMessage({
      type: UPDATE_SIDEBAR_TABS_MESSAGE,
      refresh,
    });
  }
}

const instance = new AugmentationManager();

export default instance;

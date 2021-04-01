import { v4 as uuid } from 'uuid';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import { b64EncodeUnicode, debug } from 'utils/helpers';
import {
  EXTENSION_SHARE_URL,
  EXTENSION_SHORT_SHARE_URL,
  OPEN_NEW_TAB_MESSAGE,
  UPDATE_SIDEBAR_TABS_MESSAGE,
} from 'utils/constants';
import md5 from 'md5';

class AugmentationManager {
  public async shareAugmentation(augmentation: AugmentationObject) {
    const encoded = b64EncodeUnicode(JSON.stringify(augmentation));
    await fetch(`${EXTENSION_SHARE_URL}${encodeURIComponent(encoded)}`, {
      mode: 'no-cors',
    });
    chrome.runtime.sendMessage({
      type: OPEN_NEW_TAB_MESSAGE,
      url: `${EXTENSION_SHORT_SHARE_URL}${md5(encoded).substr(0, 10)}`,
    });
  }

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

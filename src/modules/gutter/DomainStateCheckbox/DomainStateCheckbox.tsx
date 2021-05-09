import React, { useEffect, useState } from 'react';
import Checkbox, { CheckboxChangeEvent } from 'antd/lib/checkbox';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import AugmentationManager from 'lib/AugmentationManager/AugmentationManager';
import {
  MY_BLOCKLIST_ID,
  MY_TRUSTLIST_ID,
  REMOVE_SEARCHED_DOMAIN_MESSAGE,
  SEARCH_DOMAINS_ACTION,
} from 'utils';
import 'antd/lib/checkbox/style/index.css';

export const DomainStateCheckbox: DomainStateCheckbox = ({ domain }) => {
  const [isBlocked, setIsBlocked] = useState<boolean>(
    !!SidebarLoader.installedAugmentations
      .concat(SidebarLoader.otherAugmentations)
      .find(({ id }) => id === MY_BLOCKLIST_ID)
      .actions?.action_list?.filter((action) => !!action.value.find((value) => value === domain))
      .length,
  );

  const [isTrusted, setIsTrusted] = useState<boolean>(
    !!SidebarLoader.installedAugmentations
      .concat(SidebarLoader.otherAugmentations)
      .find(({ id }) => id === MY_TRUSTLIST_ID)
      .actions?.action_list?.filter((action) => !!action.value.find((value) => value === domain))
      .length,
  );

  const handleToggleBlocked = async (e: CheckboxChangeEvent) => {
    e.target.checked
      ? await AugmentationManager.updateBlockList(domain)
      : await AugmentationManager.deleteFromBlockList(domain);
    setIsBlocked(e.target.checked);
  };

  const handleAddTrusted = async () => {
    const trustList = SidebarLoader.installedAugmentations
      .concat(SidebarLoader.otherAugmentations)
      .find(({ id }) => id === MY_TRUSTLIST_ID);
    const newActions = trustList.actions.action_list.map((action, actionIndex) =>
      actionIndex === 0 ? { ...action, value: [...action.value, domain] } : action,
    );
    AugmentationManager.addOrEditAugmentation(trustList, {
      actions: newActions,
    });
  };

  const handleRemoveTrusted = async () => {
    const trustList = SidebarLoader.installedAugmentations
      .concat(SidebarLoader.otherAugmentations)
      .find(({ id }) => id === MY_TRUSTLIST_ID);
    const newData: Record<string, any> = {
      actions: trustList.actions.action_list.map((action) => {
        const { key, value } = action;
        return key === SEARCH_DOMAINS_ACTION
          ? { ...action, value: value.filter((valueDomain) => valueDomain !== domain) }
          : action;
      }),
    };

    window.postMessage(
      {
        name: REMOVE_SEARCHED_DOMAIN_MESSAGE,
        remove: trustList.id,
        domain,
        selector: {
          link: SidebarLoader.customSearchEngine.querySelector?.['desktop'],
          featured: SidebarLoader.customSearchEngine.querySelector?.featured ?? Array(0),
          container: SidebarLoader.customSearchEngine.querySelector?.result_container_selector,
        },
      },
      '*',
    );

    AugmentationManager.addOrEditAugmentation(trustList, newData);
  };

  const handleToggleTrusted = async (e: CheckboxChangeEvent) => {
    e.target.checked ? handleAddTrusted() : handleRemoveTrusted();
    setIsTrusted(e.target.checked);
  };

  useEffect(() => {
    setIsBlocked(
      !!SidebarLoader.installedAugmentations
        .concat(SidebarLoader.otherAugmentations)
        .find(({ id }) => id === MY_BLOCKLIST_ID)
        .actions?.action_list?.filter((action) => !!action.value.find((value) => value === domain))
        .length,
    );
    setIsTrusted(
      !!SidebarLoader.installedAugmentations
        .concat(SidebarLoader.otherAugmentations)
        .find(({ id }) => id === MY_TRUSTLIST_ID)
        .actions?.action_list?.filter((action) => !!action.value.find((value) => value === domain))
        .length,
    );
  }, [SidebarLoader.installedAugmentations, SidebarLoader.otherAugmentations]);

  return (
    <div className="domain-state-checkbox-container">
      <Checkbox
        className="domain-state-checkbox"
        checked={isTrusted}
        onChange={handleToggleTrusted}
      >
        Trusted
      </Checkbox>
      <Checkbox
        className="domain-state-checkbox"
        checked={isBlocked}
        onChange={handleToggleBlocked}
      >
        Muted
      </Checkbox>
    </div>
  );
};

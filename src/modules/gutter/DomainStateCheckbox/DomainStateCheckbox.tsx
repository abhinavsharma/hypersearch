import React, { useEffect, useMemo, useState } from 'react';
import Checkbox, { CheckboxChangeEvent } from 'antd/lib/checkbox';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import AugmentationManager from 'lib/AugmentationManager/AugmentationManager';
import { MY_BLOCKLIST_ID, MY_TRUSTLIST_ID } from 'utils';
import 'antd/lib/checkbox/style/index.css';

/** MAGICS **/
const TRUSTED_CHECKBOX_TEXT = 'Trusted';
const BLOCKED_CHECKBOX_TEXT = 'Blocked';

export const DomainStateCheckbox: DomainStateCheckbox = ({ domain }) => {
  const augmentations = useMemo(
    () => [...SidebarLoader.installedAugmentations, ...SidebarLoader.otherAugmentations],
    // Singleton instance not reinitialized on rerender.
    // ! Be careful when updating the dependency list!
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [SidebarLoader.installedAugmentations, SidebarLoader.otherAugmentations],
  );

  const trustList = useMemo(() => augmentations.find(({ id }) => id === MY_TRUSTLIST_ID), [
    augmentations,
  ]);

  const blockList = useMemo(() => augmentations.find(({ id }) => id === MY_BLOCKLIST_ID), [
    augmentations,
  ]);

  const [isBlocked, setIsBlocked] = useState<boolean>(
    !!blockList?.actions?.action_list?.filter(
      (action) => !!action.value.find((value) => value === domain),
    ).length,
  );

  const [isTrusted, setIsTrusted] = useState<boolean>(
    !!trustList?.actions?.action_list?.filter(
      (action) => !!action.value.find((value) => value === domain),
    ).length,
  );

  const handleToggleBlocked = async (e: CheckboxChangeEvent) => {
    e.target.checked
      ? await AugmentationManager.updateBlockList(domain)
      : await AugmentationManager.deleteFromBlockList(domain);
    setIsBlocked(e.target.checked);
  };

  const handleToggleTrusted = (e: CheckboxChangeEvent) => {
    AugmentationManager.toggleTrustlist(domain);
    setIsTrusted(e.target.checked);
  };

  useEffect(() => {
    setIsBlocked(
      !!augmentations
        .find(({ id }) => id === MY_BLOCKLIST_ID)
        ?.actions?.action_list?.filter((action) => !!action.value.find((value) => value === domain))
        .length,
    );

    setIsTrusted(
      !!augmentations
        .find(({ id }) => id === MY_TRUSTLIST_ID)
        ?.actions?.action_list?.filter((action) => !!action.value.find((value) => value === domain))
        .length,
    );
  }, [domain, augmentations]);

  return (
    <div className="domain-state-checkbox-container">
      <Checkbox
        className="domain-state-checkbox"
        checked={isTrusted}
        onChange={handleToggleTrusted}
      >
        {TRUSTED_CHECKBOX_TEXT}
      </Checkbox>
      <Checkbox
        className="domain-state-checkbox"
        checked={isBlocked}
        onChange={handleToggleBlocked}
      >
        {BLOCKED_CHECKBOX_TEXT}
      </Checkbox>
    </div>
  );
};

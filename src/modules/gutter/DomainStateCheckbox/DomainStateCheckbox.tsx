/**
 * @module modules:gutter
 * @version 1.0.0
 * @license (C) Insight
 */

import React, { useEffect, useMemo, useState } from 'react';
import Checkbox, { CheckboxChangeEvent } from 'antd/lib/checkbox';
import SidebarLoader from 'lib/sidebar';
import AugmentationManager from 'lib/augmentations';
import { AUGMENTATION_ID } from 'constant';
import 'antd/lib/checkbox/style/index.css';

//-----------------------------------------------------------------------------------------------
// ! Magics
//-----------------------------------------------------------------------------------------------
const TRUSTED_CHECKBOX_TEXT = 'Trusted';
const BLOCKED_CHECKBOX_TEXT = 'Blocked';

//-----------------------------------------------------------------------------------------------
// ! Component
//-----------------------------------------------------------------------------------------------
export const DomainStateCheckbox: DomainStateCheckbox = ({ domain }) => {
  const augmentations = useMemo(
    () => [...SidebarLoader.installedAugmentations, ...SidebarLoader.otherAugmentations],
    // Singleton instance not reinitialized on rerender.
    // ! Be careful when updating the dependency list!
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [SidebarLoader.installedAugmentations, SidebarLoader.otherAugmentations],
  );

  const trustList = useMemo(
    () => augmentations.find(({ id }) => id === AUGMENTATION_ID.TRUSTLIST),
    [augmentations],
  );

  const blockList = useMemo(
    () => augmentations.find(({ id }) => id === AUGMENTATION_ID.BLOCKLIST),
    [augmentations],
  );

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

  //-----------------------------------------------------------------------------------------------
  // ! Handlers
  //-----------------------------------------------------------------------------------------------

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
        .find(({ id }) => id === AUGMENTATION_ID.BLOCKLIST)
        ?.actions?.action_list?.filter((action) => !!action.value.find((value) => value === domain))
        .length,
    );

    setIsTrusted(
      !!augmentations
        .find(({ id }) => id === AUGMENTATION_ID.TRUSTLIST)
        ?.actions?.action_list?.filter((action) => !!action.value.find((value) => value === domain))
        .length,
    );
  }, [domain, augmentations]);

  //-----------------------------------------------------------------------------------------------
  // ! Render
  //-----------------------------------------------------------------------------------------------
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

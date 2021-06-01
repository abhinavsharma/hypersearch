import React, { useEffect, useState } from 'react';
import Checkbox, { CheckboxChangeEvent } from 'antd/lib/checkbox';
import 'antd/lib/checkbox/style/index.css';
import './SidebarFooter.scss';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import { triggerSerpProcessing } from 'utils';

/** MAGICS **/
const CHECKBOX_TEXT = (
  <span>
    Require pressing ⬆<code>Shift + Hover</code> to automatically preview
  </span>
);

export const SidebarFooter: SidebarFooter = () => {
  const [isChecked, setIsChecked] = useState(SidebarLoader.userData.altHover);

  useEffect(() => {
    setIsChecked(SidebarLoader.userData.altHover);
    // Singleton instance not reinitialized on rerender.
    // ! Be careful when updating the dependency list!
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [SidebarLoader.userData.altHover]);

  const handleChange = (e: CheckboxChangeEvent) => {
    setIsChecked(e.target.checked);
    SidebarLoader.alternateHoverAction(e.target.checked);
    triggerSerpProcessing(SidebarLoader);
  };

  return (
    <div id="sidebar-footer">
      <Checkbox checked={isChecked} onChange={handleChange}>
        {CHECKBOX_TEXT}
      </Checkbox>
    </div>
  );
};

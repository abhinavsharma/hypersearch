/**
 * @module modules:settings
 * @version 1.0.0
 * @license (C) Insight
 */

import React, { useEffect, useState } from 'react';
import UserManager from 'lib/user';
import { MultiValueInput } from 'modules/builder';
import 'antd/lib/input/style/index.css';

//-----------------------------------------------------------------------------------------------
// ! Magics
//-----------------------------------------------------------------------------------------------
const LICENSE_INPUT_PLACEHOLDER = 'If you have a special access key, paste it here';

//-----------------------------------------------------------------------------------------------
// ! Component
//-----------------------------------------------------------------------------------------------
export const LicenseForm: LicenseForm = ({ submit, className }) => {
  const [licenses, setLicenses] = useState(UserManager.user.licenses);

  //-----------------------------------------------------------------------------------------------
  // ! Handlers
  //-----------------------------------------------------------------------------------------------
  const handleAdd = async (license: string) => {
    if (license.length === 0) {
      return null;
    }
    setLicenses((prev) => {
      const newState = Array.from(new Set([...(prev ?? []), license]));
      setLicenses(newState);
      return newState;
    });
    await UserManager.addUserLicense(license);
    submit?.();
  };

  const handleReplace = async (replaceLicenses: string[]) => {
    setLicenses(replaceLicenses);
    await UserManager.replaceUserLicenses(replaceLicenses);
  };

  useEffect(() => {
    setLicenses(UserManager.user.licenses);
    // Singleton instance not reinitialized on rerender.
    // ! Be careful when updating the dependency list!
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [UserManager.user.licenses]);

  //-----------------------------------------------------------------------------------------------
  // ! Render
  //-----------------------------------------------------------------------------------------------
  return (
    <div className="license-manager-input">
      <MultiValueInput
        input={licenses}
        add={handleAdd}
        replace={handleReplace}
        className={`license-input ${className}`}
        placeholder={LICENSE_INPUT_PLACEHOLDER}
      />
    </div>
  );
};

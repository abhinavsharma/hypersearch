import { FunctionComponent } from 'react';

declare module './NewActionDropdown' {
  type NewActionDropdownProps = {
    handleSaveLabel: (label: any, key: any) => void;
  };

  type NewActionDropdown = FunctionComponent<NewActionDropdownProps>;
}

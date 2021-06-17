import { FunctionComponent } from 'react';

declare module './NewActionDropdown' {
  type NewActionDropdownProps = {
    handleSaveLabel: (label: ActionLabel, key: ActionKey) => void;
  };

  type NewActionDropdown = FunctionComponent<NewActionDropdownProps>;
}

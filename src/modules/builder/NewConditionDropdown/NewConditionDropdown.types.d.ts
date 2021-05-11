import { FunctionComponent } from 'react';

declare module './NewConditionDropdown' {
  type NewConditionDropdownProps = {
    newKey: any;
    handleSaveAnyCondition: (type: 'search' | 'url') => void;
    handleSaveNewLabel: (label: any, key: any, unique_key: any, evaluation: any) => void;
  };

  type NewConditionDropdown = FunctionComponent<NewConditionDropdownProps>;
}

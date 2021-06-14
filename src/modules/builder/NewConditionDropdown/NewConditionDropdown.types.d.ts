import { FunctionComponent } from 'react';

declare module './NewConditionDropdown' {
  type NewConditionDropdownProps = {
    newKey: ConditionObjectKey;
    handleSaveAnyCondition: (type: 'search' | 'url') => void;
    handleSaveNewLabel: (
      label: ConditionObjectLabel,
      key: ConditionObjectKey | ConditionObjectLegacyKey,
      unique_key: ConditionObjectKey,
      evaluation: ConditionObjectEvaluation | undefined,
    ) => void;
  };

  type NewConditionDropdown = FunctionComponent<NewConditionDropdownProps>;
}

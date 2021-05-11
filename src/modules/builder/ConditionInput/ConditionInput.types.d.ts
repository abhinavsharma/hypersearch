import { FunctionComponent } from 'react';
import { CustomCondition } from 'modules/pages';

declare module './ConditionInput' {
  type ConditionInputProps = {
    condition: CustomCondition;
    handleAnyUrl: () => void;
    handleAnySearchEngine: () => void;
    saveCondition: (e: CustomCondition) => void;
    deleteCondition: (e: CustomCondition) => void;
  };

  type ConditionInput = FunctionComponent<ConditionInputProps>;
}

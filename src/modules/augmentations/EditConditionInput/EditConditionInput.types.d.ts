import { FunctionComponent } from 'react';
import { CustomCondition } from '..';

declare module './EditConditionInput' {
  type EditConditionInputProps = {
    condition: CustomCondition;
    saveCondition: (e: CustomCondition) => void;
    deleteCondition: (e: CustomCondition) => void;
  };

  type EditConditionInput = FunctionComponent<EditConditionInputProps>;
}

import { FunctionComponent } from 'react';

declare module './EditConditionInput' {
  type EditConditionInputProps = {
    condition: ConditionObject;
    saveCondition: (e: ConditionObject) => void;
    deleteCondition: (e: ConditionObject) => void;
  };

  type EditConditionInput = FunctionComponent<EditConditionInputProps>;
}

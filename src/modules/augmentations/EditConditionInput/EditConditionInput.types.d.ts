import { FunctionComponent } from 'react';

declare module './EditConditionInput' {
  type EditConditionInputProps = {
    condition: ActionObject;
    addCondition: (e: ActionObject) => void;
    saveCondition: (e: ActionObject) => void;
    deleteCondition: (e: ActionObject) => void;
    noDelete: boolean;
    disabled: boolean;
  };

  type EditConditionInput = FunctionComponent<EditConditionInputProps>;
}

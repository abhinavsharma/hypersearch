import { FunctionComponent } from 'react';

declare module './EditActionInput' {
  type EditActionInputProps = {
    action: ActionObject;
    addAction: (e: ActionObject) => void;
    saveAction: (e: ActionObject) => void;
    deleteAction: (e: ActionObject) => void;
    noDelete: boolean;
    disabled: boolean;
  };

  type EditActionInput = FunctionComponent<EditActionInputProps>;
}

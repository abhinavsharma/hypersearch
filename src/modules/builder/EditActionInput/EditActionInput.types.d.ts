import { FunctionComponent } from 'react';
import { CustomAction } from 'modules/builder';

declare module './EditActionInput' {
  type EditActionInputProps = {
    action: CustomAction;
    saveAction: (e: CustomAction) => void;
    deleteAction: (e: CustomAction) => void;
  };

  type EditActionInput = FunctionComponent<EditActionInputProps>;
}

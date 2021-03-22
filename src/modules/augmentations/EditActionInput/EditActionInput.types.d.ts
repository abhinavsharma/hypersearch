import { FunctionComponent } from 'react';
import { CustomAction } from 'modules/augmentations';

declare module './EditActionInput' {
  type EditActionInputProps = {
    action: CustomAction;
    saveAction: (e: CustomAction) => void;
    deleteAction: (e: CustomAction) => void;
  };

  type EditActionInput = FunctionComponent<EditActionInputProps>;
}

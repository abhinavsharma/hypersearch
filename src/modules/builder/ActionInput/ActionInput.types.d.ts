import { FunctionComponent } from 'react';
import { CustomAction } from 'modules/pages';

declare module './ActionInput' {
  type ActionInputProps = {
    action: CustomAction;
    saveAction: (e: CustomAction) => void;
    deleteAction: (e: CustomAction) => void;
  };

  type ActionInput = FunctionComponent<ActionInputProps>;
}

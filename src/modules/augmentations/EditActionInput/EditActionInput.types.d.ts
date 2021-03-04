import { FunctionComponent } from 'react';

declare module './EditActionInput' {
  type EditActionInputProps = {
    action: string;
    label: string;
    saveAction: (e: string) => void;
    deleteAction: (e: string) => void;
    noDelete: boolean;
  };

  type EditActionInput = FunctionComponent<EditActionInputProps>;
}

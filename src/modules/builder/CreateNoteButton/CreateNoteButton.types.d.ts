import { FunctionComponent } from 'react';

declare module './CreateNoteButton' {
  type CreateNoteButtonProps = {
    hasNote: boolean;
  };

  type CreateNoteButton = FunctionComponent<CreateNoteButtonProps>;
}

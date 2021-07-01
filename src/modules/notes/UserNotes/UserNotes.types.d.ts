import { FunctionComponent } from 'react';

declare module './UserNotes' {
  type UrlSliceNotesProps = {
    slice: string;
  };

  type UserNotes = FunctionComponent<UrlSliceNotesProps>;
}

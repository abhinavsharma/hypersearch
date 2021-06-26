import { FunctionComponent } from 'react';

declare module './PublicationNotes' {
  type PublicationNotesProps = {
    slice: string;
    prefix: string;
    externals?: PublicationTag[];
  };

  type PublicationNotes = FunctionComponent<PublicationNotesProps>;
}

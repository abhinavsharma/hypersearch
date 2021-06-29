import { FunctionComponent } from 'react';

declare module './UrlSliceNotes' {
  type UrlSliceNotesProps = {
    slice: string;
  };

  type UrlSliceNotes = FunctionComponent<UrlSliceNotesProps>;
}

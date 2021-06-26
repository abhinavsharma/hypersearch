import { FunctionComponent } from 'react';

declare module './NotePage' {
  type NotePageProps = {
    url?: string;
    customUrl?: string;
    forceCustom?: boolean;
  };

  type NotePage = FunctionComponent<NotePageProps>;
}

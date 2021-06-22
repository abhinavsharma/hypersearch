import { FunctionComponent } from 'react';

declare module './SidebarSliceNote' {
  type SidebarSliceNoteProps = {
    slice: string;
    prefix: string;
  };

  type SidebarSliceNote = FunctionComponent<SidebarSliceNoteProps>;
}

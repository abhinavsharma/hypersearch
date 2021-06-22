import { FunctionComponent } from 'react';

declare module './SidebarNoteTab' {
  type SidebarNoteTabProps = {
    url: string;
  };

  type SidebarNoteTab = FunctionComponent<SidebarNoteTabProps>;
}

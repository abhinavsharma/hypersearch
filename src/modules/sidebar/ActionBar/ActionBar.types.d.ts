import { Dispatch, FunctionComponent, SetStateAction } from 'react';

declare module './ActionBar' {
  type ActionBarProps = {
    tab: SidebarTab;
    setActiveKey: Dispatch<SetStateAction<string>>;
  };

  type ActionBar = FunctionComponent<ActionBarProps>;
}

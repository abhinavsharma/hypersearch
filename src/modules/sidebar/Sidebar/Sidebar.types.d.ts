import { FunctionComponent, Dispatch, SetStateAction } from 'react';

declare module './Sidebar' {
  type SidebarProps = {
    url: string;
    tabs: SidebarTab[];
    suggestedAugmentations: SuggestedAugmentationObject[];
  };

  type Sidebar = FunctionComponent<SidebarProps>;

  type XIconProps = import('antd/lib/button').ButtonProps & {
    setForceTab: Dispatch<SetStateAction<string | null>>;
    numTabs: number;
  };

  type XIcon = FunctionComponent<XIconProps>;
}

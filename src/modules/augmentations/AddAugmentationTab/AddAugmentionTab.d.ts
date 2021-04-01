import { FunctionComponent, Dispatch, SetStateAction, MouseEvent } from 'react';

declare module './AddAugmentationTab' {
  type AddAugmentationTabProps = {
    active: boolean;
    setActiveKey: Dispatch<SetStateAction<string>>;
    numInstalledAugmentations: number;
    tabs: SidebarTab[];
  };

  type AddAugmentationTab = FunctionComponent<AddAugmentationTabProps>;
}

import { Dispatch, FunctionComponent, SetStateAction } from 'react';

declare module './SuggestedTabPopup' {
  type SuggestedTabPopupProps = {
    tab: SidebarTab;
    setActiveKey: Dispatch<SetStateAction<string>>;
  };

  type SuggestedTabPopup = FunctionComponent<SuggestedTabPopupProps>;
}

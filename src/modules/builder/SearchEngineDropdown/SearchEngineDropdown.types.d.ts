import { FunctionComponent } from 'react';

declare module './SearchEngineDropdown' {
  type SearchEngineDropdownProps = {
    newValue: any;
    handleSelect: (e: any) => void;
  };

  type SearchEngineDropdown = FunctionComponent<SearchEngineDropdownProps>;
}

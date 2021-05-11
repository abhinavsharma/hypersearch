import { FunctionComponent } from 'react';

declare module './SearchIntentDropdown' {
  type SearchIntentDropdownProps = {
    newValue: any;
    handleSelect: (e: any) => void;
  };

  type SearchIntentDropdown = FunctionComponent<SearchIntentDropdownProps>;
}

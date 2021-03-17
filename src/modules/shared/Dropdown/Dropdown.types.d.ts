import { FunctionComponent, ReactElement } from 'react';

declare module './Dropdown' {
  type DropdownProps = {
    icon: ReactElement | string;
    items: ReactElement[];
    className?: string;
  };

  type Dropdown = FunctionComponent<DropdownProps>;
}

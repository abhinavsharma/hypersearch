import { FunctionComponent, ReactElement } from 'react';

declare module './Dropdown' {
  type DropdownProps = {
    button: ReactElement | string;
    items: ReactElement[];
    className?: string;
    trigger?: 'hover' | 'click';
  };

  type Dropdown = FunctionComponent<DropdownProps>;
}

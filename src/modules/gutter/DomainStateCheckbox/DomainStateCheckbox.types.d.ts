import { FunctionComponent } from 'react';

declare module './DomainStateCheckbox' {
  type DomainStateCheckboxProps = {
    domain: string;
  };

  type DomainStateCheckbox = FunctionComponent<DomainStateCheckboxProps>;
}

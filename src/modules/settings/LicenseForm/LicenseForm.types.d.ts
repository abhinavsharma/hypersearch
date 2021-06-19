import { FunctionComponent } from 'react';

declare module './LicenseForm' {
  type LicenseFormProps = {
    submit?: () => void;
    className?: string;
  };

  type LicenseForm = FunctionComponent<LicenseFormProps>;
}

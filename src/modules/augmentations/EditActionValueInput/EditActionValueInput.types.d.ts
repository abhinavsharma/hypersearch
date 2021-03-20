import { FunctionComponent } from 'react';

declare module './EditActionValueInput' {
  type EditActionValueInputProps = {
    value: string;
    index: number;
    saveValue: (value: string, index: number) => void;
  };

  type EditActionValueInput = FunctionComponent<EditActionValueInputProps>;
}

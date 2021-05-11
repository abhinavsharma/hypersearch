import { FunctionComponent } from 'react';

declare module './MultiValueInput' {
  type MultiValueInputProps = {
    values: string[];
    handleAdd: (e: string[]) => void;
  };

  type MultiValueInput = FunctionComponent<MultiValueInputProps>;
}

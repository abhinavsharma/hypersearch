import { FunctionComponent } from 'react';

declare module './MultiValueInput' {
  type MultiValueInputProps = {
    input: string | string[];
    add?: (e: string) => void;
    replace?: (e: string[]) => void;
    className?: string;
    placeholder?: string;
  };

  type MultiValueInput = FunctionComponent<MultiValueInputProps>;
}

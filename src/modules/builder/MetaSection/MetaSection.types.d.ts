import { ChangeEventHandler, Dispatch, FunctionComponent, SetStateAction } from 'react';
import { CustomAugmentation } from 'modules/pages';

declare module './MetaSection' {
  type MetaSectionProps = {
    augmentation: CustomAugmentation<Augmentation>;
    name: string;
    onNameChange: ChangeEventHandler<HTMLInputElement>;
    description: string;
    onDescriptionChange: ChangeEventHandler<HTMLInputElement>;
    enabled: boolean;
    setEnabled: Dispatch<SetStateAction<boolean>>;
  };

  type MetaSection = FunctionComponent<MetaSectionProps>;
}

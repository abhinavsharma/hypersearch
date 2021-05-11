import { ChangeEventHandler, Dispatch, FunctionComponent, SetStateAction } from 'react';
import { CustomAugmentationObject } from 'modules/pages';

declare module './MetaSection' {
  type MetaSectionProps = {
    augmentation: CustomAugmentationObject<AugmentationObject>;
    name: string;
    onNameChange: ChangeEventHandler<HTMLInputElement>;
    description: string;
    onDescriptionChange: ChangeEventHandler<HTMLInputElement>;
    enabled: boolean;
    setEnabled: Dispatch<SetStateAction<boolean>>;
  };

  type MetaSection = FunctionComponent<MetaSectionProps>;
}

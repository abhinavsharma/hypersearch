import { ChangeEventHandler, Dispatch, FunctionComponent, SetStateAction } from 'react';
import { CustomAugmentationObject } from 'modules/augmentations';

declare module './EditAugmentationMeta' {
  type EditAugmentationMetaProps = {
    augmentation: CustomAugmentationObject<AugmentationObject>;
    name: string;
    onNameChange: ChangeEventHandler<HTMLInputElement>;
    description: string;
    onDescriptionChange: ChangeEventHandler<HTMLInputElement>;
    enabled: boolean;
    setEnabled: Dispatch<SetStateAction<boolean>>;
  };

  type EditAugmentationMeta = FunctionComponent<EditAugmentationMetaProps>;
}

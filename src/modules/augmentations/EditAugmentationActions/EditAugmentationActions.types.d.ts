import { FunctionComponent } from 'react';
import { CustomAction } from 'modules/augmentations';

declare module './EditAugmentationActions' {
  type TCustomAction = CustomAction;

  type EditAugmentationActionsProps = {
    actions: CustomAction[];
    onAdd: (action: CustomAction) => void;
    onSave: (action: CustomAction) => void;
    onDelete: (action: CustomAction) => void;
  };

  type EditAugmentationActions = FunctionComponent<EditAugmentationActionsProps>;
}

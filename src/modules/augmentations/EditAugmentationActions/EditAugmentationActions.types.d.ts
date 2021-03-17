import { FunctionComponent } from 'react';

declare module './EditAugmentationActions' {
  type EditAugmentationActionsProps = {
    actions: ActionObject[];
    onSave: (e: string) => void;
    onDelete: (e: string) => void;
  };

  type EditAugmentationActions = FunctionComponent<EditAugmentationActionsProps>;
}

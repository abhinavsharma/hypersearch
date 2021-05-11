import { FunctionComponent } from 'react';
import { CustomAction } from 'modules/pages';

declare module './ActionsSection' {
  type ActionsSectionProps = {
    actions: CustomAction[];
    onAdd: (action: CustomAction) => void;
    onSave: (action: CustomAction) => void;
    onDelete: (action: CustomAction) => void;
  };

  type ActionsSection = FunctionComponent<ActionsSectionProps>;
}

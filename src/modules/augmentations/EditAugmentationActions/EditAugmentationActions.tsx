import React from 'react';
import { v4 as uuid } from 'uuid';
import { EditActionInput } from 'modules/augmentations';
import 'antd/lib/button/style/index.css';
import 'antd/lib/grid/style/index.css';
import { ACTION_TYPES } from 'utils';

export const EditAugmentationActions: EditAugmentationActions = ({
  actions,
  onAdd,
  onSave,
  onDelete,
}) => {
  const newAction: TCustomAction = {
    id: uuid(),
    key: null,
    label: null,
    type: ACTION_TYPES.LIST,
    value: [''],
  };
  return (
    <>
      {actions.map((action) => (
        <EditActionInput
          key={action.id}
          action={action}
          saveAction={onSave}
          deleteAction={onDelete}
        />
      ))}
      <EditActionInput
        key={newAction.id}
        action={newAction}
        saveAction={onAdd}
        deleteAction={onDelete}
      />
    </>
  );
};

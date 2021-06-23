import React from 'react';
import { v4 as uuid } from 'uuid';
import { ActionInput } from 'modules/builder';
import { LEGACY_ACTION_TYPE } from 'constant';
import 'antd/lib/button/style/index.css';
import 'antd/lib/grid/style/index.css';

export const ActionsSection: ActionsSection = ({ actions, onAdd, onSave, onDelete }) => {
  const newAction: TCustomAction = {
    id: uuid(),
    type: LEGACY_ACTION_TYPE.LIST,
    value: [''],
  } as any;
  return (
    <>
      {actions.map((action) => (
        <ActionInput key={action.id} action={action} saveAction={onSave} deleteAction={onDelete} />
      ))}
      <ActionInput
        key={newAction.id}
        action={newAction}
        saveAction={onAdd}
        deleteAction={onDelete}
      />
    </>
  );
};

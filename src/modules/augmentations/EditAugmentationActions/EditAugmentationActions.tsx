import React from 'react';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import { EditActionInput } from 'modules/augmentations';
import 'antd/lib/grid/style/index.css';

export const EditAugmentationActions: EditAugmentationActions = ({ actions, onSave, onDelete }) => {
  return (
    <>
      {actions.map(({ value, label }) =>
        value.map((action, i) => (
          <EditActionInput
            key={`${action}-${i}`}
            label={i === 0 && label}
            action={action}
            saveAction={onSave}
            deleteAction={onDelete}
            noDelete={value.length === 1}
          />
        )),
      )}
      <EditActionInput
        label={!actions[0].value.length && 'Search only these domains'}
        action={''}
        saveAction={onSave}
        deleteAction={onDelete}
        noDelete={false}
      />
    </>
  );
};

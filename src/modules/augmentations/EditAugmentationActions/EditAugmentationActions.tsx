import React from 'react';
import Button from 'antd/lib/button';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import { v4 as uuid } from 'uuid';
import { EditActionInput } from 'modules/augmentations';
import { EMPTY_AUGMENTATION } from 'utils/constants';
import 'antd/lib/button/style/index.css';
import 'antd/lib/grid/style/index.css';

export const EditAugmentationActions: EditAugmentationActions = ({
  actions,
  onAdd,
  onSave,
  onDelete,
}) => {
  return (
    <>
      {actions.map((action) => (
        <Row className="edit-input-row no-border" key={action.id}>
          <EditActionInput action={action} saveAction={onSave} deleteAction={onDelete} />
        </Row>
      ))}
      <Row className="no-border condition-footer">
        <Col>
          <Button
            className="add-operation-button"
            type="link"
            onClick={() =>
              onAdd({
                id: uuid(),
                ...EMPTY_AUGMENTATION.actions.action_list[0],
              })
            }
          >
            ➕ Add action
          </Button>
        </Col>
      </Row>
    </>
  );
};

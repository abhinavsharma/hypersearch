import React, { useEffect, useState } from 'react';
import Button from 'antd/lib/button';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import { v4 as uuid } from 'uuid';
import { CustomAction, EditActionInput } from 'modules/augmentations';
import { EMPTY_AUGMENTATION } from 'utils/constants';
import 'antd/lib/button/style/index.css';
import 'antd/lib/grid/style/index.css';

export const EditAugmentationActions: EditAugmentationActions = ({
  actions,
  onAdd,
  onSave,
  onDelete,
}) => {
  const [filteredAction, setFilteredActions] = useState<CustomAction[]>(actions);

  useEffect(() => {
    const existingSearchDomains = actions.find((i) => i.key === 'search_domains');
    if (existingSearchDomains) {
      setFilteredActions(
        actions.filter((i) => i.id === existingSearchDomains.id || i.key !== 'search_domains'),
      );
    } else {
      setFilteredActions(actions);
    }
  }, [actions]);

  return (
    <>
      {filteredAction.map((action) => (
        <Row className="edit-input-row no-border" key={uuid()}>
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

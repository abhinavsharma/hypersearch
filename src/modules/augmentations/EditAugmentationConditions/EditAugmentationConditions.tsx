import React from 'react';
import { v4 as uuid } from 'uuid';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Button from 'antd/lib/button';
import { EditConditionInput } from 'modules/augmentations';
import { ANY_URL_CONDITION } from 'utils';
import 'antd/lib/grid/style/index.css';
import 'antd/lib/button/style/index.css';

export const EditAugmentationConditions: EditAugmentationConditions = ({
  conditions,
  setConditions,
  evaluation,
  setEvaluation,
  onSave,
  onDelete,
}) => {
  const handleAddCondition = () =>
    setConditions((prev) => [
      ...prev.filter((i) => i.key !== ANY_URL_CONDITION),
      {
        id: uuid(),
        key: null,
        type: 'list',
        label: null,
        value: [],
        isAdding: true,
      },
    ]);

  const handleMatchAnyPage = () =>
    setConditions([
      {
        id: '0',
        key: ANY_URL_CONDITION,
        label: 'Any page',
        type: 'list',
        value: ['.*'],
      },
    ]);

  return (
    <>
      <Row className="no-border">
        <Col>
          <span className="operation-description">
            <Button
              type="link"
              onClick={() => setEvaluation((prev) => (prev == 'AND' ? 'OR' : 'AND'))}
              className="insight-augmentation-edit-evaluation"
            >
              <strong>{evaluation == 'AND' ? 'All' : 'Any'}</strong>
            </Button>
            of these conditions are true
          </span>
        </Col>
      </Row>
      {conditions.map((condition) => (
        <EditConditionInput
          key={condition.id}
          condition={condition}
          saveCondition={onSave}
          deleteCondition={onDelete}
        />
      ))}
      <Row className="no-border condition-footer">
        <Button className="add-operation-button" type="link" onClick={handleAddCondition}>
          ➕ Add condition
        </Button>
        {conditions[0]?.key !== ANY_URL_CONDITION && (
          <Button type="link" onClick={handleMatchAnyPage}>
            Match any page
          </Button>
        )}
      </Row>
    </>
  );
};

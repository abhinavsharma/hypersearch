import React from 'react';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Button from 'antd/lib/button';
import { EditConditionInput } from 'modules/augmentations';
import 'antd/lib/grid/style/index.css';
import 'antd/lib/button/style/index.css';

export const EditAugmentationConditions: EditAugmentationConditions = ({
  conditions,
  setConditions,
  evaluation,
  setEvaluation,
  onAdd,
  onSave,
  onDelete,
}) => {
  return (
    <>
      <Row className="no-border">
        <Col>
          <span className="operation-description">
            If{' '}
            <Button
              type="link"
              onClick={() => setEvaluation((prev) => (prev == 'AND' ? 'OR' : 'AND'))}
              className="insight-augmentation-edit-evaluation"
            >
              <strong>{evaluation == 'AND' ? 'all' : 'any'}</strong>
            </Button>
            of these conditions are true
          </span>
        </Col>
      </Row>
      {conditions.map((condition, i) => (
        <EditConditionInput
          key={condition.value + String(i)}
          condition={condition}
          label={condition.label}
          addCondition={onAdd}
          saveCondition={onSave}
          deleteCondition={onDelete}
          noDelete={conditions.length === 1}
          disabled={!condition.value}
        />
      ))}
      <Row className="no-border condition-footer">
        <Button
          className="add-operation-button"
          type="link"
          onClick={() =>
            setConditions((prev) => [
              ...prev.filter((i) => i.key !== 'any_url'),
              {
                id: conditions.length.toString(),
                key: 'search_contains',
                type: 'list',
                label: 'Search results contain domain',
                value: [''],
                isAdding: true,
              },
            ])
          }
        >
          ➕ Add condition
        </Button>
        {conditions[0].key !== 'any_url' && (
          <Button
            type="link"
            onClick={() =>
              setConditions([
                {
                  id: '0',
                  key: 'any_url',
                  label: 'Any page',
                  type: 'list',
                  value: ['.*'],
                },
              ])
            }
          >
            Match any page
          </Button>
        )}
      </Row>
    </>
  );
};

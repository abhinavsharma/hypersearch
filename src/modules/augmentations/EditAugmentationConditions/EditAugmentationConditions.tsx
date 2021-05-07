import React from 'react';
import { v4 as uuid } from 'uuid';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Button from 'antd/lib/button';
import { EditConditionInput } from 'modules/augmentations';
import { ANY_URL_CONDITION_MOBILE, ANY_WEB_SEARCH_CONDITION } from 'utils';
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
  const newCondition = {
    id: uuid(),
    key: null,
    unique_key: null,
    type: 'list',
    label: null,
    value: [],
  };

  const handleMatchAnyPage = () =>
    setConditions([
      {
        id: '0',
        key: ANY_URL_CONDITION_MOBILE,
        unique_key: ANY_URL_CONDITION_MOBILE,
        label: 'Match any page',
        type: 'list',
        value: ['.*'],
      },
    ]);

  const handleMatchAnySearchEngine = () =>
    setConditions([
      {
        id: '0',
        key: ANY_WEB_SEARCH_CONDITION,
        unique_key: ANY_WEB_SEARCH_CONDITION,
        label: 'Match any search engine',
        type: 'list',
        value: ['.*'],
      },
    ]);

  return (
    <>
      <Row>
        <Col>
          <span>
            <Button
              type="link"
              onClick={() => setEvaluation((prev) => (prev == 'AND' ? 'OR' : 'AND'))}
              className="insight-inline-medium-text-button"
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
          handleAnySearchEngine={handleMatchAnySearchEngine}
          handleAnyUrl={handleMatchAnyPage}
          condition={condition}
          saveCondition={onSave}
          deleteCondition={onDelete}
        />
      ))}
      <EditConditionInput
        key={newCondition.id}
        handleAnySearchEngine={handleMatchAnySearchEngine}
        handleAnyUrl={handleMatchAnyPage}
        condition={newCondition}
        saveCondition={onAdd}
        deleteCondition={onDelete}
      />
    </>
  );
};

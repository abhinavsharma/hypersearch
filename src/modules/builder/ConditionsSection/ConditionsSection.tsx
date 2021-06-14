import React from 'react';
import { v4 as uuid } from 'uuid';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Button from 'antd/lib/button';
import { CONDITION_KEY, CONDITION_LABEL, CONDITION_EVALUATION, LEGACY_CONDITION_TYPE } from 'utils';
import { ConditionInput } from 'modules/builder';
import 'antd/lib/grid/style/index.css';
import 'antd/lib/button/style/index.css';

/** MAGICS **/
const AND_CONDITION_EVALUATION_TEXT = 'All';
const OR_CONDITION_EVALUATION_TEXT = 'Any';

export const ConditionsSection: ConditionsSection = ({
  conditions,
  setConditions,
  evaluation,
  setEvaluation,
  onAdd,
  onSave,
  onDelete,
}) => {
  const newCondition: TCustomCondition = {
    id: uuid(),
    type: LEGACY_CONDITION_TYPE.LIST,
    value: [],
  } as any;

  const handleMatchAnyPage = () =>
    setConditions([
      {
        id: '0',
        key: CONDITION_KEY.ANY_URL,
        unique_key: CONDITION_KEY.ANY_URL,
        label: CONDITION_LABEL.ANY_URL,
        type: LEGACY_CONDITION_TYPE.LIST,
        value: ['.*'],
      },
    ]);

  const handleMatchAnySearchEngine = () =>
    setConditions([
      {
        id: '0',
        key: CONDITION_KEY.ANY_SEARCH_ENGINE,
        unique_key: CONDITION_KEY.ANY_SEARCH_ENGINE,
        label: CONDITION_LABEL.ANY_SEARCH_ENGINE,
        type: LEGACY_CONDITION_TYPE.LIST,
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
              onClick={() =>
                setEvaluation((prev) =>
                  prev == CONDITION_EVALUATION.AND
                    ? CONDITION_EVALUATION.OR
                    : CONDITION_EVALUATION.AND,
                )
              }
              className="insight-inline-medium-text-button"
            >
              <strong>
                {evaluation == CONDITION_EVALUATION.AND
                  ? AND_CONDITION_EVALUATION_TEXT
                  : OR_CONDITION_EVALUATION_TEXT}
              </strong>
            </Button>
            of these conditions are true
          </span>
        </Col>
      </Row>
      {conditions.map((condition) => (
        <ConditionInput
          key={condition.id}
          handleAnySearchEngine={handleMatchAnySearchEngine}
          handleAnyUrl={handleMatchAnyPage}
          condition={condition}
          saveCondition={onSave}
          deleteCondition={onDelete}
        />
      ))}
      <ConditionInput
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

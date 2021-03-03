import React, { Suspense, useState } from 'react';
import { debug } from 'lumos-shared-js';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Input from 'antd/lib/input';
import Button from 'antd/lib/button';
import 'antd/lib/button/style/index.css';
import 'antd/lib/input/style/index.css';
import 'antd/lib/grid/style/index.css';

const DEFAULT_CONDITION = {
  evaluation: 'contains',
  key: 'search_contains',
  label: 'Search results contain domain',
  type: 'list',
};

const DeleteOutlined = React.lazy(
  async () => await import('@ant-design/icons/DeleteOutlined').then((mod) => mod),
);

export const EditConditionInput: EditConditionInput = ({
  condition,
  noDelete,
  deleteCondition,
  saveCondition,
  disabled,
}) => {
  const [updated, setUpdated] = useState<string>(condition.value as string);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debug('EditConditionInput - handleChange', e.target.value);
    setUpdated(e.target.value);
  };

  const handleSave = () => {
    if (disabled) {
      return null;
    }
    const updatedCondition = { ...condition, value: [updated] };
    debug('EditConditionInput - handleSave', condition, updatedCondition);
    saveCondition(updatedCondition);
  };

  const handleDelete = () => {
    debug('EditConditionInput - handleDelete', condition);
    deleteCondition(condition);
  };

  return (
    <Row className="edit-input-row">
      <Col xs={12}>{condition.label ?? DEFAULT_CONDITION.label}</Col>
      <Col xs={12}>
        <Input onChange={handleChange} value={updated} />
        <Button
          onClick={handleSave}
          className="edit-input-save-button"
          block
          type="primary"
          disabled={disabled}
        >
          <Suspense fallback={null}>
            Save <DeleteOutlined />
          </Suspense>
        </Button>
        <Button
          onClick={handleDelete}
          className="edit-input-delete-button"
          block
          danger
          type="ghost"
          disabled={noDelete}
        >
          <Suspense fallback={null}>
            Delete <DeleteOutlined />
          </Suspense>
        </Button>
      </Col>
    </Row>
  );
};

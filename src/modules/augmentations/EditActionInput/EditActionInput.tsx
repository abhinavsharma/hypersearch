import React, { Suspense, useState } from 'react';
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

export const EditActionInput: EditActionInput = ({
  action,
  noDelete,
  deleteAction,
  saveAction,
  disabled,
}) => {
  const [updated, setUpdated] = useState(action.value);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUpdated(e.target.value);
  };

  const handleSave = () => {
    if (disabled) {
      return null;
    }
    saveAction({ ...action, value: updated });
  };

  const handleDelete = () => {
    deleteAction(action);
  };

  return (
    <Row className="edit-input-row">
      <Col xs={12}>{action.label ?? DEFAULT_CONDITION.label}</Col>
      <Col xs={12}>
        <Input.TextArea onChange={handleChange} value={updated} />
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

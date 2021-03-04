import React, { Suspense, useState } from 'react';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Input from 'antd/lib/input';
import Button from 'antd/lib/button';
import 'antd/lib/button/style/index.css';
import 'antd/lib/input/style/index.css';
import 'antd/lib/grid/style/index.css';

const DEFAULT_ACTION = {
  key: 'search_domains',
  label: 'Search only these domains',
  type: 'list',
  value: [''],
};

const MinusCircleOutlined = React.lazy(
  async () => await import('@ant-design/icons/MinusCircleOutlined').then((mod) => mod),
);

const PlusCircleTwoTone = React.lazy(
  async () => await import('@ant-design/icons/PlusCircleTwoTone').then((mod) => mod),
);

export const EditActionInput: EditActionInput = ({
  action,
  label,
  noDelete,
  deleteAction,
  saveAction,
}) => {
  const [current, setCurrent] = useState(action);

  const handleSave = () => {
    if (!current.length) return null;
    saveAction(current);
    setCurrent('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrent(e.target.value);
  };

  const handleDelete = () => {
    deleteAction(action);
  };

  return (
    <Row className="edit-input-row">
      <Col>
        {!action.length ? (
          <Input onChange={handleChange} value={current} />
        ) : (
          <span>{current}</span>
        )}
        <Button
          onClick={action.length ? handleDelete : handleSave}
          className="edit-input-action-button"
          danger
          type="link"
          disabled={noDelete}
        >
          <Suspense fallback={null}>
            {action.length ? <MinusCircleOutlined /> : <PlusCircleTwoTone twoToneColor="#52c41a" />}
          </Suspense>
        </Button>
      </Col>
    </Row>
  );
};

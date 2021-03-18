import React, { Suspense, useState } from 'react';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Input from 'antd/lib/input';
import Button from 'antd/lib/button';
import 'antd/lib/button/style/index.css';
import 'antd/lib/input/style/index.css';
import 'antd/lib/grid/style/index.css';
import { useDebouncedFn } from 'beautiful-react-hooks';

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

  const handleSave = useDebouncedFn(
    (e: string) => {
      if (e.search(/^[\w\-\._]*\.[\w]{2,}$/gi) === -1) return null;
      saveAction(e);
      setCurrent('');
    },
    500,
    undefined,
    [],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrent(e.target.value);
    handleSave(e.target.value);
  };

  const handleDelete = () => {
    deleteAction(action);
  };

  return (
    <Row className="edit-input-row action">
      <Col xs={12}>{label}</Col>
      <Col xs={12}>
        {!action.length ? (
          <Input onChange={handleChange} value={current} />
        ) : (
          <span>{current}</span>
        )}
        {!!action.length && (
          <Button
            onClick={handleDelete}
            className="edit-input-action-button"
            danger
            type="link"
            disabled={noDelete}
          >
            <Suspense fallback={null}>
              <MinusCircleOutlined />
            </Suspense>
          </Button>
        )}
      </Col>
    </Row>
  );
};

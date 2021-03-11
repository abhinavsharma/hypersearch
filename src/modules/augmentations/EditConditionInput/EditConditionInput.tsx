import React, { Suspense, useState } from 'react';
import { useDebouncedFn } from 'beautiful-react-hooks';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Input from 'antd/lib/input';
import Button from 'antd/lib/button';
import 'antd/lib/button/style/index.css';
import 'antd/lib/input/style/index.css';
import 'antd/lib/grid/style/index.css';

const MinusCircleOutlined = React.lazy(
  async () => await import('@ant-design/icons/MinusCircleOutlined').then((mod) => mod),
);

export const EditConditionInput: EditConditionInput = ({
  condition,
  label,
  noDelete,
  deleteCondition,
  saveCondition,
}) => {
  const [updated, setUpdated] = useState<string>(condition.value[0]);

  const handleSave = useDebouncedFn(
    (e: string) => {
      if (!e) return null;
      const updatedCondition = { ...condition, value: [e] };
      saveCondition(updatedCondition);
    },
    350,
    undefined,
    [],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdated(e.target.value);
    handleSave(e.target.value);
  };

  const handleDelete = () => {
    deleteCondition(condition);
  };

  return (
    <Row className="edit-input-row">
      <Col xs={12}>{label}</Col>
      <Col xs={12}>
        <Input onChange={handleChange} value={updated} />
        <Button
          onClick={handleDelete}
          className="edit-input-delete-button"
          danger
          type="link"
          disabled={noDelete}
        >
          <Suspense fallback={null}>
            <MinusCircleOutlined />
          </Suspense>
        </Button>
      </Col>
    </Row>
  );
};

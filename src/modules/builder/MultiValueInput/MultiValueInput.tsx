import React, { Suspense, useState } from 'react';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';
import 'antd/lib/input/style/index.css';
import 'antd/lib/button/style/index.css';

/** MAGICS **/
const ADD_ACTION_VALUE_BUTTON_TEXT = 'Add';

const MinusCircleOutlined = React.lazy(
  async () => await import('@ant-design/icons/MinusCircleOutlined').then((mod) => mod),
);

export const MultiValueInput: MultiValueInput = ({ values, handleAdd }) => {
  const [newValue, setNewValue] = useState('');

  const handleSaveValue = (e: string, i: number) => {
    const valueToSave = values;
    valueToSave[i] = e;
    handleAdd(values);
    setNewValue('');
  };

  const handleValueDelete = (e: string) => {
    const newValues = values.filter((i) => i !== e);
    handleAdd(newValues);
  };

  const handleAddNewValue = (e: React.ChangeEvent<HTMLInputElement>) => setNewValue(e.target.value);

  const handleSaveNewValue = () => handleSaveValue(newValue, values.length);

  const valueStyle = { display: "flex", alignItems: "center",}

  return (
    <div className="insight-list">
      {values.map((value, i) => {
        const handleDelete = () => handleValueDelete(value);
        return (
          <div key={value + i} style={valueStyle} >
            <Button onClick={handleDelete} danger type="link">
              <Suspense fallback={null}>
                <MinusCircleOutlined />
              </Suspense>
            </Button>
            <span>{value}</span>
          </div>
        );
      })}
      <Input.Search
        enterButton={ADD_ACTION_VALUE_BUTTON_TEXT}
        value={newValue}
        onChange={handleAddNewValue}
        onSearch={handleSaveNewValue}
      />
    </div>
  );
};

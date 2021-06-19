import React, { Suspense, useState } from 'react';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';
import 'antd/lib/input/style/index.css';
import 'antd/lib/button/style/index.css';

const MinusCircleOutlined = React.lazy(
  async () => await import('@ant-design/icons/MinusCircleOutlined').then((mod) => mod),
);

/** MAGICS **/
const ADD_ACTION_VALUE_BUTTON_TEXT = 'Add';

export const MultiValueInput: MultiValueInput = ({
  input,
  add,
  replace,
  className,
  placeholder,
}) => {
  const [newValue, setNewValues] = useState('');

  const handleSaveValue = () => {
    const newValues = input;
    if (Array.isArray(newValues) && Array.isArray(input)) {
      newValues[input.length] = newValue;
      replace?.(newValues);
    }
    typeof input === 'string' && add?.(input);
    setNewValues('');
  };

  const handleValueDelete = (removeValue: string) => {
    if (Array.isArray(input)) {
      replace?.(input.filter((value) => value !== removeValue));
    }
  };

  const handleAddNewValue = (e: React.ChangeEvent<HTMLInputElement>) =>
    setNewValues(e.target.value);

  const valueStyle = { display: 'flex', alignItems: 'center' };

  return (
    <div className={`insight-list ${className}`}>
      {typeof input !== 'string' &&
        input.map((value, i) => {
          const handleDelete = () => handleValueDelete(value);
          return (
            <div key={value + i} style={valueStyle}>
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
        placeholder={placeholder}
        enterButton={ADD_ACTION_VALUE_BUTTON_TEXT}
        value={newValue}
        onChange={handleAddNewValue}
        onSearch={handleSaveValue}
      />
    </div>
  );
};

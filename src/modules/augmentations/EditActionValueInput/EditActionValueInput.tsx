import React, { ChangeEvent, useState } from 'react';
import { useDebouncedFn } from 'beautiful-react-hooks';
import Input from 'antd/lib/input';
import 'antd/lib/input/style/index.css';

export const EditActionValueInput: EditActionValueInput = ({ value, saveValue, index }) => {
  const [updated, setUpdated] = useState(value);

  const handleSave = useDebouncedFn(
    (e: string) => {
      if (!e) return null;
      saveValue(e, index);
    },
    1000,
    undefined,
    [],
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUpdated(e.target.value);
    handleSave(e.target.value);
  };

  return <Input className="add-action-value-input" value={updated} onChange={handleChange} />;
};

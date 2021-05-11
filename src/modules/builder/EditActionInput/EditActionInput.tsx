import React, { Suspense, useRef, useState } from 'react';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Button from 'antd/lib/button';
import Select from 'antd/lib/select';
import Input from 'antd/lib/input';
import { ACTION_KEYS, ACTION_LABELS, LEGACY_KEYS } from 'utils/constants';
import 'antd/lib/input/style/index.css';
import 'antd/lib/button/style/index.css';
import 'antd/lib/grid/style/index.css';
import 'antd/lib/select/style/index.css';

/** MAGICS **/
const NEW_ACTION_PLACEHOLDER = 'Add new action';
const ADD_ACTION_VALUE_BUTTON_TEXT = 'Add';

const { Option } = Select;

const MinusCircleOutlined = React.lazy(
  async () => await import('@ant-design/icons/MinusCircleOutlined').then((mod) => mod),
);

const ACTIONS = {
  [ACTION_LABELS.SEARCH_DOMAINS]: ACTION_KEYS.SEARCH_DOMAINS,
  [ACTION_LABELS.OPEN_URL]: ACTION_KEYS.OPEN_URL,
  [ACTION_LABELS.SEARCH_HIDE_DOMAIN]: ACTION_KEYS.SEARCH_HIDE_DOMAIN,
  [ACTION_LABELS.SEARCH_APPEND]: ACTION_KEYS.SEARCH_APPEND,
};

export const EditActionInput: EditActionInput = ({ action, saveAction, deleteAction }) => {
  const [newValue, setNewValue] = useState('');
  const [newKey, setNewKey] = useState<ACTION_KEYS | LEGACY_KEYS>(action?.key);
  const [newLabel, setNewLabel] = useState<ACTION_LABELS>(action?.label);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSaveValue = (e: string, i: number) => {
    const valueToSave = action.value;
    valueToSave[i] = e;
    saveAction({ ...action, label: newLabel, key: newKey, value: valueToSave });
    setNewValue('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewValue(e.target.value);
    saveAction({ ...action, label: newLabel, key: newKey, value: [e.target.value] });
  };

  const handleValueDelete = (e: string) => {
    const newValue = action.value.filter((i) => i !== e);
    saveAction({ ...action, value: newValue });
  };

  const handleLabelChange = (label: ACTION_LABELS) => {
    setNewLabel(label);
    setNewKey(ACTIONS[label]);
    saveAction({
      ...action,
      label,
      key: ACTIONS[label],
      value: [],
    });
  };

  const handleAddNewValue = (e: React.ChangeEvent<HTMLInputElement>) => setNewValue(e.target.value);

  const handleSaveNewValue = () => handleSaveValue(newValue, action.value.length);

  const handleDelete = () => deleteAction(action);

  const getPopupContainer = () => dropdownRef.current;

  return (
    <Row className="insight-large-input-row">
      <Col xs={!action.key ? 24 : 12} className="insight-large-input-row-content">
        {!action.key ? (
          <Select
            className="insight-select-full-width"
            dropdownClassName="insight-select-full-width-dropdown"
            placeholder={NEW_ACTION_PLACEHOLDER}
            onChange={handleLabelChange}
            getPopupContainer={getPopupContainer}
          >
            {Object.keys(ACTIONS).map((key) => (
              <Option key={key} value={key}>
                {key}
              </Option>
            ))}
          </Select>
        ) : (
          <>
            <Button onClick={handleDelete} danger type="link">
              <Suspense fallback={null}>
                <MinusCircleOutlined />
              </Suspense>
            </Button>
            <span>{action.label}</span>
          </>
        )}
      </Col>
      <Col xs={12} className="insight-large-input-row-content insight-list">
        {newKey === ACTION_KEYS.SEARCH_DOMAINS &&
          action.value.map((value, i) => (
            <div key={value + i}>
              <Button onClick={() => handleValueDelete(value)} danger type="link">
                <Suspense fallback={null}>
                  <MinusCircleOutlined />
                </Suspense>
              </Button>
              <span>{value}</span>
            </div>
          ))}
        {newKey === ACTION_KEYS.SEARCH_DOMAINS ? (
          <Input.Search
            enterButton={ADD_ACTION_VALUE_BUTTON_TEXT}
            value={newValue}
            onChange={handleAddNewValue}
            onSearch={handleSaveNewValue}
          />
        ) : (
          newKey && <Input key={action.id} value={action.value} onChange={handleChange} />
        )}
      </Col>
      <div className="insight-relative" ref={dropdownRef} />
    </Row>
  );
};

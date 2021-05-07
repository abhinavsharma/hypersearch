import React, { Suspense, useRef, useState } from 'react';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Button from 'antd/lib/button';
import Select from 'antd/lib/select';
import Input from 'antd/lib/input';
import {
  OPEN_URL_ACTION,
  SEARCH_APPEND_ACTION,
  SEARCH_DOMAINS_ACTION,
  SEARCH_HIDE_DOMAIN_ACTION,
} from 'utils';
import 'antd/lib/input/style/index.css';
import 'antd/lib/button/style/index.css';
import 'antd/lib/grid/style/index.css';
import 'antd/lib/select/style/index.css';

const { Option } = Select;

const MinusCircleOutlined = React.lazy(
  async () => await import('@ant-design/icons/MinusCircleOutlined').then((mod) => mod),
);

const ACTION_LABELS = {
  'Search only these domains': SEARCH_DOMAINS_ACTION,
  'Open page': OPEN_URL_ACTION,
  'Hide results from domain': SEARCH_HIDE_DOMAIN_ACTION,
  'Seach with string appended': SEARCH_APPEND_ACTION,
};

export const EditActionInput: EditActionInput = ({ action, saveAction, deleteAction }) => {
  const [newValue, setNewValue] = useState('');
  const [newKey, setNewKey] = useState<string>(action?.key);
  const [newLabel, setNewLabel] = useState<string>(action?.label);
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

  const handleLabelChange = (label: string) => {
    setNewLabel(label);
    setNewKey(ACTION_LABELS[label]);
    saveAction({
      ...action,
      label,
      key: ACTION_LABELS[label],
      value: [],
    });
  };

  return (
    <Row className="large-input-row">
      <Col xs={!action.key ? 24 : 12} className="large-input-row-content">
        {!action.key ? (
          <Select
            style={{ width: '100%' }}
            className="select-full-width"
            dropdownClassName="select-full-width-dropdown"
            placeholder="Add new action"
            onChange={handleLabelChange}
            getPopupContainer={() => dropdownRef.current}
          >
            {Object.keys(ACTION_LABELS).map((key) => (
              <Option key={key} value={key}>
                {key}
              </Option>
            ))}
          </Select>
        ) : (
          <>
            <Button onClick={() => deleteAction(action)} danger type="link">
              <Suspense fallback={null}>
                <MinusCircleOutlined />
              </Suspense>
            </Button>
            <span>{action.label}</span>
          </>
        )}
      </Col>
      <Col xs={12} className="large-input-row-content list">
        {newKey === SEARCH_DOMAINS_ACTION &&
          action.value.map((value, i) => (
            <div key={value + i} style={{ display: 'flex', alignItems: 'center' }}>
              <Button onClick={() => handleValueDelete(value)} danger type="link">
                <Suspense fallback={null}>
                  <MinusCircleOutlined />
                </Suspense>
              </Button>
              <span>{value}</span>
            </div>
          ))}
        {newKey === SEARCH_DOMAINS_ACTION ? (
          <Input.Search
            enterButton="Add"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            onSearch={() => handleSaveValue(newValue, action.value.length)}
          />
        ) : (
          newKey && <Input key={action.id} value={action.value} onChange={handleChange} />
        )}
      </Col>
      <div className="relative" ref={dropdownRef} />
    </Row>
  );
};

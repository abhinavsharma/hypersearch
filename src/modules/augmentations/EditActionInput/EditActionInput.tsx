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
import './EditActionInput.scss';

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
    <Row className={action.key ? 'edit-input-row' : 'edit-input-row edit-input-new-item-row'}>
      <Col xs={!action.key ? 24 : 12} className="action-value-col">
        {!action.key ? (
          <Select
            style={{ width: '100%' }}
            className="label-select"
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
          <div className="edit-input-row">
            <Button
              onClick={() => deleteAction(action)}
              className="edit-input-delete-button"
              danger
              type="link"
            >
              <Suspense fallback={null}>
                <MinusCircleOutlined />
              </Suspense>
            </Button>
            <span>{action.label}</span>
          </div>
        )}
      </Col>
      <Col xs={12} className="action-value-col">
        {newKey === SEARCH_DOMAINS_ACTION &&
          action.value.map((value, i) => (
            <div key={value + i} className="action-value-row">
              <span>{value.slice(0, 25) + (value.length > 25 ? '...' : '')}</span>
              <Button
                onClick={() => handleValueDelete(value)}
                className="edit-input-delete-button"
                danger
                type="link"
              >
                <Suspense fallback={null}>
                  <MinusCircleOutlined />
                </Suspense>
              </Button>
            </div>
          ))}
        {newKey === SEARCH_DOMAINS_ACTION ? (
          <Row className="no-border edit-input-row">
            <Input.Search
              enterButton="Add"
              className="add-action-value-input"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              onSearch={() => handleSaveValue(newValue, action.value.length)}
            />
          </Row>
        ) : (
          newKey && (
            <Row className="no-border edit-input-row">
              <Input
                key={action.id}
                className="add-action-value-input"
                value={action.value}
                onChange={handleChange}
              />
            </Row>
          )
        )}
      </Col>
      <div className="relative" ref={dropdownRef} />
    </Row>
  );
};

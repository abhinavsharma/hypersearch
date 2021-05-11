import React, { ReactElement, Suspense, useRef, useState } from 'react';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';
import { NewActionDropdown, MultiValueInput } from 'modules/builder';
import { ACTION_KEYS, ACTION_LABELS } from 'utils/constants';
import 'antd/lib/input/style/index.css';
import 'antd/lib/button/style/index.css';
import 'antd/lib/grid/style/index.css';

const MinusCircleOutlined = React.lazy(
  async () => await import('@ant-design/icons/MinusCircleOutlined').then((mod) => mod),
);

export const EditActionInput: EditActionInput = ({ action, saveAction, deleteAction }) => {
  const [newKey, setNewKey] = useState<Partial<ACTION_KEYS>>(action?.key);
  const [newLabel, setNewLabel] = useState<ACTION_LABELS>(action?.label);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | string[]) => {
    saveAction({
      ...action,
      label: newLabel,
      key: newKey,
      value: Array.isArray(e) ? e : [e.target.value],
    });
  };

  const handleSaveLabel = (label: ACTION_LABELS, key: ACTION_KEYS) => {
    setNewLabel(label);
    setNewKey(key);
    saveAction({
      ...action,
      label,
      key,
      value: [],
    });
  };

  const handleDelete = () => deleteAction(action);

  const DEFAULT_INPUTS = [
    ACTION_KEYS.OPEN_URL,
    ACTION_KEYS.SEARCH_APPEND,
    ACTION_KEYS.SEARCH_HIDE_DOMAIN,
  ];

  const INPUTS: Partial<Record<Partial<ACTION_KEYS | 'default'>, ReactElement>> = {
    [ACTION_KEYS.SEARCH_DOMAINS]: (
      <MultiValueInput values={action.value} handleAdd={handleChange} />
    ),
    default: <Input key={action.id} value={action.value} onChange={handleChange} />,
  };

  return (
    <Row className="insight-large-input-row">
      <Col xs={!action.key ? 24 : 12} className="insight-large-input-row-content">
        {!action.key ? (
          <NewActionDropdown handleSaveLabel={handleSaveLabel} />
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
        {DEFAULT_INPUTS.includes(newKey) || INPUTS[newKey as ACTION_KEYS]
          ? INPUTS[DEFAULT_INPUTS.includes(newKey) ? 'default' : newKey]
          : null}
      </Col>
      <div className="insight-relative" ref={dropdownRef} />
    </Row>
  );
};

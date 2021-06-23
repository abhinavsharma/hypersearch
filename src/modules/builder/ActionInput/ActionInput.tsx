import React, { Suspense, useRef, useState } from 'react';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';
import { ACTION_KEY, ACTION_LABEL } from 'constant';
import { NewActionDropdown, MultiValueInput, SearchEngineDropdown } from 'modules/builder';
import 'antd/lib/input/style/index.css';
import 'antd/lib/button/style/index.css';
import 'antd/lib/grid/style/index.css';

type TSelect = Record<'key' | 'value' | 'label', string>;

const MinusCircleOutlined = React.lazy(
  async () => await import('@ant-design/icons/MinusCircleOutlined').then((mod) => mod),
);
export const ActionInput: ActionInput = ({ action, saveAction, deleteAction }) => {
  const [newValue, setNewValue] = useState<any>(action?.value[0]);
  const [newKey, setNewKey] = useState<Partial<ActionKey>>(action?.key);
  const [newLabel, setNewLabel] = useState<ActionLabel>(action?.label);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | string[]) => {
    saveAction({
      ...action,
      label: newLabel,
      key: newKey,
      value: Array.isArray(e) ? e : [e.target.value],
    });
  };

  const handleSaveLabel = (label: ActionLabel, key: ActionKey) => {
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

  const handleSelect = (e: TSelect) => {
    const updated = JSON.parse(e.value);
    setNewValue({ value: JSON.stringify(updated), key: e.label, label: e.label });
    handleChange([updated]);
  };

  const DEFAULT_INPUTS: ActionKey[] = [
    ACTION_KEY.OPEN_URL,
    ACTION_KEY.SEARCH_FEATURE,
    ACTION_KEY.SEARCH_APPEND,
    ACTION_KEY.SEARCH_HIDE_DOMAIN,
    ACTION_KEY.OPEN_LINK_CSS,
    ACTION_KEY.NO_COOKIE,
  ];

  const INPUTS: KeyEventMap<ActionKey> = {
    [ACTION_KEY.SEARCH_DOMAINS]: (
      <MultiValueInput values={action.value as string[]} handleAdd={handleChange} />
    ),
    [ACTION_KEY.SEARCH_ALSO]: (
      <SearchEngineDropdown
        newValue={newValue}
        handleSelect={handleSelect}
        placeholder={ACTION_LABEL.SEARCH_ALSO}
      />
    ),
    default: <Input key={action.id} value={action.value as string[]} onChange={handleChange} />,
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
        {DEFAULT_INPUTS.includes(newKey) || INPUTS[newKey]
          ? INPUTS[DEFAULT_INPUTS.includes(newKey) ? 'default' : newKey]
          : null}
      </Col>
      <div className="insight-relative" ref={dropdownRef} />
    </Row>
  );
};

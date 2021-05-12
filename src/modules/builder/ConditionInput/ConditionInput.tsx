import React, { ReactElement, Suspense, useState } from 'react';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Input from 'antd/lib/input';
import Button from 'antd/lib/button';
import { CONDITION_KEYS, CONDITION_LABELS, LEGACY_KEYS, LEGACY_EVALUATION } from 'utils';
import {
  MultiValueInput,
  NewConditionDropdown,
  SearchEngineDropdown,
  SearchIntentDropdown,
} from 'modules/builder';
import 'antd/lib/select/style/index.css';
import 'antd/lib/button/style/index.css';
import 'antd/lib/input/style/index.css';
import 'antd/lib/grid/style/index.css';

type TSelect = Record<'key' | 'value' | 'label', string>;

const MinusCircleOutlined = React.lazy(
  async () => await import('@ant-design/icons/MinusCircleOutlined').then((mod) => mod),
);

export const ConditionInput: ConditionInput = ({
  condition,
  saveCondition,
  deleteCondition,
  handleAnyUrl,
  handleAnySearchEngine,
}) => {
  const [newKey, setNewKey] = useState<Partial<CONDITION_KEYS | LEGACY_KEYS>>(
    condition?.unique_key ?? condition.key,
  );
  const [newLabel, setNewLabel] = useState<CONDITION_LABELS>(condition?.label as CONDITION_LABELS);
  const [newValue, setNewValue] = useState<any>(condition?.value[0]);

  const getLegacyProps = () => {
    const key =
      ((newKey === CONDITION_KEYS.URL_EQUALS ||
        newKey === CONDITION_KEYS.URL_MATCHES ||
        newKey === CONDITION_KEYS.ANY_URL) &&
        LEGACY_KEYS.URL) ||
      ((newKey === CONDITION_KEYS.DOMAIN_EQUALS || newKey === CONDITION_KEYS.DOMAIN_MATCHES) &&
        LEGACY_KEYS.DOMAIN) ||
      (newKey as LEGACY_KEYS);

    const evaluation =
      ((newKey === CONDITION_KEYS.URL_EQUALS || newKey === CONDITION_KEYS.DOMAIN_EQUALS) &&
        LEGACY_EVALUATION.EQUALS) ||
      ((newKey === CONDITION_KEYS.URL_MATCHES || newKey === CONDITION_KEYS.DOMAIN_MATCHES) &&
        LEGACY_EVALUATION.MATCHES) ||
      (newKey === CONDITION_KEYS.ANY_URL && LEGACY_EVALUATION.ANY) ||
      undefined;

    return { key, evaluation };
  };

  const handleSave = (value?: string) => {
    const { key, evaluation } = getLegacyProps();
    const newCondition = {
      ...condition,
      key,
      evaluation,
      unique_key: newKey as CONDITION_KEYS,
      label: newLabel,
      value: [value ?? newValue],
    };
    saveCondition(newCondition);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | string[]) => {
    const { key, evaluation } = getLegacyProps();
    setNewValue(Array.isArray(e) ? e : [e.target.value]);
    const newCondition = {
      ...condition,
      key,
      evaluation,
      unique_key: newKey as CONDITION_KEYS,
      label: newLabel,
      value: Array.isArray(e) ? e : [e.target.value],
    };
    saveCondition(newCondition);
  };

  const handleDelete = () => {
    deleteCondition(condition);
  };

  const handleSelect = (e: TSelect) => {
    const updated = newKey === CONDITION_KEYS.SEARCH_ENGINE_IS ? JSON.parse(e.value) : e;
    setNewValue(
      newKey === CONDITION_KEYS.SEARCH_ENGINE_IS
        ? { value: JSON.stringify(updated), key: e.label, label: e.label }
        : e,
    );
    handleSave(updated);
  };

  const handleSaveNewLabel = (
    label: CONDITION_LABELS,
    key: CONDITION_KEYS | LEGACY_KEYS,
    unique_key: CONDITION_KEYS,
    evaluation: LEGACY_EVALUATION,
  ) => {
    setNewLabel(label);
    setNewKey(unique_key);
    saveCondition({
      ...condition,
      key,
      evaluation,
      label,
      unique_key,
      value: [],
    });
  };

  const handleSaveAnyCondition = (type: 'search' | 'url') => {
    type === 'search' && handleAnySearchEngine();
    type === 'url' && handleAnyUrl();
  };

  const DEFAULT_INPUTS = [
    CONDITION_KEYS.SEARCH_CONTAINS,
    CONDITION_KEYS.SEARCH_QUERY_CONTAINS,
    CONDITION_KEYS.URL_EQUALS,
    CONDITION_KEYS.URL_MATCHES,
    CONDITION_KEYS.DOMAIN_EQUALS,
    CONDITION_KEYS.DOMAIN_MATCHES,
  ];

  const INPUTS: Partial<Record<Partial<CONDITION_KEYS | LEGACY_KEYS | 'default'>, ReactElement>> = {
    [CONDITION_KEYS.SEARCH_ENGINE_IS]: (
      <SearchEngineDropdown handleSelect={handleSelect} newValue={newValue} />
    ),
    [CONDITION_KEYS.SEARCH_INTENT_IS]: (
      <SearchIntentDropdown handleSelect={handleSelect} newValue={newValue} />
    ),
    [CONDITION_KEYS.DOMAIN_CONTAINS]: (
      <MultiValueInput values={condition.value} handleAdd={handleChange} />
    ),
    default: <Input key={condition.id} onChange={handleChange} value={newValue as string} />,
  };

  return (
    <Row className="insight-large-input-row">
      <Col xs={!newKey ? 24 : 12} className="insight-large-input-row-content">
        {!newKey ? (
          <NewConditionDropdown
            newKey={newKey}
            handleSaveAnyCondition={handleSaveAnyCondition}
            handleSaveNewLabel={handleSaveNewLabel}
          />
        ) : (
          <>
            <Button onClick={handleDelete} danger type="link">
              <Suspense fallback={null}>
                <MinusCircleOutlined />
              </Suspense>
            </Button>
            <span>{condition.label}</span>
          </>
        )}
      </Col>
      <Col xs={12} className="insight-large-input-row-content">
        {DEFAULT_INPUTS.includes(newKey as CONDITION_KEYS) || INPUTS[newKey]
          ? INPUTS[DEFAULT_INPUTS.includes(newKey as CONDITION_KEYS) ? 'default' : newKey]
          : null}
      </Col>
    </Row>
  );
};

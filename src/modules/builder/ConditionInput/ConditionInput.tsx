import React, { Suspense, useState } from 'react';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Input from 'antd/lib/input';
import Button from 'antd/lib/button';
import { CONDITION_KEY, LEGACY_KEY, LEGACY_EVALUATION } from 'constant';
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
  const [newKey, setNewKey] = useState<ConditionKey>(condition?.unique_key ?? condition.key);
  const [newLabel, setNewLabel] = useState<ConditionObjectLabel>(condition?.label);
  const [newValue, setNewValue] = useState<any>(condition?.value[0]);

  const getLegacyProps = () => {
    const key =
      ((newKey === CONDITION_KEY.URL_EQUALS ||
        newKey === CONDITION_KEY.URL_MATCHES ||
        newKey === CONDITION_KEY.ANY_URL) &&
        LEGACY_KEY.URL) ||
      ((newKey === CONDITION_KEY.DOMAIN_EQUALS || newKey === CONDITION_KEY.DOMAIN_MATCHES) &&
        LEGACY_KEY.DOMAIN) ||
      newKey;

    const evaluation =
      ((newKey === CONDITION_KEY.URL_EQUALS || newKey === CONDITION_KEY.DOMAIN_EQUALS) &&
        LEGACY_EVALUATION.EQUALS) ||
      ((newKey === CONDITION_KEY.URL_MATCHES || newKey === CONDITION_KEY.DOMAIN_MATCHES) &&
        LEGACY_EVALUATION.MATCHES) ||
      (newKey === CONDITION_KEY.ANY_URL && LEGACY_EVALUATION.ANY) ||
      undefined;

    return { key, evaluation };
  };

  const handleSave = (value?: string) => {
    const { key, evaluation } = getLegacyProps();
    const newCondition = {
      ...condition,
      key,
      evaluation,
      unique_key: newKey,
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
      unique_key: newKey,
      label: newLabel,
      value: Array.isArray(e) ? e : [e.target.value],
    };
    saveCondition(newCondition);
  };

  const handleDelete = () => {
    deleteCondition(condition);
  };

  const handleSelect = (e: TSelect) => {
    const updated = newKey === CONDITION_KEY.SEARCH_ENGINE_IS ? JSON.parse(e.value) : e;
    setNewValue(
      newKey === CONDITION_KEY.SEARCH_ENGINE_IS
        ? { value: JSON.stringify(updated), key: e.label, label: e.label }
        : e,
    );
    handleSave(updated);
  };

  const handleSaveNewLabel = (
    label: ConditionObjectLabel,
    key: ConditionObjectKey | ConditionObjectLegacyKey,
    unique_key: ConditionObjectKey,
    evaluation: ConditionEvaluation,
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

  const DEFAULT_INPUTS: string[] = [
    CONDITION_KEY.SEARCH_CONTAINS,
    CONDITION_KEY.SEARCH_QUERY_CONTAINS,
    CONDITION_KEY.URL_EQUALS,
    CONDITION_KEY.URL_MATCHES,
    CONDITION_KEY.DOMAIN_EQUALS,
    CONDITION_KEY.DOMAIN_MATCHES,
  ];

  const INPUTS: KeyEventMap<ConditionObjectKey> = {
    [CONDITION_KEY.SEARCH_ENGINE_IS]: (
      <SearchEngineDropdown handleSelect={handleSelect} newValue={newValue} />
    ),
    [CONDITION_KEY.SEARCH_INTENT_IS]: (
      <SearchIntentDropdown handleSelect={handleSelect} newValue={newValue} />
    ),
    [CONDITION_KEY.DOMAIN_CONTAINS]: (
      <MultiValueInput values={condition.value as string[]} handleAdd={handleChange} />
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
        {DEFAULT_INPUTS.includes(newKey) || INPUTS[newKey]
          ? INPUTS[DEFAULT_INPUTS.includes(newKey) ? 'default' : newKey]
          : null}
      </Col>
    </Row>
  );
};

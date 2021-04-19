import React, { Suspense, useEffect, useRef, useState } from 'react';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Input from 'antd/lib/input';
import Button from 'antd/lib/button';
import Select, { OptionProps } from 'antd/lib/select';
import SearchEngineManager from 'lib/SearchEngineManager/SearchEngineManager';
import 'antd/lib/select/style/index.css';
import 'antd/lib/button/style/index.css';
import 'antd/lib/input/style/index.css';
import 'antd/lib/grid/style/index.css';
import {
  SEARCH_CONTAINS_CONDITION,
  SEARCH_QUERY_CONTAINS_CONDITION,
  ANY_URL_CONDITION,
  SEARCH_INTENT_IS_CONDITION,
  SIDEBAR_Z_INDEX,
  SEARCH_ENGINE_IS_CONDITION,
} from 'utils';

const { OptGroup, Option } = Select;

const MinusCircleOutlined = React.lazy(
  async () => await import('@ant-design/icons/MinusCircleOutlined').then((mod) => mod),
);

const SEARCH_CONDITION_LABELS = {
  'Search results contain domain': SEARCH_CONTAINS_CONDITION,
  'Search query contains': SEARCH_QUERY_CONTAINS_CONDITION,
  'Search intent is': SEARCH_INTENT_IS_CONDITION,
  'Search engine is': SEARCH_ENGINE_IS_CONDITION,
};

const OTHER_CONDITION_LABELS = {
  'Match any page (removes other conditions)': ANY_URL_CONDITION,
};

export const EditConditionInput: EditConditionInput = ({
  condition,
  saveCondition,
  deleteCondition,
  handleAnyUrl,
}) => {
  const [newKey, setNewKey] = useState<string>(condition?.key);
  const [newLabel, setNewLabel] = useState<string>(condition?.label);
  const [newValue, setNewValue] = useState<any>(condition?.value[0]);
  const [intents, setIntents] = useState<any[]>();
  const [engines, setEngines] = useState<Record<string, CustomSearchEngine>>(Object.create(null));
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIntents(SearchEngineManager.intents);
  }, [SearchEngineManager.intents]);

  useEffect(() => {
    setEngines(SearchEngineManager.engines);
  }, [SearchEngineManager.engines]);

  const handleSave = (value?: string) => {
    const newCondition = { ...condition, key: newKey, label: newLabel, value: [value ?? newValue] };
    saveCondition(newCondition);
  };

  const handleChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    setNewValue(value);
    const newCondition = { ...condition, key: newKey, label: newLabel, value: [value] };
    saveCondition(newCondition);
  };

  const handleDelete = () => {
    deleteCondition(condition);
  };

  const handleFilter = (inputValue: string, { label }: OptionProps) => {
    return label.toLowerCase().search(inputValue.toLowerCase()) > -1;
  };

  const handleSelect = (e) => {
    const updated = newKey === SEARCH_ENGINE_IS_CONDITION ? JSON.parse(e.value) : e;
    setNewValue(
      newKey === SEARCH_ENGINE_IS_CONDITION
        ? { value: JSON.stringify(updated), key: e.label, label: e.label }
        : e,
    );
    handleSave(updated);
  };

  const handleLabelChange = (label: string) => {
    if (SEARCH_CONDITION_LABELS[label]) {
      setNewLabel(label);
      setNewKey(SEARCH_CONDITION_LABELS[label]);
      saveCondition({
        ...condition,
        label,
        key: SEARCH_CONDITION_LABELS[label],
        value: [],
      });
    }
    OTHER_CONDITION_LABELS[label] === ANY_URL_CONDITION && handleAnyUrl();
  };

  return (
    <>
      <Row className={newKey ? 'edit-input-row' : 'edit-input-row edit-input-new-item-row'}>
        <Col xs={!newKey ? 24 : 12} className="condition-label">
          {!newKey ? (
            <Select
              style={{ width: '100%' }}
              className="label-select"
              placeholder="Add new condition"
              onChange={handleLabelChange}
              getPopupContainer={() => dropdownRef.current}
            >
              <OptGroup label="Search">
                {Object.keys(SEARCH_CONDITION_LABELS).map((key) => (
                  <Option key={key} value={key}>
                    {key}
                  </Option>
                ))}
              </OptGroup>
              <OptGroup label="Other">
                OTHER_CONDITION_LABELS
                {Object.keys(OTHER_CONDITION_LABELS).map((key) => (
                  <Option key={key} value={key}>
                    {key}
                  </Option>
                ))}
              </OptGroup>
            </Select>
          ) : (
            <>
              <Button
                onClick={handleDelete}
                className="edit-input-delete-button"
                danger
                type="link"
              >
                <Suspense fallback={null}>
                  <MinusCircleOutlined />
                </Suspense>
              </Button>
              <span>{condition.label}</span>
            </>
          )}
        </Col>
        <Col xs={11} className="value-col">
          {(() => {
            switch (newKey) {
              case SEARCH_INTENT_IS_CONDITION:
              case SEARCH_ENGINE_IS_CONDITION:
                return (
                  <Select
                    showSearch
                    labelInValue={newKey === SEARCH_ENGINE_IS_CONDITION}
                    value={(() => {
                      if (newKey === SEARCH_ENGINE_IS_CONDITION) {
                        const [label, value] =
                          Object.entries(engines)?.find(([, entry]) => {
                            const updatedValue =
                              typeof newValue?.value === 'string'
                                ? JSON.parse(newValue.value)
                                : newValue;
                            const hasAllParams = updatedValue?.required_params?.every((param) =>
                              entry.search_engine_json?.required_params?.includes(param),
                            );
                            const hasPrefix =
                              entry.search_engine_json?.required_prefix ===
                              updatedValue?.required_prefix;
                            return hasAllParams && hasPrefix;
                          }) ?? [];
                        return {
                          key: label,
                          value: JSON.stringify(value?.search_engine_json),
                          label,
                        };
                      }
                      return newValue;
                    })()}
                    placeholder={(() => {
                      switch (newKey) {
                        case SEARCH_INTENT_IS_CONDITION:
                          return 'Search for intents...';
                        case SEARCH_ENGINE_IS_CONDITION:
                          return 'Select search engine...';
                      }
                    })()}
                    dropdownClassName="search-dropdown"
                    className="search-dropdown-block"
                    filterOption={handleFilter}
                    onChange={handleSelect}
                    getPopupContainer={() => dropdownRef.current}
                  >
                    {(() => {
                      switch (newKey) {
                        case SEARCH_INTENT_IS_CONDITION:
                          return (
                            intents?.map(({ name, intent_id }) => (
                              <Option
                                key={name}
                                value={intent_id}
                                style={{ zIndex: SIDEBAR_Z_INDEX + 1 }}
                              >
                                {name}
                              </Option>
                            )) ?? null
                          );
                        case SEARCH_ENGINE_IS_CONDITION:
                          return (
                            Object.entries(engines).map(([key, cse]) => (
                              <Option
                                key={key}
                                value={JSON.stringify(cse.search_engine_json)}
                                style={{ zIndex: SIDEBAR_Z_INDEX + 1 }}
                              >
                                {key}
                              </Option>
                            )) ?? null
                          );
                      }
                    })()}
                  </Select>
                );
              case SEARCH_CONTAINS_CONDITION:
              case SEARCH_QUERY_CONTAINS_CONDITION:
                return (
                  <Input
                    key={condition.id}
                    className="add-condition-value-input"
                    onChange={handleChange}
                    value={newValue as string}
                  />
                );
              default:
                return null;
            }
          })()}
        </Col>
      </Row>
      <div className="relative" ref={dropdownRef} />
    </>
  );
};

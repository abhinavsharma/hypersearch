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
  ANY_WEB_SEARCH_CONDITION,
  SEARCH_INTENT_IS_CONDITION,
  SIDEBAR_Z_INDEX,
  SEARCH_ENGINE_IS_CONDITION,
  URL_EQUALS_CONDITION,
  URL_MATCHES_CONDITION,
  DOMAIN_MATCHES_CONDITION,
  DOMAIN_EQUALS_CONDTION,
  ANY_URL_CONDITION_MOBILE,
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
  'Match any search engine (removes other conditions)': ANY_WEB_SEARCH_CONDITION,
};

const DOMAIN_CONDITION_LABELS = {
  'Domain matches regex': DOMAIN_MATCHES_CONDITION,
  'Domain equals': DOMAIN_EQUALS_CONDTION,
};

const URL_CONDITION_LABELS = {
  'URL equals': URL_EQUALS_CONDITION,
  'URL matches regex': URL_MATCHES_CONDITION,
  'Match any page (removes other conditions)': ANY_URL_CONDITION_MOBILE,
};

export const EditConditionInput: EditConditionInput = ({
  condition,
  saveCondition,
  deleteCondition,
  handleAnyUrl,
  handleAnySearchEngine,
}) => {
  const [newKey, setNewKey] = useState<string>(condition?.unique_key ?? condition?.key);
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
    const key =
      ((newKey === URL_EQUALS_CONDITION ||
        newKey === URL_MATCHES_CONDITION ||
        newKey === ANY_URL_CONDITION_MOBILE) &&
        'url') ||
      ((newKey === DOMAIN_EQUALS_CONDTION || newKey === DOMAIN_MATCHES_CONDITION) && 'domain') ||
      newKey;

    const evaluation =
      ((newKey === URL_EQUALS_CONDITION || newKey === DOMAIN_EQUALS_CONDTION) && 'equals') ||
      ((newKey === URL_MATCHES_CONDITION || newKey === DOMAIN_MATCHES_CONDITION) && 'matches') ||
      (newKey === ANY_URL_CONDITION_MOBILE && 'any') ||
      undefined;

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

  const handleChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    setNewValue(value);
    const newCondition = {
      ...condition,
      key: newKey,
      unique_key: newKey,
      label: newLabel,
      value: [value],
    };
    saveCondition(newCondition);
  };

  const handleDelete = () => {
    deleteCondition(condition);
  };

  const handleFilter = (inputValue: string, { key }: OptionProps) => {
    return String(key).toLowerCase().search(inputValue.toLowerCase()) > -1;
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
    const key =
      ((URL_CONDITION_LABELS[label] === URL_EQUALS_CONDITION ||
        URL_CONDITION_LABELS[label] === URL_MATCHES_CONDITION ||
        URL_CONDITION_LABELS[label] === ANY_URL_CONDITION_MOBILE) &&
        'url') ||
      ((DOMAIN_CONDITION_LABELS[label] === DOMAIN_EQUALS_CONDTION ||
        DOMAIN_CONDITION_LABELS[label] === DOMAIN_MATCHES_CONDITION) &&
        'domain') ||
      newKey;

    const evaluation =
      ((URL_CONDITION_LABELS[label] === URL_EQUALS_CONDITION ||
        DOMAIN_CONDITION_LABELS[label] === DOMAIN_EQUALS_CONDTION) &&
        'equals') ||
      ((URL_CONDITION_LABELS[label] === URL_MATCHES_CONDITION ||
        DOMAIN_CONDITION_LABELS[label] === DOMAIN_MATCHES_CONDITION) &&
        'matches') ||
      (URL_CONDITION_LABELS[label] === ANY_URL_CONDITION_MOBILE && 'any') ||
      undefined;

    const unique_key =
      SEARCH_CONDITION_LABELS[label] ??
      URL_CONDITION_LABELS[label] ??
      DOMAIN_CONDITION_LABELS[label];

    if (
      unique_key &&
      URL_CONDITION_LABELS[label] !== ANY_URL_CONDITION_MOBILE &&
      SEARCH_CONDITION_LABELS[label] !== ANY_WEB_SEARCH_CONDITION
    ) {
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
    } else {
      SEARCH_CONDITION_LABELS[label] === ANY_WEB_SEARCH_CONDITION && handleAnySearchEngine();
      URL_CONDITION_LABELS[label] === ANY_URL_CONDITION_MOBILE && handleAnyUrl();
    }
  };

  return (
    <>
      <Row className="large-input-row">
        <Col xs={!newKey ? 24 : 12} className="large-input-row-content">
          {!newKey ? (
            <Select
              placeholder="Add new condition"
              onChange={handleLabelChange}
              className="select-full-width"
              dropdownClassName="select-full-width-dropdown"
              getPopupContainer={() => dropdownRef.current}
            >
              <OptGroup label="Search">
                {Object.keys(SEARCH_CONDITION_LABELS).map((key) => (
                  <Option key={key} value={key}>
                    {key}
                  </Option>
                ))}
              </OptGroup>
              <OptGroup label="URL">
                {Object.keys(URL_CONDITION_LABELS).map((key) => (
                  <Option key={key} value={key}>
                    {key}
                  </Option>
                ))}
              </OptGroup>
              <OptGroup label="Domain">
                {Object.keys(DOMAIN_CONDITION_LABELS).map((key) => (
                  <Option key={key} value={key}>
                    {key}
                  </Option>
                ))}
              </OptGroup>
            </Select>
          ) : (
            <>
              <Button onClick={handleDelete} danger type="link">
                <Suspense fallback={null}>
                  <MinusCircleOutlined />
                </Suspense>
              </Button>
              <span> {condition.label}</span>
            </>
          )}
        </Col>
        <Col xs={12} className="large-input-row-content">
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
                    filterOption={handleFilter}
                    onChange={handleSelect}
                    className="select-full-width"
                    dropdownClassName="select-full-width-dropdown"
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
                            Object.entries(engines).map(([key, cse]) =>
                              !key.match(/amazon/gi) ? (
                                <Option
                                  key={key}
                                  value={JSON.stringify(cse.search_engine_json)}
                                  style={{ zIndex: SIDEBAR_Z_INDEX + 1 }}
                                >
                                  {key}
                                </Option>
                              ) : null,
                            ) ?? null
                          );
                      }
                    })()}
                  </Select>
                );
              case SEARCH_CONTAINS_CONDITION:
              case SEARCH_QUERY_CONTAINS_CONDITION:
              case URL_EQUALS_CONDITION:
              case URL_MATCHES_CONDITION:
              case DOMAIN_EQUALS_CONDTION:
              case DOMAIN_MATCHES_CONDITION:
                return (
                  <Input key={condition.id} onChange={handleChange} value={newValue as string} />
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

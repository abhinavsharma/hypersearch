import React, { Suspense, useEffect, useRef, useState } from 'react';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Input from 'antd/lib/input';
import Button from 'antd/lib/button';
import Select, { OptionProps } from 'antd/lib/select';
import SearchEngineManager from 'lib/SearchEngineManager/SearchEngineManager';
import {
  SIDEBAR_Z_INDEX,
  CONDITION_KEYS,
  CONDITION_LABELS,
  LEGACY_KEYS,
  LEGACY_EVALUATION,
} from 'utils';
import 'antd/lib/select/style/index.css';
import 'antd/lib/button/style/index.css';
import 'antd/lib/input/style/index.css';
import 'antd/lib/grid/style/index.css';

/** MAGICS  **/
const NEW_CONDITION_PLACEHOLDER = 'Add new condition';
const SEARCH_DROPDOWN_GROUP_TITLE = 'Search';
const URL_DROPDOWN_GROUP_TITLE = 'URL';
const DOMAIN_DROPDOWN_GROUP_TITLE = 'Domain';
const SEARCH_INTENT_DROPDOWN_LABEL = 'Search for intents...';
const SEARCH_ENGINE_DROPDOWN_LABEL = 'Select search engine...';

const { OptGroup, Option } = Select;
type TSelect = Record<'key' | 'value' | 'label', string>;

const MinusCircleOutlined = React.lazy(
  async () => await import('@ant-design/icons/MinusCircleOutlined').then((mod) => mod),
);

const SEARCH_CONDITIONS: Partial<{ [x in CONDITION_LABELS]: CONDITION_KEYS }> = {
  [CONDITION_LABELS.SEARCH_CONTAINS]: CONDITION_KEYS.SEARCH_CONTAINS,
  [CONDITION_LABELS.SEARCH_QUERY_CONTAINS]: CONDITION_KEYS.SEARCH_QUERY_CONTAINS,
  [CONDITION_LABELS.SEARCH_INTENT_IS]: CONDITION_KEYS.SEARCH_INTENT_IS,
  [CONDITION_LABELS.SEARCH_ENGINE_IS]: CONDITION_KEYS.SEARCH_ENGINE_IS,
  [CONDITION_LABELS.ANY_SEARCH_ENGINE]: CONDITION_KEYS.ANY_SEARCH_ENGINE,
};

const DOMAIN_CONDITIONS: Partial<{ [x in CONDITION_LABELS]: CONDITION_KEYS }> = {
  [CONDITION_LABELS.DOMAIN_MATCHES]: CONDITION_KEYS.DOMAIN_MATCHES,
  [CONDITION_LABELS.DOMAIN_EQUALS]: CONDITION_KEYS.DOMAIN_EQUALS,
};

const URL_CONDITIONS: Partial<{ [x in CONDITION_LABELS]: CONDITION_KEYS }> = {
  [CONDITION_LABELS.URL_EQUALS]: CONDITION_KEYS.URL_EQUALS,
  [CONDITION_LABELS.URL_MATCHES]: CONDITION_KEYS.URL_MATCHES,
  [CONDITION_LABELS.ANY_URL]: CONDITION_KEYS.ANY_URL,
};

export const EditConditionInput: EditConditionInput = ({
  condition,
  saveCondition,
  deleteCondition,
  handleAnyUrl,
  handleAnySearchEngine,
}) => {
  const [newKey, setNewKey] = useState<CONDITION_KEYS | LEGACY_KEYS>(
    condition?.unique_key ?? condition.key,
  );
  const [newLabel, setNewLabel] = useState<CONDITION_LABELS>(condition?.label as CONDITION_LABELS);
  const [newValue, setNewValue] = useState<any>(condition?.value[0]);
  const [intents, setIntents] = useState<any[]>();
  const [engines, setEngines] = useState<Record<string, CustomSearchEngine>>(Object.create(null));
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIntents(SearchEngineManager.intents);
    // Singleton instance not reinitialized on rerender.
    // ! Be careful when updating the dependency list!
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [SearchEngineManager.intents]);

  useEffect(() => {
    setEngines(SearchEngineManager.engines);
    // Singleton instance not reinitialized on rerender.
    // ! Be careful when updating the dependency list!
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [SearchEngineManager.engines]);

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

  const handleChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    const { key, evaluation } = getLegacyProps();
    setNewValue(value);
    const newCondition = {
      ...condition,
      key,
      evaluation,
      unique_key: newKey as CONDITION_KEYS,
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

  const handleSelect = (e: TSelect) => {
    const updated = newKey === CONDITION_KEYS.SEARCH_ENGINE_IS ? JSON.parse(e.value) : e;
    setNewValue(
      newKey === CONDITION_KEYS.SEARCH_ENGINE_IS
        ? { value: JSON.stringify(updated), key: e.label, label: e.label }
        : e,
    );
    handleSave(updated);
  };

  const handleLabelChange = (label: CONDITION_LABELS) => {
    const { key, evaluation } = getLegacyProps();
    const unique_key =
      SEARCH_CONDITIONS[label] ?? URL_CONDITIONS[label] ?? DOMAIN_CONDITIONS[label];

    if (
      unique_key &&
      URL_CONDITIONS[label] !== CONDITION_KEYS.ANY_URL &&
      SEARCH_CONDITIONS[label] !== CONDITION_KEYS.ANY_SEARCH_ENGINE
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
      SEARCH_CONDITIONS[label] === CONDITION_KEYS.ANY_SEARCH_ENGINE && handleAnySearchEngine();
      URL_CONDITIONS[label] === CONDITION_KEYS.ANY_URL && handleAnyUrl();
    }
  };

  const getPopupContainer = () => dropdownRef.current;

  return (
    <>
      <Row className="insight-large-input-row">
        <Col xs={!newKey ? 24 : 12} className="insight-large-input-row-content">
          {!newKey ? (
            <Select
              placeholder={NEW_CONDITION_PLACEHOLDER}
              onChange={handleLabelChange}
              className="insight-select-full-width"
              dropdownClassName="insight-select-full-width-dropdown"
              getPopupContainer={getPopupContainer}
            >
              <OptGroup label={SEARCH_DROPDOWN_GROUP_TITLE}>
                {Object.keys(SEARCH_CONDITIONS).map((key) => (
                  <Option key={key} value={key}>
                    {key}
                  </Option>
                ))}
              </OptGroup>
              <OptGroup label={URL_DROPDOWN_GROUP_TITLE}>
                {Object.keys(URL_CONDITIONS).map((key) => (
                  <Option key={key} value={key}>
                    {key}
                  </Option>
                ))}
              </OptGroup>
              <OptGroup label={DOMAIN_DROPDOWN_GROUP_TITLE}>
                {Object.keys(DOMAIN_CONDITIONS).map((key) => (
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
        <Col xs={12} className="insight-large-input-row-content">
          {(() => {
            switch (newKey) {
              case CONDITION_KEYS.SEARCH_INTENT_IS:
              case CONDITION_KEYS.SEARCH_ENGINE_IS:
                return (
                  <Select
                    showSearch
                    labelInValue={newKey === CONDITION_KEYS.SEARCH_ENGINE_IS}
                    value={(() => {
                      if (newKey === CONDITION_KEYS.SEARCH_ENGINE_IS) {
                        const [label, value] =
                          Object.entries(engines)?.find(([, entry]) => {
                            const updatedValue: CustomSearchEngine['search_engine_json'] =
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
                        case CONDITION_KEYS.SEARCH_INTENT_IS:
                          return SEARCH_INTENT_DROPDOWN_LABEL;
                        case CONDITION_KEYS.SEARCH_ENGINE_IS:
                          return SEARCH_ENGINE_DROPDOWN_LABEL;
                      }
                    })()}
                    filterOption={handleFilter}
                    onChange={handleSelect}
                    className="insight-select-full-width"
                    dropdownClassName="insight-select-full-width-dropdown"
                    getPopupContainer={() => dropdownRef.current}
                  >
                    {(() => {
                      switch (newKey) {
                        case CONDITION_KEYS.SEARCH_INTENT_IS:
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
                        case CONDITION_KEYS.SEARCH_ENGINE_IS:
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
              case CONDITION_KEYS.SEARCH_CONTAINS:
              case CONDITION_KEYS.SEARCH_QUERY_CONTAINS:
              case CONDITION_KEYS.URL_EQUALS:
              case CONDITION_KEYS.URL_MATCHES:
              case CONDITION_KEYS.DOMAIN_EQUALS:
              case CONDITION_KEYS.DOMAIN_MATCHES:
                return (
                  <Input key={condition.id} onChange={handleChange} value={newValue as string} />
                );
              default:
                return null;
            }
          })()}
        </Col>
      </Row>
      <div className="insight-relative" ref={dropdownRef} />
    </>
  );
};

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
} from 'utils';

const { OptGroup, Option } = Select;

const MinusCircleOutlined = React.lazy(
  async () => await import('@ant-design/icons/MinusCircleOutlined').then((mod) => mod),
);

const SEARCH_CONDITION_LABELS = {
  'Search results contain domain': SEARCH_CONTAINS_CONDITION,
  'Search query contains': SEARCH_QUERY_CONTAINS_CONDITION,
  'Search intent is': SEARCH_INTENT_IS_CONDITION,
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
  const defaultValue = '';
  const { value: originalValue } = condition;
  const [key, setKey] = useState<string>(condition?.key);
  const [label, setLabel] = useState<string>(condition?.label);
  const [value, setValue] = useState(originalValue?.[0] ?? defaultValue);
  const [intents, setIntents] = useState<any[]>();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIntents(SearchEngineManager.intents);
  }, [SearchEngineManager.intents]);

  const handleSave = (_value?: string) => {
    const newCondition = { ...condition, key, label, value: [_value ?? value] };
    saveCondition(newCondition);
  };

  const handleChange = ({ target: { value: _value } }: React.ChangeEvent<HTMLInputElement>) => {
    setValue(_value);
    const newCondition = { ...condition, key, label, value: [_value] };
    saveCondition(newCondition);
  };

  const handleDelete = () => {
    deleteCondition(condition);
  };

  const handleIntentFilter = (inputValue: string, { value }: OptionProps) =>
    (value as string).search(inputValue.toLowerCase()) > -1;

  const handleSelectIntent = (selectedIntent: string) => {
    handleSave(selectedIntent);
  };

  const handleLabelChange = (value: string) => {
    if (SEARCH_CONDITION_LABELS[value]) {
      setLabel(value);
      setKey(SEARCH_CONDITION_LABELS[value]);
      saveCondition({
        ...condition,
        label: value,
        key: SEARCH_CONDITION_LABELS[value],
        value: [],
      });
    }
    OTHER_CONDITION_LABELS[value] === ANY_URL_CONDITION && handleAnyUrl();
  };

  return (
    <>
      <Row className="edit-input-row">
        <Col xs={13} className="condition-label">
          {!key ? (
            <Select
              className="label-select"
              placeholder="Choose Condition Type"
              defaultValue={label}
              onChange={handleLabelChange}
              getPopupContainer={() => dropdownRef.current}
            >
              <OptGroup label="Search">
                {Object.keys(SEARCH_CONDITION_LABELS).map((key) => (
                  <Option value={key}>{key}</Option>
                ))}
              </OptGroup>
              <OptGroup label="Other">
                OTHER_CONDITION_LABELS
                {Object.keys(OTHER_CONDITION_LABELS).map((key) => (
                  <Option value={key}>{key}</Option>
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
            switch (key) {
              case SEARCH_INTENT_IS_CONDITION:
                return (
                  <Select
                    showSearch
                    defaultValue={value}
                    placeholder="Search for intents..."
                    dropdownClassName="search-intent-dropdown"
                    className="search-intent-block"
                    filterOption={handleIntentFilter}
                    onChange={handleSelectIntent}
                    getPopupContainer={() => dropdownRef.current}
                  >
                    {intents?.map(({ name, intent_id }) => (
                      <Option key={name} value={intent_id} style={{ zIndex: SIDEBAR_Z_INDEX + 1 }}>
                        {name}
                      </Option>
                    ))}
                  </Select>
                );
              case SEARCH_CONTAINS_CONDITION:
              case SEARCH_QUERY_CONTAINS_CONDITION:
                return (
                  <Input
                    key={condition.id}
                    className="add-condition-value-input"
                    onChange={handleChange}
                    value={value}
                  />
                );
              case ANY_URL_CONDITION:
                return null;
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

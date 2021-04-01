import React, { Suspense, useEffect, useRef, useState } from 'react';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Input from 'antd/lib/input';
import Button from 'antd/lib/button';
import Select, { OptionProps } from 'antd/lib/select';
import SearchEngineManager from 'lib/SearchEngineManager/SearchEngineManager';
import { Dropdown } from 'modules/shared';
import 'antd/lib/select/style/index.css';
import 'antd/lib/button/style/index.css';
import 'antd/lib/input/style/index.css';
import 'antd/lib/grid/style/index.css';
import {
  SEARCH_CONTAINS_CONDITION,
  EMPTY_CONDITION_LABEL,
  SEARCH_DOMAINS_BUTTON_TEXT,
  SEARCH_QUERY_BUTTON_TEXT,
  SEARCH_QUERY_CONTAINS_CONDITION,
  ANY_URL_CONDITION,
  SEARCH_INTENT_IS_CONDITION,
  SEARCH_INTENT_IS_BUTTON_TEXT,
} from 'utils';

const { Option } = Select;

const MinusCircleOutlined = React.lazy(
  async () => await import('@ant-design/icons/MinusCircleOutlined').then((mod) => mod),
);

export const EditConditionInput: EditConditionInput = ({
  condition,
  saveCondition,
  deleteCondition,
}) => {
  const defaultValue = '';
  const { value: originalValue } = condition;
  const [key, setKey] = useState<string>(condition?.key);
  const [label, setLabel] = useState<string>(condition?.label ?? EMPTY_CONDITION_LABEL);
  const [value, setValue] = useState(originalValue?.[0] ?? defaultValue);
  const [intents, setIntents] = useState<any[]>();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIntents(SearchEngineManager.intents);
  }, [SearchEngineManager.intents]);

  const handleSave = () => {
    const newCondition = { ...condition, key, label, value: [value] };
    saveCondition(newCondition);
  };

  const handleChange = ({ target: { value: _value } }: React.ChangeEvent<HTMLInputElement>) => {
    setValue(_value);
  };

  const handleDelete = () => {
    deleteCondition(condition);
  };

  const handleSearchQuery = () => {
    setLabel('Search query contains');
    setKey(SEARCH_QUERY_CONTAINS_CONDITION);
    saveCondition({
      ...condition,
      label: 'Search query contains',
      key: SEARCH_QUERY_CONTAINS_CONDITION,
      value: [],
    });
  };

  const handleSearchDomains = () => {
    setLabel('Search results contain domain');
    setKey(SEARCH_CONTAINS_CONDITION);
    saveCondition({
      ...condition,
      label: 'Search results contain domain',
      key: SEARCH_CONTAINS_CONDITION,
      value: [],
    });
  };

  const handleSearchIntent = () => {
    setLabel('Search intent is');
    setKey(SEARCH_INTENT_IS_CONDITION);
    saveCondition({
      ...condition,
      label: 'Search intent is',
      key: SEARCH_INTENT_IS_CONDITION,
      value: [],
    });
  };

  const handleIntentFilter = (inputValue: string, { value }: OptionProps) =>
    (value as string).search(inputValue.toLowerCase()) > -1;

  const handleSelectIntent = (selectedIntent: string) => {
    setValue(selectedIntent);
  };

  const conditionKeys = [
    <Button className="dropdown-button" type="link" onClick={handleSearchQuery}>
      {SEARCH_QUERY_BUTTON_TEXT}
    </Button>,
    <Button className="dropdown-button" type="link" onClick={handleSearchDomains}>
      {SEARCH_DOMAINS_BUTTON_TEXT}
    </Button>,
    <Button className="dropdown-button" type="link" onClick={handleSearchIntent}>
      {SEARCH_INTENT_IS_BUTTON_TEXT}
    </Button>,
  ];

  return (
    <>
      <Row className="edit-input-row">
        <Col xs={13}>
          {!key ? (
            <Dropdown button={label} items={conditionKeys} className="edit-action-dropdown" />
          ) : (
            <>
              <span>{condition.label}</span>
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
            </>
          )}
        </Col>
        <Col xs={11} className="value-col">
          {(() => {
            switch (key) {
              case SEARCH_INTENT_IS_CONDITION:
                return (
                  <>
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
                      {intents?.map(({ name }) => (
                        <Option key={name} value={name.toLowerCase()}>
                          {name}
                        </Option>
                      ))}
                    </Select>
                    <Button onClick={handleSave} className="add-intent-button" block type="primary">
                      Add
                    </Button>
                  </>
                );
              case SEARCH_CONTAINS_CONDITION:
              case SEARCH_QUERY_CONTAINS_CONDITION:
                return (
                  <Input.Search
                    className="add-condition-value-input"
                    onChange={handleChange}
                    onSearch={handleSave}
                    enterButton="Add"
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

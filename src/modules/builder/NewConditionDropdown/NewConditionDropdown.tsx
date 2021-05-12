import React, { useRef } from 'react';
import Select from 'antd/lib/select';
import { CONDITION_KEYS, CONDITION_LABELS, LEGACY_EVALUATION, LEGACY_KEYS } from 'utils';
import 'antd/lib/select/style/index.css';

/** MAGICS **/
const NEW_ACTION_PLACEHOLDER = 'Add new condition';
const SEARCH_DROPDOWN_GROUP_TITLE = 'Search';
const URL_DROPDOWN_GROUP_TITLE = 'URL';
const DOMAIN_DROPDOWN_GROUP_TITLE = 'Domain';

const { Option, OptGroup } = Select;

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
  [CONDITION_LABELS.DOMAIN_CONTAINS]: CONDITION_KEYS.DOMAIN_CONTAINS,
};

const URL_CONDITIONS: Partial<{ [x in CONDITION_LABELS]: CONDITION_KEYS }> = {
  [CONDITION_LABELS.URL_EQUALS]: CONDITION_KEYS.URL_EQUALS,
  [CONDITION_LABELS.URL_MATCHES]: CONDITION_KEYS.URL_MATCHES,
  [CONDITION_LABELS.ANY_URL]: CONDITION_KEYS.ANY_URL,
};

export const NewConditionDropdown: NewConditionDropdown = ({
  newKey,
  handleSaveAnyCondition,
  handleSaveNewLabel,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLabelChange = (label: CONDITION_LABELS) => {
    const key =
      ((URL_CONDITIONS[label] === CONDITION_KEYS.URL_EQUALS ||
        URL_CONDITIONS[label] === CONDITION_KEYS.URL_MATCHES ||
        URL_CONDITIONS[label] === CONDITION_KEYS.ANY_URL) &&
        LEGACY_KEYS.URL) ||
      ((DOMAIN_CONDITIONS[label] === CONDITION_KEYS.DOMAIN_EQUALS ||
        DOMAIN_CONDITIONS[label] === CONDITION_KEYS.DOMAIN_MATCHES) &&
        LEGACY_KEYS.DOMAIN) ||
      newKey;

    const evaluation =
      ((URL_CONDITIONS[label] === CONDITION_KEYS.URL_EQUALS ||
        DOMAIN_CONDITIONS[label] === CONDITION_KEYS.DOMAIN_EQUALS) &&
        LEGACY_EVALUATION.EQUALS) ||
      ((URL_CONDITIONS[label] === CONDITION_KEYS.URL_MATCHES ||
        DOMAIN_CONDITIONS[label] === CONDITION_KEYS.DOMAIN_MATCHES) &&
        LEGACY_EVALUATION.MATCHES) ||
      (URL_CONDITIONS[label] === CONDITION_KEYS.ANY_URL && LEGACY_EVALUATION.ANY) ||
      undefined;

    const unique_key =
      SEARCH_CONDITIONS[label] ?? URL_CONDITIONS[label] ?? DOMAIN_CONDITIONS[label];

    if (
      unique_key &&
      URL_CONDITIONS[label] !== CONDITION_KEYS.ANY_URL &&
      SEARCH_CONDITIONS[label] !== CONDITION_KEYS.ANY_SEARCH_ENGINE
    ) {
      handleSaveNewLabel(label, key, unique_key, evaluation);
    } else {
      SEARCH_CONDITIONS[label] === CONDITION_KEYS.ANY_SEARCH_ENGINE &&
        handleSaveAnyCondition('search');
      URL_CONDITIONS[label] === CONDITION_KEYS.ANY_URL && handleSaveAnyCondition('url');
    }
  };

  const getPopupContainer = () => dropdownRef.current as HTMLDivElement;

  return (
    <>
      <Select
        placeholder={NEW_ACTION_PLACEHOLDER}
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
      <div className="insight-relative" ref={dropdownRef} />
    </>
  );
};

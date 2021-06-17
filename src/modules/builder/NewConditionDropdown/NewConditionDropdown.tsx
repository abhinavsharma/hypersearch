import React, { useRef } from 'react';
import Select from 'antd/lib/select';
import { CONDITION_KEY, CONDITION_LABEL, LEGACY_EVALUATION, LEGACY_KEY } from 'utils';
import 'antd/lib/select/style/index.css';

/** MAGICS **/
const NEW_ACTION_PLACEHOLDER = 'Add new condition';
const SEARCH_DROPDOWN_GROUP_TITLE = 'Search';
const URL_DROPDOWN_GROUP_TITLE = 'URL';
const DOMAIN_DROPDOWN_GROUP_TITLE = 'Domain';

const { Option, OptGroup } = Select;

const SEARCH_CONDITIONS: KeyEventMap<ConditionObjectLabel, ConditionObjectKey> = {
  [CONDITION_LABEL.SEARCH_CONTAINS]: CONDITION_KEY.SEARCH_CONTAINS,
  [CONDITION_LABEL.SEARCH_QUERY_CONTAINS]: CONDITION_KEY.SEARCH_QUERY_CONTAINS,
  [CONDITION_LABEL.SEARCH_INTENT_IS]: CONDITION_KEY.SEARCH_INTENT_IS,
  [CONDITION_LABEL.SEARCH_ENGINE_IS]: CONDITION_KEY.SEARCH_ENGINE_IS,
  [CONDITION_LABEL.ANY_SEARCH_ENGINE]: CONDITION_KEY.ANY_SEARCH_ENGINE,
};

const DOMAIN_CONDITIONS: KeyEventMap<ConditionObjectLabel, ConditionObjectKey> = {
  [CONDITION_LABEL.DOMAIN_MATCHES]: CONDITION_KEY.DOMAIN_MATCHES,
  [CONDITION_LABEL.DOMAIN_EQUALS]: CONDITION_KEY.DOMAIN_EQUALS,
  [CONDITION_LABEL.DOMAIN_CONTAINS]: CONDITION_KEY.DOMAIN_CONTAINS,
};

const URL_CONDITIONS: KeyEventMap<ConditionObjectLabel, ConditionObjectKey> = {
  [CONDITION_LABEL.URL_EQUALS]: CONDITION_KEY.URL_EQUALS,
  [CONDITION_LABEL.URL_MATCHES]: CONDITION_KEY.URL_MATCHES,
  [CONDITION_LABEL.ANY_URL]: CONDITION_KEY.ANY_URL,
};

export const NewConditionDropdown: NewConditionDropdown = ({
  newKey,
  handleSaveAnyCondition,
  handleSaveNewLabel,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLabelChange = (label: ConditionObjectLabel) => {
    const key =
      ((URL_CONDITIONS[label] === CONDITION_KEY.URL_EQUALS ||
        URL_CONDITIONS[label] === CONDITION_KEY.URL_MATCHES ||
        URL_CONDITIONS[label] === CONDITION_KEY.ANY_URL) &&
        LEGACY_KEY.URL) ||
      ((DOMAIN_CONDITIONS[label] === CONDITION_KEY.DOMAIN_EQUALS ||
        DOMAIN_CONDITIONS[label] === CONDITION_KEY.DOMAIN_MATCHES) &&
        LEGACY_KEY.DOMAIN) ||
      newKey;

    const evaluation =
      ((URL_CONDITIONS[label] === CONDITION_KEY.URL_EQUALS ||
        DOMAIN_CONDITIONS[label] === CONDITION_KEY.DOMAIN_EQUALS) &&
        LEGACY_EVALUATION.EQUALS) ||
      ((URL_CONDITIONS[label] === CONDITION_KEY.URL_MATCHES ||
        DOMAIN_CONDITIONS[label] === CONDITION_KEY.DOMAIN_MATCHES) &&
        LEGACY_EVALUATION.MATCHES) ||
      (URL_CONDITIONS[label] === CONDITION_KEY.ANY_URL && LEGACY_EVALUATION.ANY) ||
      undefined;

    const unique_key =
      SEARCH_CONDITIONS[label] ?? URL_CONDITIONS[label] ?? DOMAIN_CONDITIONS[label];

    if (
      unique_key &&
      URL_CONDITIONS[label] !== CONDITION_KEY.ANY_URL &&
      SEARCH_CONDITIONS[label] !== CONDITION_KEY.ANY_SEARCH_ENGINE
    ) {
      handleSaveNewLabel(label, key, unique_key, evaluation);
    } else {
      SEARCH_CONDITIONS[label] === CONDITION_KEY.ANY_SEARCH_ENGINE &&
        handleSaveAnyCondition('search');
      URL_CONDITIONS[label] === CONDITION_KEY.ANY_URL && handleSaveAnyCondition('url');
    }
  };

  const getPopupContainer = () => dropdownRef.current as HTMLDivElement;

  return (
    <>
      <Select
        placeholder={NEW_ACTION_PLACEHOLDER}
        onChange={handleLabelChange}
        className="insight-full-width"
        dropdownClassName="insight-full-width-dropdown"
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

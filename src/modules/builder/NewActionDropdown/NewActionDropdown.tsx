import React, { useRef } from 'react';
import Select from 'antd/lib/select';
import { ACTION_KEYS, ACTION_LABELS } from 'utils';
import 'antd/lib/select/style/index.css';

/** MAGICS **/
const NEW_ACTION_PLACEHOLDER = 'Add new action';

const { Option } = Select;

const ACTIONS = {
  [ACTION_LABELS.SEARCH_DOMAINS]: ACTION_KEYS.SEARCH_DOMAINS,
  [ACTION_LABELS.SEARCH_HIDE_DOMAIN]: ACTION_KEYS.SEARCH_HIDE_DOMAIN,
  [ACTION_LABELS.SEARCH_APPEND]: ACTION_KEYS.SEARCH_APPEND,
  [ACTION_LABELS.SEARCH_ALSO]: ACTION_KEYS.SEARCH_ALSO,
  [ACTION_LABELS.OPEN_URL]: ACTION_KEYS.OPEN_URL,
  [ACTION_LABELS.OPEN_LINK_CSS]: ACTION_KEYS.OPEN_LINK_CSS,
  [ACTION_LABELS.NO_COOKIE]: ACTION_KEYS.NO_COOKIE,
};

export const NewActionDropdown: NewActionDropdown = ({ handleSaveLabel }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLabelChange = (label: ACTION_LABELS) => {
    handleSaveLabel(label, ACTIONS[label]);
  };

  const getPopupContainer = () => dropdownRef.current;

  return (
    <>
      <Select
        className="insight-select-full-width"
        dropdownClassName="insight-select-full-width-dropdown"
        placeholder={NEW_ACTION_PLACEHOLDER}
        onChange={handleLabelChange}
        getPopupContainer={getPopupContainer}
      >
        {Object.keys(ACTIONS).map((key) => (
          <Option key={key} value={key}>
            {key}
          </Option>
        ))}
      </Select>
      <div className="insight-relative" ref={dropdownRef} />
    </>
  );
};

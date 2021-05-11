import React, { useRef } from 'react';
import Select from 'antd/lib/select';
<<<<<<< HEAD
import { ACTION_KEYS, ACTION_LABELS } from 'utils';
=======
import {
  OPEN_URL_ACTION,
  SEARCH_ALSO_ACTION,
  SEARCH_APPEND_ACTION,
  SEARCH_DOMAINS_ACTION,
  SEARCH_HIDE_DOMAIN_ACTION,
} from 'utils';
>>>>>>> feat(actions): add support for also search action
import 'antd/lib/select/style/index.css';

/** MAGICS **/
const NEW_ACTION_PLACEHOLDER = 'Add new action';

const { Option } = Select;

<<<<<<< HEAD
const ACTIONS = {
  [ACTION_LABELS.SEARCH_DOMAINS]: ACTION_KEYS.SEARCH_DOMAINS,
  [ACTION_LABELS.OPEN_URL]: ACTION_KEYS.OPEN_URL,
  [ACTION_LABELS.SEARCH_HIDE_DOMAIN]: ACTION_KEYS.SEARCH_HIDE_DOMAIN,
  [ACTION_LABELS.SEARCH_APPEND]: ACTION_KEYS.SEARCH_APPEND,
=======
const ACTION_LABELS = {
  'Search only these domains': SEARCH_DOMAINS_ACTION,
  'Open page': OPEN_URL_ACTION,
  'Hide results from domain': SEARCH_HIDE_DOMAIN_ACTION,
  'Search with string appended': SEARCH_APPEND_ACTION,
  'Search also': SEARCH_ALSO_ACTION,
>>>>>>> feat(actions): add support for also search action
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
        {Object.keys(ACTION_LABELS).map((key) => (
          <Option key={key} value={key}>
            {key}
          </Option>
        ))}
      </Select>
      <div className="insight-relative" ref={dropdownRef} />
    </>
  );
};

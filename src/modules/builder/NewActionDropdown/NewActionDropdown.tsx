import React, { useRef } from 'react';
import Select from 'antd/lib/select';
import { ACTION_KEY, ACTION_LABEL } from 'constant';
import 'antd/lib/select/style/index.css';

/** MAGICS **/
const NEW_ACTION_PLACEHOLDER = 'Add new action';

const { Option } = Select;

const ACTIONS: KeyEventMap<ActionLabel, ActionKey> = {
  [ACTION_LABEL.SEARCH_FEATURE]: ACTION_KEY.SEARCH_FEATURE,
  [ACTION_LABEL.SEARCH_DOMAINS]: ACTION_KEY.SEARCH_DOMAINS,
  [ACTION_LABEL.SEARCH_HIDE_DOMAIN]: ACTION_KEY.SEARCH_HIDE_DOMAIN,
  [ACTION_LABEL.SEARCH_APPEND]: ACTION_KEY.SEARCH_APPEND,
  [ACTION_LABEL.SEARCH_ALSO]: ACTION_KEY.SEARCH_ALSO,
  [ACTION_LABEL.OPEN_URL]: ACTION_KEY.OPEN_URL,
  [ACTION_LABEL.OPEN_LINK_CSS]: ACTION_KEY.OPEN_LINK_CSS,
  [ACTION_LABEL.NO_COOKIE]: ACTION_KEY.NO_COOKIE,
};

export const NewActionDropdown: NewActionDropdown = ({ handleSaveLabel }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLabelChange = (label: ActionLabel) => {
    handleSaveLabel(label, ACTIONS[label]);
  };

  const getPopupContainer = () => dropdownRef.current as HTMLDivElement;

  return (
    <>
      <Select
        className="insight-full-width"
        dropdownClassName="insight-full-width-dropdown"
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

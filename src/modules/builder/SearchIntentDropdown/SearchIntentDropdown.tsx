import React, { useEffect, useRef, useState } from 'react';
import Select, { OptionProps } from 'antd/lib/select';
import SearchEngineManager from 'lib/SearchEngineManager/SearchEngineManager';
import { SIDEBAR_Z_INDEX } from 'utils';
import 'antd/lib/select/style/index.css';

/** MAGICS **/
const SEARCH_INTENT_DROPDOWN_LABEL = 'Search for intents...';

const { Option } = Select;

export const SearchIntentDropdown: SearchIntentDropdown = ({ newValue, handleSelect }) => {
  const [intents, setIntents] = useState<any[]>();

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleFilter = (inputValue: string, options?: Omit<OptionProps, 'children'>) => {
    return (
      String(options?.key ?? '')
        .toLowerCase()
        .search(inputValue.toLowerCase()) > -1
    );
  };

  useEffect(() => {
    setIntents(SearchEngineManager.intents);
    // Singleton instance not reinitialized on rerender.
    // ! Be careful when updating the dependency list!
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [SearchEngineManager.intents]);

  const getPopupContainer = () => dropdownRef.current as HTMLDivElement;

  return (
    <>
      <Select
        showSearch
        value={newValue}
        placeholder={SEARCH_INTENT_DROPDOWN_LABEL}
        filterOption={handleFilter}
        onChange={handleSelect}
        className="insight-select-full-width"
        dropdownClassName="insight-select-full-width-dropdown"
        getPopupContainer={getPopupContainer}
      >
        {intents?.map(({ name, intent_id }) => (
          <Option key={name} value={intent_id} style={{ zIndex: SIDEBAR_Z_INDEX + 1 }}>
            {name}
          </Option>
        )) ?? null}
      </Select>
      <div className="insight-relative" ref={dropdownRef} />
    </>
  );
};

import React, { useEffect, useRef, useState } from 'react';
import Select, { OptionProps } from 'antd/lib/select';
import SearchEngineManager from 'lib/SearchEngineManager/SearchEngineManager';
import { SIDEBAR_Z_INDEX } from 'utils';
import 'antd/lib/select/style/index.css';

/** MAGICS **/
const SEARCH_ENGINE_DROPDOWN_LABEL = 'Select search engine...';

const { Option } = Select;

export const SearchEngineDropdown: SearchEngineDropdown = ({
  newValue,
  handleSelect,
  placeholder = SEARCH_ENGINE_DROPDOWN_LABEL,
}) => {
  const [engines, setEngines] = useState<Record<string, CustomSearchEngine>>(Object.create(null));

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleFilter = (inputValue: string, option?: Omit<OptionProps, 'children'>) => {
    return (
      String(option?.key ?? '')
        .toLowerCase()
        .search(inputValue.toLowerCase()) > -1
    );
  };

  useEffect(() => {
    setEngines(SearchEngineManager.engines);
    // Singleton instance not reinitialized on rerender.
    // ! Be careful when updating the dependency list!
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [SearchEngineManager.engines]);

  const getPopupContainer = () => dropdownRef.current as HTMLDivElement;

  return (
    <>
      <Select
        showSearch
        labelInValue
        value={(() => {
          const [label, value] =
            Object.entries(engines)?.find(([, entry]) => {
              const updatedValue: CustomSearchEngine['search_engine_json'] =
                typeof newValue?.value === 'string' ? JSON.parse(newValue.value) : newValue;
              const hasAllParams = updatedValue?.required_params?.every((param) =>
                entry.search_engine_json?.required_params?.includes(param),
              );
              const hasPrefix =
                entry.search_engine_json?.required_prefix === updatedValue?.required_prefix;
              return hasAllParams && hasPrefix;
            }) ?? [];
          return {
            key: label,
            value: JSON.stringify(value?.search_engine_json),
            label,
          };
        })()}
        placeholder={placeholder}
        filterOption={handleFilter}
        onChange={handleSelect}
        className="insight-select-full-width"
        dropdownClassName="insight-select-full-width-dropdown"
        getPopupContainer={getPopupContainer}
      >
        {Object.entries(engines).map(([key, cse]) =>
          !key.match(/amazon/gi) ? (
            <Option
              key={key}
              value={JSON.stringify(cse.search_engine_json)}
              style={{ zIndex: SIDEBAR_Z_INDEX + 1 }}
            >
              {key}
            </Option>
          ) : null,
        ) ?? null}
      </Select>
      <div className="insight-relative" ref={dropdownRef} />
    </>
  );
};

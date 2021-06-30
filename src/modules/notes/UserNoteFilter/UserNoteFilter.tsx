/**
 * @module modules:notes
 * @version 1.0.0
 * @license (C) Insight
 */

import React, { useContext, useEffect, useRef, useState } from 'react';
import AutoComplete from 'antd/lib/auto-complete';
import { NotesContext } from 'modules/notes';
import UserManager from 'lib/user';
import 'antd/lib/auto-complete/style/index.css';

//-----------------------------------------------------------------------------------------------
// ! Magics
//-----------------------------------------------------------------------------------------------
const AUTOCOMPLETE_PLACEHOLDER = 'Filter notes by tags...';

//-----------------------------------------------------------------------------------------------
// ! Component
//-----------------------------------------------------------------------------------------------
export const UserNoteFilter = () => {
  const [userTags, setUserTags] = useState(Array(0));
  const { searchedTag, setSearchedTag } = useContext(NotesContext);
  const dropdownRef = useRef<HTMLDivElement>(null);

  //-----------------------------------------------------------------------------------------------
  // ! Handlers
  //-----------------------------------------------------------------------------------------------
  const handleChange = (value: string) => {
    setSearchedTag(value);
  };

  useEffect(() => {
    setUserTags(UserManager.user.tags);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [UserManager.user.tags]);

  const getPopupContainer = () => dropdownRef.current as HTMLDivElement;

  const options = userTags.map((tag) => ({ value: tag }));

  const autoCompleteStyle = { width: '100%', margin: '10px auto' };

  //-----------------------------------------------------------------------------------------------
  // ! Render
  //-----------------------------------------------------------------------------------------------
  return (
    <>
      <AutoComplete
        options={options}
        value={searchedTag}
        placeholder={AUTOCOMPLETE_PLACEHOLDER}
        style={autoCompleteStyle}
        dropdownClassName="insight-full-width-dropdown"
        getPopupContainer={getPopupContainer}
        onChange={handleChange}
      />
      <div className="insight-relative" ref={dropdownRef} />
    </>
  );
};

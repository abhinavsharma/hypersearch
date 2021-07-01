/**
 * @module modules:notes
 * @version 1.0.0
 * @license (C) Insight
 */

import React, { useContext, useEffect, useRef, useState } from 'react';
import Tag from 'antd/lib/tag';
import Select from 'antd/lib/select';
import { NotesContext } from 'modules/notes';
import UserManager from 'lib/user';
import 'antd/lib/tag/style/index.css';
import 'antd/lib/select/style/index.css';

//-----------------------------------------------------------------------------------------------
// ! Magics
//-----------------------------------------------------------------------------------------------
const SEARCH_BY_TAG_PLACEHOLDER = 'Filter notes by tags...';

//-----------------------------------------------------------------------------------------------
// ! Component
//-----------------------------------------------------------------------------------------------
export const UserNoteFilter = () => {
  const [userTags, setUserTags] = useState(Array(0));
  const { searchedTag, setSearchedTag, setFilteredNotes, sliceNotes } = useContext(NotesContext);
  const dropdownRef = useRef<HTMLDivElement>(null);

  //-----------------------------------------------------------------------------------------------
  // ! Handlers
  //-----------------------------------------------------------------------------------------------
  const handleTagChange = (newTags: string[]) => {
    const tags = Array.from(new Set(newTags));
    setSearchedTag(tags);
    setFilteredNotes(
      sliceNotes.filter(
        (note) => !tags.length || searchedTag?.every((tag) => note.tags.includes(tag)),
      ),
    );
  };

  useEffect(() => {
    setUserTags(UserManager.user.tags);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [UserManager.user.tags]);

  useEffect(() => {
    setUserTags(UserManager.user.lastUsedTags);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [UserManager.user.lastUsedTags]);

  const getPopupContainer = () => dropdownRef.current as HTMLDivElement;

  const options = userTags.map((tag) => ({ value: tag }));

  const selectStyle = { width: '100%', margin: '10px auto' };

  const tagStyle = { marginRight: 3 };

  //-----------------------------------------------------------------------------------------------
  // ! Render
  //-----------------------------------------------------------------------------------------------
  const tagRender = (props: any) => {
    const { label, closable, onClose } = props;
    const onPreventMouseDown = (event: any) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <Tag
        color="gold"
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={tagStyle}
      >
        {label}
      </Tag>
    );
  };

  return (
    <>
      <Select
        mode="tags"
        tagRender={tagRender}
        options={options}
        value={searchedTag}
        placeholder={SEARCH_BY_TAG_PLACEHOLDER}
        style={selectStyle}
        dropdownClassName="insight-full-width-dropdown"
        getPopupContainer={getPopupContainer}
        onChange={handleTagChange}
      />
      <div className="insight-relative" ref={dropdownRef} />
    </>
  );
};

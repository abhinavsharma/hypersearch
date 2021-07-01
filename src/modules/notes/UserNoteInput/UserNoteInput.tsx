/**
 * @module modules:notes
 * @version 1.0.0
 * @license (C) Insight
 */

import React, { useContext, useRef } from 'react';
import { v4 as uuid } from 'uuid';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';
import Tag from 'antd/lib/tag';
import Select from 'antd/lib/select';
import message from 'antd/lib/message';
import UserManager from 'lib/user';
import { NotesContext, NoteTabContext } from 'modules/notes';
import { NOTE_PREFIX } from 'constant';
import 'antd/lib/tag/style/index.css';
import 'antd/lib/button/style/index.css';
import 'antd/lib/input/style/index.css';
import 'antd/lib/message/style/index.css';
import 'antd/lib/select/style/index.css';

const { TextArea } = Input;

//-----------------------------------------------------------------------------------------------
// ! Magics
//-----------------------------------------------------------------------------------------------
const ADD_BUTTON_TEXT = 'Add';
const EDIT_BUTTON_TEXT = 'Edit';
const URL_NOTE_PLACEHOLDER = 'Your note about <placeholder> goes here';
const TAG_AUTOCOMPLETE_PLACEHOLDER = 'Add tags to your note...';

//-----------------------------------------------------------------------------------------------
// ! Component
//-----------------------------------------------------------------------------------------------
export const UserNoteInput = ({ slice }: { slice: string }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { sliceNotes, setSliceNotes, setSearchedTag, userTags } = useContext(NoteTabContext);
  const { setNewSliceNote, setCurrentEditing, newSliceNote, currentEditing } =
    useContext(NotesContext);

  //-----------------------------------------------------------------------------------------------
  // ! Handlers
  //-----------------------------------------------------------------------------------------------
  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewSliceNote((prev) => ({
      ...prev,
      slice,
      note: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    if (newSliceNote.slice !== slice) {
      return;
    }

    let newSlices: NoteRecord[] = [];
    setSliceNotes((prev) => {
      newSlices = prev[slice]
        ?.filter(({ slice: prevSlice }) => prevSlice === newSliceNote.slice)
        .map((item) =>
          item.id === currentEditing
            ? {
                ...newSliceNote,
                date: new Date().toLocaleString(),
              }
            : item,
        );
      !sliceNotes[slice]?.find((note) => note.id === newSliceNote.id) &&
        newSliceNote.slice === slice &&
        newSlices.push(newSliceNote);
      chrome.storage.sync.set({
        [`${NOTE_PREFIX}-${encodeURIComponent(newSliceNote.slice)}`]: newSlices,
      });
      return { ...prev, [slice]: newSlices };
    });
    const result = await new Promise<boolean>((resolve) => {
      if (chrome.runtime.lastError) {
        resolve(false);
      }
      resolve(true);
    });
    result
      ? message.success({
          top: 30,
          content: `Note created and stored for ${slice}!`,
          maxCount: 3,
        })
      : message.error({
          top: 30,
          content: `Failed to add note for ${slice}!`,
          maxCount: 3,
        });

    setNewSliceNote({
      note: '',
      slice: '',
      id: uuid(),
      tags: newSliceNote.tags,
      date: new Date().toLocaleString(),
    });
    setCurrentEditing('');
    setSearchedTag(newSliceNote.tags);
  };

  const handleTagChange = async (newTags: string[]) => {
    const tags = Array.from(new Set(newTags));
    setNewSliceNote((prev) => ({ ...prev, tags }));
    const newTag = tags.find((tag) => !userTags.includes(tag));
    newTag && (await UserManager.addUserTag(newTag));
    await UserManager.changeLastUsedTags(tags);
  };

  const getPopupContainer = () => dropdownRef.current as HTMLDivElement;

  const options = Array.from(new Set([...userTags, ...(newSliceNote.tags ?? [])])).map((tag) => ({
    value: tag,
  }));

  const tagStyle = { marginRight: 3 };

  const selectStyle = { width: '100%', margin: '10px auto' };

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
      <TextArea
        onChange={handleNoteChange}
        value={newSliceNote.note}
        placeholder={URL_NOTE_PLACEHOLDER.replace('<placeholder>', slice || 'anything')}
        rows={4}
      />
      <Select
        mode="tags"
        tagRender={tagRender}
        options={options}
        value={newSliceNote.tags}
        placeholder={TAG_AUTOCOMPLETE_PLACEHOLDER}
        style={selectStyle}
        dropdownClassName="insight-full-width-dropdown"
        getPopupContainer={getPopupContainer}
        onChange={handleTagChange}
      />
      <Button type="primary" block onClick={handleSubmit} disabled={!newSliceNote.note?.length}>
        {`${currentEditing ? EDIT_BUTTON_TEXT : ADD_BUTTON_TEXT} Note`}
      </Button>
      <div className="insight-relative" ref={dropdownRef} />
    </>
  );
};

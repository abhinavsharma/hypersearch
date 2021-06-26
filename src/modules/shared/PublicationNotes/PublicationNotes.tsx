import React, { useCallback, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';
import message from 'antd/lib/message';
import { NoteEntry } from 'modules/shared';
import 'antd/lib/button/style/index.css';
import 'antd/lib/input/style/index.css';
import 'antd/lib/message/style/index.css';
import './PublicationNotes.scss';
import { debug } from 'lib/helpers';

const { TextArea } = Input;

//-----------------------------------------------------------------------------------------------
// ! Magics
//-----------------------------------------------------------------------------------------------
const ADD_BUTTON_TEXT = 'Add';
const EDIT_BUTTON_TEXT = 'Edit';
const URL_NOTE_PLACEHOLDER = 'Your note about <placeholder> goes here';

//-----------------------------------------------------------------------------------------------
// ! Component
//-----------------------------------------------------------------------------------------------
export const PublicationNotes: PublicationNotes = ({ slice, prefix, externals }) => {
  const [currentEditing, setCurrentEditing] = useState<string>('');
  const [newSliceNote, setNewSliceNote] = useState<NoteRecord>(Object.create({ id: '', note: '' }));
  const [sliceNotes, setSliceNotes] = useState<NoteRecord[]>(Array(0));

  //-----------------------------------------------------------------------------------------------
  // ! Handlers
  //-----------------------------------------------------------------------------------------------

  const handleSliceNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewSliceNote((prev) => ({
      ...prev,
      note: e.target.value,
      slice: slice || prev.slice,
      key: prev.key,
    }));
  };

  const handleAddSliceNoteUrl = async () => {
    let newSlices: NoteRecord[] = [];
    setSliceNotes((prev) => {
      newSlices = [
        ...prev.map((item) =>
          item.id === currentEditing
            ? {
                ...newSliceNote,
                id: currentEditing || uuid(),
                slice: slice || newSliceNote.slice,
                key: newSliceNote.key,
              }
            : {
                ...item,
                slice: item.slice || slice,
              },
        ),
      ];
      !currentEditing && newSlices.push({ ...newSliceNote, id: uuid() });
      chrome.storage.local.set({
        [`${prefix}-${encodeURIComponent(slice ?? newSliceNote.slice)}`]: newSlices,
      });
      return newSlices;
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

    setNewSliceNote({ note: '', key: '', slice: '', id: '' });
    setCurrentEditing('');
  };

  const getSliceNotes = useCallback(async () => {
    const results = await new Promise<Record<string, NoteRecord[]>>((resolve) => {
      chrome.storage.local.get(resolve);
    }).then((data) =>
      Object.entries(data).reduce((notes, [key, note]) => {
        if (key.startsWith(`${prefix}-${slice ? encodeURIComponent(slice) : ''}`)) {
          return notes.concat(note);
        }
        return notes;
      }, [] as NoteRecord[]),
    );
    setSliceNotes(results);
  }, [slice, prefix]);

  useEffect(() => {
    getSliceNotes();
    debug('SLICE: ', slice);
  }, [getSliceNotes]);

  //-----------------------------------------------------------------------------------------------
  // ! Render
  //-----------------------------------------------------------------------------------------------

  return (
    <>
      {[
        ...sliceNotes,
        ...(externals?.map((item) => ({
          id: uuid(),
          note: `${item.rating}\u00a0⭐\u00a0${item.text}`,
          external: true,
        })) ?? []),
      ].map((note) =>
        currentEditing === note.id ? null : (
          <NoteEntry
            key={note.id}
            note={note}
            slice={slice}
            prefix={prefix}
            sliceNotes={sliceNotes}
            setSliceNotes={setSliceNotes}
            setNewSliceNote={setNewSliceNote}
            setCurrentEditing={setCurrentEditing}
          />
        ),
      )}
      <TextArea
        onChange={handleSliceNoteChange}
        value={newSliceNote.note}
        placeholder={URL_NOTE_PLACEHOLDER.replace('<placeholder>', slice || 'anything')}
        rows={4}
      />
      <Button
        type="primary"
        block
        onClick={handleAddSliceNoteUrl}
        disabled={!newSliceNote.note.length}
      >
        {`${currentEditing ? EDIT_BUTTON_TEXT : ADD_BUTTON_TEXT} Note`}
      </Button>
    </>
  );
};

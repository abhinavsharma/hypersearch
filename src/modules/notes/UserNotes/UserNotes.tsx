/**
 * @module modules:notes
 * @version 1.0.0
 * @license (C) Insight
 */

import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import Avatar from 'antd/lib/avatar';
import Comment from 'antd/lib/comment';
import Divider from 'antd/lib/divider';
import Tag from 'antd/lib/tag';
import { UserNoteFilter, UserNoteInput } from 'modules/notes';
import { usePublicationInfo } from 'lib/publication';
import { NOTE_PREFIX } from 'constant';
import 'antd/lib/tag/style/index.css';
import 'antd/lib/avatar/style/index.css';
import 'antd/lib/comment/style/index.css';
import 'antd/lib/divider/style/index.css';
import './UserNotes.scss';

const UserOutlined = React.lazy(
  async () => await import('@ant-design/icons/UserOutlined').then((mod) => mod),
);

type TNoteContext = {
  slice: string;
  currentEditing: string;
  setCurrentEditing: React.Dispatch<React.SetStateAction<string>>;
  newSliceNote: NoteRecord;
  setNewSliceNote: React.Dispatch<React.SetStateAction<NoteRecord>>;
  sliceNotes: NoteRecord[];
  setSliceNotes: React.Dispatch<React.SetStateAction<NoteRecord[]>>;
  searchedTag: string;
  setSearchedTag: React.Dispatch<React.SetStateAction<string>>;
};

export const NotesContext = React.createContext<TNoteContext>(Object.create(null));

//-----------------------------------------------------------------------------------------------
// ! Magics
//-----------------------------------------------------------------------------------------------
const EDIT_BUTTON_TEXT = 'Edit';
const DELETE_BUTTON_TEXT = 'Delete';
const PAGE_RATING_TEXT = '<placeholder> ⭐';
const DEFAULT_AUTHOR = 'You';

//-----------------------------------------------------------------------------------------------
// ! Component
//-----------------------------------------------------------------------------------------------
export const UserNotes: UserNotes = ({ slice }) => {
  // When `slice` is falsy, it means we render all notes

  const [searchedTag, setSearchedTag] = useState<string>('');
  const [currentEditing, setCurrentEditing] = useState<string>('');
  const [newSliceNote, setNewSliceNote] = useState<NoteRecord>(Object.create({ id: '', note: '' }));
  const [sliceNotes, setSliceNotes] = useState<NoteRecord[]>(Array(0));
  const { averageRating, publicationInfo } = usePublicationInfo(slice);

  //-----------------------------------------------------------------------------------------------
  // ! Handlers
  //-----------------------------------------------------------------------------------------------
  const handleEditSliceNote = (id: string) => {
    setCurrentEditing(id);
    const editSlice = sliceNotes.find((note) => note.id === id);
    editSlice && setNewSliceNote(editSlice);
  };

  const handleDeleteSlice = (deleteId: string) => {
    let newSlices: NoteRecord[] = [];
    setSliceNotes((prev) => {
      newSlices = prev.filter(({ id }) => id !== deleteId);
      chrome.storage.local.set({
        [`${NOTE_PREFIX}-${encodeURIComponent(slice)}`]: newSlices,
      });
      return newSlices;
    });
  };

  const getSliceNotes = useCallback(async () => {
    const results = await new Promise<Record<string, NoteRecord[]>>((resolve) => {
      chrome.storage.local.get(resolve);
    }).then((data) =>
      Object.entries(data).reduce((notes, [key, note]) => {
        if (key.startsWith(`${NOTE_PREFIX}-${slice ? encodeURIComponent(slice) : ''}`)) {
          return notes.concat(note);
        }
        return notes;
      }, [] as NoteRecord[]),
    );
    setSliceNotes(results);
  }, [slice]);

  useEffect(() => {
    getSliceNotes();
  }, [getSliceNotes]);

  const context = {
    slice,
    currentEditing,
    setCurrentEditing,
    newSliceNote,
    setNewSliceNote,
    sliceNotes,
    setSliceNotes,
    searchedTag,
    setSearchedTag,
  };

  //-----------------------------------------------------------------------------------------------
  // ! Render
  //-----------------------------------------------------------------------------------------------

  const actions = (id: string) => [
    <span key={1} onClick={() => handleEditSliceNote(id)}>
      {EDIT_BUTTON_TEXT}
    </span>,
    <span key={2} onClick={() => handleDeleteSlice(id)}>
      {DELETE_BUTTON_TEXT}
    </span>,
  ];

  const avatar = () => {
    const icon = (
      <Suspense fallback={null}>
        <UserOutlined />
      </Suspense>
    );
    return <Avatar icon={icon} />;
  };

  const noteContent = (text: string, tags: string[]) => (
    <div className="user-note-wrapper insight-list">
      <span className="user-note-text">{text}</span>
      <span className="user-note-tags insight-row">
        {tags.map((tag) => (
          <Tag key={tag} color="gold">
            {tag}
          </Tag>
        ))}
      </span>
    </div>
  );

  return (
    <NotesContext.Provider value={context}>
      <div className="sidebar-notes-tab">
        <section>
          {!!averageRating && slice === publicationInfo.publication && (
            <span className="publication-page-rating">
              {PAGE_RATING_TEXT.replace('<placeholder>', String(averageRating))}
            </span>
          )}
          <div className="publication-notes-wrapper">
            {slice === publicationInfo.publication && (
              <>
                {publicationInfo.tags.map((tag) => (
                  <Comment
                    key={uuid()}
                    avatar={avatar()}
                    content={`${PAGE_RATING_TEXT.replace(
                      '<placeholder>',
                      String(tag.rating),
                    )}\u00a0${tag.text}`}
                  />
                ))}
              </>
            )}
            {!slice && <UserNoteFilter />}
            {sliceNotes
              .filter((note) => !searchedTag || note.tags?.includes(searchedTag))
              .map((note) =>
                currentEditing === note.id || (slice && note.slice !== slice) ? null : (
                  <>
                    <Comment
                      key={note.id}
                      datetime={`${!slice ? `${note.slice}\u00a0·\u00a0 ` : ''}${note.date}`}
                      author={note.external ? '' : DEFAULT_AUTHOR}
                      actions={slice ? actions(note.id) : undefined}
                      avatar={avatar()}
                      content={noteContent(note.note, note.tags ?? [])}
                    />
                  </>
                ),
              )}
            {slice && <UserNoteInput />}
          </div>
          <Divider />
        </section>
      </div>
    </NotesContext.Provider>
  );
};

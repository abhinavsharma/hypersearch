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
import UserManager from 'lib/user';
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
  currentEditing: string;
  setCurrentEditing: React.Dispatch<React.SetStateAction<string>>;
  newSliceNote: NoteRecord;
  setNewSliceNote: React.Dispatch<React.SetStateAction<NoteRecord>>;
  sliceNotes: NoteRecord[];
  setSliceNotes: React.Dispatch<React.SetStateAction<NoteRecord[]>>;
  searchedTag: string[];
  setSearchedTag: React.Dispatch<React.SetStateAction<string[]>>;
  filteredNotes: NoteRecord[];
  setFilteredNotes: React.Dispatch<React.SetStateAction<NoteRecord[]>>;
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
  const [filteredNotes, setFilteredNotes] = useState<NoteRecord[]>(Array(0));
  const [searchedTag, setSearchedTag] = useState<string[]>(UserManager.user.lastUsedTags);
  const [currentEditing, setCurrentEditing] = useState<string>('');
  const [newSliceNote, setNewSliceNote] = useState<NoteRecord>({
    slice,
    id: uuid(),
    note: '',
    date: new Date().toLocaleString(),
    tags: UserManager.user.lastUsedTags,
  });
  const [sliceNotes, setSliceNotes] = useState<NoteRecord[]>(Array(0));
  const { averageRating, publicationInfo } = usePublicationInfo(slice);

  //-----------------------------------------------------------------------------------------------
  // ! Handlers
  //-----------------------------------------------------------------------------------------------
  const handleEditSliceNote = (id: string) => {
    setCurrentEditing(id);
    const editSlice = sliceNotes.find((note) => note.id === id && note.slice === slice);
    editSlice && setNewSliceNote(editSlice);
  };

  const handleDeleteSlice = (deleteId: string) => {
    let newSlices: NoteRecord[] = [];
    setSliceNotes((prev) => {
      newSlices = prev.filter(({ id, slice: noteSlice }) => id !== deleteId && noteSlice === slice);
      chrome.storage.sync.set({
        [`${NOTE_PREFIX}-${encodeURIComponent(slice)}`]: newSlices,
      });
      return newSlices;
    });
  };

  const getSliceNotes = useCallback(async () => {
    const results = await new Promise<Record<string, NoteRecord[]>>((resolve) => {
      chrome.storage.sync.get(resolve);
    }).then((data) =>
      Object.entries(data).reduce((notes, [key, note]) => {
        if (key.startsWith(`${NOTE_PREFIX}-${slice ? encodeURIComponent(slice) : ''}`)) {
          return notes.concat(note);
        }
        return notes;
      }, [] as NoteRecord[]),
    );
    setSliceNotes(results);
    setFilteredNotes(results);
  }, [slice]);

  useEffect(() => {
    getSliceNotes();
  }, [getSliceNotes]);

  useEffect(() => {
    setSearchedTag(UserManager.user.lastUsedTags);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [UserManager.user.lastUsedTags]);

  const context = {
    currentEditing,
    setCurrentEditing,
    newSliceNote,
    setNewSliceNote,
    sliceNotes,
    setSliceNotes,
    searchedTag,
    setSearchedTag,
    filteredNotes,
    setFilteredNotes,
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
            {slice === publicationInfo.publication &&
              publicationInfo.tags.map((tag) => (
                <Comment
                  key={uuid()}
                  avatar={avatar()}
                  content={`${PAGE_RATING_TEXT.replace('<placeholder>', String(tag.rating))}\u00a0${
                    tag.text
                  }`}
                />
              ))}
            {!slice && <UserNoteFilter />}
            {(slice ? sliceNotes : filteredNotes)
              .filter((note) =>
                !slice
                  ? true
                  : !searchedTag.length ||
                    (searchedTag?.every((tag) => note.tags.includes(tag)) && note.slice === slice),
              )
              .map((note) =>
                currentEditing === note.id || (slice && note.slice !== slice) ? null : (
                  <Comment
                    key={note.id}
                    datetime={`${!slice ? `${note.slice}\u00a0·\u00a0 ` : ''}${note.date}`}
                    author={DEFAULT_AUTHOR}
                    actions={slice ? actions(note.id) : undefined}
                    avatar={avatar()}
                    content={noteContent(note.note, note.tags ?? [])}
                  />
                ),
              )}
            {slice && <UserNoteInput slice={slice} />}
          </div>
          <Divider />
        </section>
      </div>
    </NotesContext.Provider>
  );
};

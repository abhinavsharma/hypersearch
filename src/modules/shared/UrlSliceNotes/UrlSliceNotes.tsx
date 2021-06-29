import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';
import message from 'antd/lib/message';
import Avatar from 'antd/lib/avatar';
import Comment from 'antd/lib/comment';
import Divider from 'antd/lib/divider';
import { usePublicationInfo } from 'lib/publication';
import { NOTE_PREFIX } from 'constant';
import 'antd/lib/avatar/style/index.css';
import 'antd/lib/button/style/index.css';
import 'antd/lib/comment/style/index.css';
import 'antd/lib/divider/style/index.css';
import 'antd/lib/input/style/index.css';
import 'antd/lib/message/style/index.css';
import './UrlSliceNotes.scss';

const UserOutlined = React.lazy(
  async () => await import('@ant-design/icons/UserOutlined').then((mod) => mod),
);

const { TextArea } = Input;

//-----------------------------------------------------------------------------------------------
// ! Magics
//-----------------------------------------------------------------------------------------------
const ADD_BUTTON_TEXT = 'Add';
const EDIT_BUTTON_TEXT = 'Edit';
const DELETE_BUTTON_TEXT = 'Delete';
const URL_NOTE_PLACEHOLDER = 'Your note about <placeholder> goes here';
const PAGE_HEADER = '<placeholder>';
const PAGE_RATING_TEXT = '<placeholder> ⭐';
const PAGE_REVIEWS_HEADER = 'Trusted Reviews';

//-----------------------------------------------------------------------------------------------
// ! Component
//-----------------------------------------------------------------------------------------------
export const UrlSliceNotes: UrlSliceNotes = ({ slice }) => {
  const [currentEditing, setCurrentEditing] = useState<string>('');
  const [newSliceNote, setNewSliceNote] = useState<NoteRecord>(Object.create({ id: '', note: '' }));
  const [sliceNotes, setSliceNotes] = useState<NoteRecord[]>(Array(0));

  const { averageRating, publicationInfo } = usePublicationInfo(slice);

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
        [`${NOTE_PREFIX}-${encodeURIComponent(newSliceNote.slice ?? slice)}`]: newSlices,
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

  return (
    <div className="sidebar-notes-tab">
      <section>
        <h2 className="title">{PAGE_HEADER.replace('<placeholder>', slice)}</h2>
        {!!averageRating && slice === publicationInfo.publication && (
          <span className="publication-page-rating">
            {PAGE_RATING_TEXT.replace('<placeholder>', String(averageRating))}
          </span>
        )}
        <div className="publication-notes-wrapper">
          {slice === publicationInfo.publication && (
            <>
              {!!publicationInfo.tags.length && <h2 className="title">{PAGE_REVIEWS_HEADER}</h2>}
              {publicationInfo.tags.map((tag) => (
                <Comment
                  key={uuid()}
                  avatar={avatar()}
                  content={`${PAGE_RATING_TEXT.replace('<placeholder>', String(tag.rating))}\u00a0${
                    tag.text
                  }`}
                />
              ))}
            </>
          )}
          {sliceNotes.map((note) =>
            currentEditing === note.id || (slice && note.slice !== slice) ? null : (
              <Comment
                key={note.id}
                datetime={(!slice && note.slice) || ''}
                author={note.external ? '' : 'You'}
                actions={slice ? actions(note.id) : undefined}
                avatar={avatar()}
                content={note.note}
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
        </div>
        <Divider />
      </section>
    </div>
  );
};

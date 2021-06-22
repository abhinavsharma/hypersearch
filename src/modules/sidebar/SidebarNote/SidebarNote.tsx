/**
 * @module modules:sidebar
 * @version 1.0.0
 * @license (C) Insight
 */

import React, { Suspense } from 'react';
import Avatar from 'antd/lib/avatar';
import Comment from 'antd/lib/comment';
import message from 'antd/lib/message';
import 'antd/lib/avatar/style/index.css';
import 'antd/lib/comment/style/index.css';
import 'antd/lib/message/style/index.css';

const UserOutlined = React.lazy(
  async () => await import('@ant-design/icons/UserOutlined').then((mod) => mod),
);

//-----------------------------------------------------------------------------------------------
// ! Magics
//-----------------------------------------------------------------------------------------------
const EDIT_BUTTON_TEXT = 'Edit';
const DELETE_BUTTON_TEXT = 'Delete';

//-----------------------------------------------------------------------------------------------
// ! Component
//-----------------------------------------------------------------------------------------------
export const SidebarNote: SidebarNote = ({
  note,
  slice,
  prefix,
  sliceNotes,
  setSliceNotes,
  setCurrentEditing,
  setNewSliceNote,
}) => {
  const actualSlice = note.slice || slice;

  const handleEditSliceNote = (id: string) => {
    setCurrentEditing(id);
    const editSlice = sliceNotes.find((note) => note.id === id);
    editSlice && setNewSliceNote({ ...editSlice, slice: note.slice || slice, key: note.key });
  };

  const handleDeleteSlice = async (deleteId: string) => {
    let newSlices: NoteRecord[] = [];
    setSliceNotes((prev) => {
      newSlices = prev.filter(({ id }) => id !== deleteId);
      chrome.storage.local.set({
        [`${prefix}-${encodeURIComponent(actualSlice)}`]: newSlices,
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
          content: `Note deleted from ${note.key}!`,
          maxCount: 3,
        })
      : message.error({
          top: 30,
          content: `Failed to delete note from ${note.key}!`,
          maxCount: 3,
        });
  };

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
    <div key={note.key} className="slice-note">
      <Comment
        datetime={(!slice && note.slice) || ''}
        author="You"
        actions={actions(note.id)}
        avatar={avatar()}
        content={note.note}
      />
    </div>
  );
};

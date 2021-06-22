import React from 'react';
import Button from 'antd/lib/button';
import { Edit3 } from 'react-feather';
import AugmentationManager from 'lib/augmentations';
import SidebarLoader from 'lib/sidebar';
import { createNote, SIDEBAR_TAB_NOTE_TAB, SWITCH_TO_TAB } from 'constant';
import 'antd/lib/button/style/index.css';

const CREATE_NOTE_BUTTON_TEXT = 'Create a note for this page';
const OPEN_NOTE_BUTTON_TEXT = 'Open notes for this page';

export const CreateNoteButton: CreateNoteButton = ({ hasNote }) => {
  const handleCreate = () => {
    SidebarLoader.isPreview = true;
    AugmentationManager.addOrEditAugmentation(
      createNote(SidebarLoader.url.href),
      Object.create(null),
    );
    chrome.runtime.sendMessage({ type: SWITCH_TO_TAB, url: SIDEBAR_TAB_NOTE_TAB });
  };

  const handleOpen = () => {
    chrome.runtime.sendMessage({ type: SWITCH_TO_TAB, url: SIDEBAR_TAB_NOTE_TAB });
  };

  return (
    <Button
      className={'insight-create-note'}
      type="primary"
      block
      onClick={hasNote ? handleOpen : handleCreate}
    >
      <Edit3 width={16} height={16} />
      {`\u00a0${hasNote ? OPEN_NOTE_BUTTON_TEXT : CREATE_NOTE_BUTTON_TEXT}`}
    </Button>
  );
};

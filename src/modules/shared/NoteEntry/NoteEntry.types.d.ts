import React, { FunctionComponent } from 'react';

declare module './NoteEntry' {
  type NoteEntryProps = {
    note: NoteRecord;
    slice: string;
    prefix: string;
    sliceNotes: NoteRecord[];
    setSliceNotes: React.Dispatch<React.SetStateAction<NoteRecord[]>>;
    setCurrentEditing: React.Dispatch<React.SetStateAction<string>>;
    setNewSliceNote: React.Dispatch<React.SetStateAction<NoteRecord>>;
  };

  type NoteEntry = FunctionComponent<NoteEntryProps>;
}

/**
 * @module modules:notes
 * @version 1.0.0
 * @license (C) Insight
 */

import React, { useCallback, useEffect, useState } from 'react';
import Collapse from 'antd/lib/collapse';
import SidebarLoader from 'lib/sidebar';
import UserManager from 'lib/user';
import { UserNotes } from 'modules/notes';
import { debug, extractUrlProperties, getUrlSlices, removeTrailingSlash } from 'lib/helpers';
import { NOTE_PREFIX } from 'constant';
import 'antd/lib/collapse/style/index.css';
import './UserNotesTab.scss';

const { Panel } = Collapse;

type TNoteTabContext = {
  userTags: string[];
  setUserTags: React.Dispatch<React.SetStateAction<string[]>>;
  searchedTag: string[];
  setSearchedTag: React.Dispatch<React.SetStateAction<string[]>>;
  sliceNotes: Record<string, NoteRecord[]>;
  setSliceNotes: React.Dispatch<React.SetStateAction<Record<string, NoteRecord[]>>>;
};

export const NoteTabContext = React.createContext<TNoteTabContext>(Object.create(null));

//-----------------------------------------------------------------------------------------------
// ! Magics
//-----------------------------------------------------------------------------------------------
const ALL_NOTES_PANEL_HEADER = 'All Notes';

//-----------------------------------------------------------------------------------------------
// ! Component
//-----------------------------------------------------------------------------------------------
export const UserNotesTab = () => {
  const [slices, setSlices] = useState<string[]>(getUrlSlices(SidebarLoader.url.href));
  const [searchedTag, setSearchedTag] = useState<string[]>(UserManager.user.lastUsedTags);
  const [userTags, setUserTags] = useState(UserManager.user.tags);
  const [sliceNotes, setSliceNotes] = useState<Record<string, NoteRecord[]>>(Object.create(null));

  const defaultKey = [slices[0]];

  //-----------------------------------------------------------------------------------------------
  // ! Handlers
  //-----------------------------------------------------------------------------------------------
  const getSliceNotes = useCallback(async (slicesToFetch: string[]) => {
    const storedNoteSlices = Object.create(null);
    const results = await new Promise<Record<string, NoteRecord[]>>((resolve) => {
      chrome.storage.sync.get(resolve);
    });
    slicesToFetch.forEach((slice) => {
      storedNoteSlices[slice] = results[`${NOTE_PREFIX}-${encodeURIComponent(slice)}`] ?? [];
    });
    setSliceNotes(storedNoteSlices);
  }, []);

  const testSlices = useCallback(async () => {
    const validSlices: string[] = [];
    for await (const slice of getUrlSlices(SidebarLoader.url.href)) {
      try {
        const { status: noCorsStatus, ok: noCorsOk } = await fetch(`https://${slice}`, {
          mode: 'no-cors',
        });
        const { status: corsStatus, ok: corsOk } = await fetch(`https://${slice}`, {
          mode: 'cors',
        });
        debug('UserNotesTab - Validate Slice - No-CORS', slice, noCorsStatus, noCorsOk);
        debug('UserNotesTab - Validate Slice - CORS', slice, corsStatus, corsOk);

        (corsOk || noCorsOk) && validSlices.push(slice);
      } catch (error) {
        debug('UserNotesTab - Validate Slice - Error', slice, error);
        continue;
      }
    }

    const currentURL = removeTrailingSlash(
      extractUrlProperties(window.location.href).fullWithParams ?? '',
    );
    !validSlices.includes(currentURL) && validSlices.push(currentURL);

    const currentHost = removeTrailingSlash(
      extractUrlProperties(window.location.href).hostname ?? '',
    );
    !validSlices.includes(currentHost) && validSlices.push(currentHost);

    setSlices(validSlices);

    getSliceNotes(validSlices);
  }, [getSliceNotes]);

  useEffect(() => {
    testSlices();
  }, [testSlices]);

  useEffect(() => {
    setUserTags(UserManager.user.tags);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [UserManager.user.tags]);

  useEffect(() => {
    setSearchedTag(UserManager.user.lastUsedTags);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [UserManager.user.lastUsedTags]);

  const context = {
    searchedTag,
    setSearchedTag,
    sliceNotes,
    setSliceNotes,
    userTags,
    setUserTags,
  };

  //-----------------------------------------------------------------------------------------------
  // ! Render
  //-----------------------------------------------------------------------------------------------
  return (
    <div className="notes-panel-container">
      <NoteTabContext.Provider value={context}>
        <Collapse accordion defaultActiveKey={defaultKey}>
          {slices.map((slice) => (
            <Panel header={slice} key={slice}>
              <UserNotes slice={slice} />
            </Panel>
          ))}
          <Panel header={ALL_NOTES_PANEL_HEADER} key={slices.length + 1}>
            <UserNotes slice={''} />
          </Panel>
        </Collapse>
      </NoteTabContext.Provider>
    </div>
  );
};

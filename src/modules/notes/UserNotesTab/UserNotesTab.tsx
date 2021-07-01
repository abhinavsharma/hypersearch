/**
 * @module modules:notes
 * @version 1.0.0
 * @license (C) Insight
 */

import React, { useCallback, useEffect, useState } from 'react';
import Collapse from 'antd/lib/collapse';
import SidebarLoader from 'lib/sidebar';
import { UserNotes } from 'modules/notes';
import { debug, getUrlSlices } from 'lib/helpers';
import 'antd/lib/collapse/style/index.css';

const { Panel } = Collapse;

//-----------------------------------------------------------------------------------------------
// ! Magics
//-----------------------------------------------------------------------------------------------
const ALL_NOTES_PANEL_HEADER = 'All Notes';

//-----------------------------------------------------------------------------------------------
// ! Component
//-----------------------------------------------------------------------------------------------
export const UserNotesTab = () => {
  const [slices, setSlices] = useState<string[]>(getUrlSlices(SidebarLoader.url.href));

  const defaultKey = [slices[0]];

  const testSlices = useCallback(async () => {
    const validSlices: string[] = [];
    for await (const slice of getUrlSlices(SidebarLoader.url.href)) {
      try {
        const { status } = await fetch(`https://${slice}`, { mode: 'no-cors' });
        debug('UserNotesTab - Validate Slice', status);
        status === 200 && validSlices.push(slice);
      } catch (error) {
        debug('UserNotesTab - Validate Slice - Error', slice, error);
      }
    }
    setSlices(validSlices);
  }, []);

  useEffect(() => {
    testSlices();
  }, [testSlices]);

  //-----------------------------------------------------------------------------------------------
  // ! Render
  //-----------------------------------------------------------------------------------------------
  return (
    <>
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
    </>
  );
};

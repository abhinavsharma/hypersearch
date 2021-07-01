/**
 * @module modules:notes
 * @version 1.0.0
 * @license (C) Insight
 */

import React, { useCallback, useEffect, useState } from 'react';
import Collapse from 'antd/lib/collapse';
import SidebarLoader from 'lib/sidebar';
import { UserNotes } from 'modules/notes';
import { debug, extractUrlProperties, getUrlSlices } from 'lib/helpers';
import { FORCED_NOTE_PANEL_URLS } from 'constant';
import 'antd/lib/collapse/style/index.css';
import './UserNotesTab.scss';

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
      if (
        FORCED_NOTE_PANEL_URLS.includes(extractUrlProperties(`https://${slice}`).hostname ?? '')
      ) {
        validSlices.push(slice);
        continue;
      }
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
    setSlices(validSlices);
  }, []);

  useEffect(() => {
    testSlices();
  }, [testSlices]);

  //-----------------------------------------------------------------------------------------------
  // ! Render
  //-----------------------------------------------------------------------------------------------
  return (
    <div className="notes-panel-container">
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
    </div>
  );
};

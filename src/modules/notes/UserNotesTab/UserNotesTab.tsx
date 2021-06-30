/**
 * @module modules:notes
 * @version 1.0.0
 * @license (C) Insight
 */

import React from 'react';
import Collapse from 'antd/lib/collapse';
import SidebarLoader from 'lib/sidebar';
import { UserNotes } from 'modules/notes';
import { getUrlSlices } from 'lib/helpers';
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
  const urlSlices = getUrlSlices(SidebarLoader.url.href);
  const defaultKey = [urlSlices[0]];

  //-----------------------------------------------------------------------------------------------
  // ! Render
  //-----------------------------------------------------------------------------------------------
  return (
    <>
      <Collapse accordion defaultActiveKey={defaultKey}>
        {urlSlices.map((slice) => (
          <Panel header={slice} key={slice}>
            <UserNotes slice={slice} />
          </Panel>
        ))}
        <Panel header={ALL_NOTES_PANEL_HEADER} key={urlSlices.length + 1}>
          <UserNotes slice={''} />
        </Panel>
      </Collapse>
    </>
  );
};

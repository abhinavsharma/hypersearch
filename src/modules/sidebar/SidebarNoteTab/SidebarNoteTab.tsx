/**
 * @module modules:sidebar
 * @version 1.0.0
 * @license (C) Insight
 */

import React from 'react';
import Collapse from 'antd/lib/collapse';
import { SidebarSliceNote } from 'modules/sidebar';
import { extractPublication, extractUrlProperties, makeEllipsis } from 'lib/helpers';
import {
  HOSTNAME_NOTE_PREFIX,
  NOTE_PREFIX,
  PUBLICATION_NOTE_PREFIX,
  SLICE_NOTE_PREFIX,
  URL_NOTE_PREFIX,
} from 'constant';
import 'antd/lib/collapse/style/index.css';

const { Panel } = Collapse;

//-----------------------------------------------------------------------------------------------
// ! Magics
//-----------------------------------------------------------------------------------------------
const PANEL_HEADER = 'Notes for <placeholder>';
const ALL_NOTES_PANEL_HEADER = 'All Notes';

export const SidebarNoteTab: SidebarNoteTab = ({ url }) => {
  const { full, hostname } = extractUrlProperties(url);
  const slice = full?.split('/').slice(0, 2).join('/') ?? '';
  const publication = extractPublication(url);

  if (!full && !hostname) {
    return null;
  }

  const SHOW_FIRST_SLICE = slice && full !== slice && hostname !== slice && full !== slice + '/';

  const SHOW_PUBLICATION_NOTES =
    publication !== hostname &&
    publication !== slice &&
    publication !== full &&
    publication + '/' !== full;

  const SHOW_HOSTNAME_NOTES = hostname && full !== hostname && full !== hostname + '/';

  return (
    <Collapse accordion defaultActiveKey={['1']}>
      {full && (
        <Panel header={makeEllipsis(PANEL_HEADER.replace('<placeholder>', full), 50)} key="1">
          <SidebarSliceNote slice={full} prefix={URL_NOTE_PREFIX} />
        </Panel>
      )}
      {SHOW_FIRST_SLICE && (
        <Panel header={makeEllipsis(PANEL_HEADER.replace('<placeholder>', slice), 50)} key="2">
          <SidebarSliceNote slice={slice} prefix={SLICE_NOTE_PREFIX} />
        </Panel>
      )}
      {SHOW_PUBLICATION_NOTES && (
        <Panel
          header={makeEllipsis(PANEL_HEADER.replace('<placeholder>', publication), 50)}
          key="3"
        >
          <SidebarSliceNote slice={publication} prefix={PUBLICATION_NOTE_PREFIX} />
        </Panel>
      )}
      {SHOW_HOSTNAME_NOTES && (
        <Panel
          header={makeEllipsis(PANEL_HEADER.replace('<placeholder>', hostname + ''), 50)}
          key="4"
        >
          <SidebarSliceNote slice={hostname + ''} prefix={HOSTNAME_NOTE_PREFIX} />
        </Panel>
      )}
      <Panel header={ALL_NOTES_PANEL_HEADER} key="5">
        <SidebarSliceNote slice={''} prefix={NOTE_PREFIX} />
      </Panel>
    </Collapse>
  );
};

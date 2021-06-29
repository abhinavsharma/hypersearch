import React from 'react';
import Collapse from 'antd/lib/collapse';
import SidebarLoader from 'lib/sidebar';
import { UrlSliceNotes } from 'modules/shared';
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
export const SidebarNotesTab = () => {
  const urlSlices = getUrlSlices(SidebarLoader.url.href);

  //-----------------------------------------------------------------------------------------------
  // ! Render
  //-----------------------------------------------------------------------------------------------
  return (
    <>
      <Collapse accordion defaultActiveKey={['1']}>
        {urlSlices.map((slice) => (
          <Panel header={slice} key={slice}>
            <UrlSliceNotes slice={slice} />
          </Panel>
        ))}
        <Panel header={ALL_NOTES_PANEL_HEADER} key={urlSlices.length + 1}>
          <UrlSliceNotes slice={''} />
        </Panel>
      </Collapse>
    </>
  );
};

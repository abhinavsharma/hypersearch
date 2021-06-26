/**
 * @module modules:sidebar
 * @version 1.0.0
 * @license (C) Insight
 */

import React from 'react';
import Collapse from 'antd/lib/collapse';
import Button from 'antd/lib/button';
import { PublicationNotes } from 'modules/shared';
import SidebarLoader from 'lib/sidebar';
import { flipSidebar } from 'lib/flip';
import { usePublicationInfo } from 'lib/publication';
import {
  extractPublication,
  extractUrlProperties,
  getFirstValidTabIndex,
  makeEllipsis,
} from 'lib/helpers';
import {
  HOSTNAME_NOTE_PREFIX,
  NOTE_PREFIX,
  PUBLICATION_NOTE_PREFIX,
  SLICE_NOTE_PREFIX,
  SWITCH_TO_TAB,
  URL_NOTE_PREFIX,
} from 'constant';
import 'antd/lib/button/style/index.css';
import 'antd/lib/collapse/style/index.css';

const { Panel } = Collapse;

//-----------------------------------------------------------------------------------------------
// ! Magics
//-----------------------------------------------------------------------------------------------
const HEADER_TITLE = 'Notes';
const HEADER_LEFT_BUTTON_TEXT = 'Close';
const PANEL_HEADER = 'Notes for <placeholder>';
const URL_NOTES_PANEL_HEADER = 'Notes for this page';
const ALL_NOTES_PANEL_HEADER = 'All Notes';

//-----------------------------------------------------------------------------------------------
// ! Component
//-----------------------------------------------------------------------------------------------
export const NotePage: NotePage = ({ url = window.location.href, customUrl, forceCustom }) => {
  const { publicationInfo } = usePublicationInfo(customUrl || url);

  const handleClose = () => {
    const firstIndex = getFirstValidTabIndex(SidebarLoader.sidebarTabs);
    Number(firstIndex) > 0
      ? chrome.runtime.sendMessage({
          type: SWITCH_TO_TAB,
          index: firstIndex,
        })
      : flipSidebar(document, 'hide', SidebarLoader);
  };

  const { hostname } = extractUrlProperties(url);

  const fullUrl =
    extractUrlProperties(forceCustom ? customUrl ?? window.location.href : window.location.href)
      .full ?? '';

  const slice = fullUrl?.split('/').slice(0, 2).join('/') ?? '';

  if (!hostname) {
    return null;
  }

  const publication = publicationInfo.publication ?? extractPublication(customUrl ?? '');

  const SHOW_URL_NOTES = publication !== fullUrl && publication + '/' !== fullUrl;

  const SHOW_FIRST_SLICE =
    fullUrl !== slice && hostname !== slice && fullUrl !== slice + '/' && publication !== slice;

  const SHOW_HOSTNAME_NOTES =
    publication !== hostname && fullUrl !== hostname && fullUrl !== hostname + '/';

  //-----------------------------------------------------------------------------------------------
  // ! Render
  //-----------------------------------------------------------------------------------------------
  return (
    <div className="sidebar-page">
      <header className="sidebar-page-header">
        <Button type="link" className="left-button" onClick={handleClose}>
          {HEADER_LEFT_BUTTON_TEXT}
        </Button>
        <span className="page-title">{HEADER_TITLE}</span>
      </header>
      <Collapse accordion defaultActiveKey={['1']}>
        {SHOW_URL_NOTES && (
          <Panel header={URL_NOTES_PANEL_HEADER} key="1">
            <PublicationNotes slice={fullUrl} prefix={URL_NOTE_PREFIX} />
          </Panel>
        )}
        {SHOW_FIRST_SLICE && (
          <Panel header={makeEllipsis(PANEL_HEADER.replace('<placeholder>', slice), 50)} key="2">
            <PublicationNotes slice={slice} prefix={SLICE_NOTE_PREFIX} />
          </Panel>
        )}
        {publication && (
          <Panel
            header={makeEllipsis(PANEL_HEADER.replace('<placeholder>', publication), 50)}
            key="3"
          >
            <PublicationNotes slice={publication ?? ''} prefix={PUBLICATION_NOTE_PREFIX} />
          </Panel>
        )}
        {SHOW_HOSTNAME_NOTES && (
          <Panel
            header={makeEllipsis(PANEL_HEADER.replace('<placeholder>', hostname + ''), 50)}
            key="4"
          >
            <PublicationNotes slice={hostname + ''} prefix={HOSTNAME_NOTE_PREFIX} />
          </Panel>
        )}
        <Panel header={ALL_NOTES_PANEL_HEADER} key="5">
          <PublicationNotes slice={''} prefix={NOTE_PREFIX} />
        </Panel>
      </Collapse>
    </div>
  );
};

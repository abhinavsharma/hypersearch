/**
 * @module modules:pages
 * @version 1.0.0
 * @license (C) Insight
 */

import React from 'react';
import Button from 'antd/lib/button';
import Divider from 'antd/lib/divider';
import { PublicationNotes } from 'modules/shared';
import { MESSAGE, PAGE, PUBLICATION_NOTE_PREFIX } from 'constant';
import 'antd/lib/button/style/index.css';
import 'antd/lib/divider/style/index.css';
import './PublicationPage.scss';

//-----------------------------------------------------------------------------------------------
// ! Magics
//-----------------------------------------------------------------------------------------------

const HEADER_TITLE = 'Review';
const HEADER_LEFT_BUTTON_TEXT = 'Close';
const PAGE_HEADER = '<placeholder>';
const PAGE_RATING_TEXT = '<placeholder> ⭐';
const PAGE_REVIEWS_HEADER = 'Trusted Reviews';

//-----------------------------------------------------------------------------------------------
// ! Component
//-----------------------------------------------------------------------------------------------

export const PublicationPage: PublicationPage = ({ rating, info }) => {
  const handleClose = () => {
    chrome.runtime.sendMessage({
      type: MESSAGE.OPEN_PAGE,
      page: PAGE.ACTIVE,
    });
  };

  const externals: PublicationTag[] = info?.tags ?? [];

  return (
    <div id="settings-page" className="sidebar-page">
      <header className="sidebar-page-header">
        <Button type="link" className="left-button" onClick={handleClose}>
          {HEADER_LEFT_BUTTON_TEXT}
        </Button>
        <span className="page-title">{HEADER_TITLE}</span>
      </header>
      <div className="sidebar-page-wrapper">
        <section>
          <h2 className="title">
            {PAGE_HEADER.replace('<placeholder>', (info?.publication || info?.url) ?? '')}
          </h2>
          <span className="publication-page-rating">
            {PAGE_RATING_TEXT.replace('<placeholder>', String(rating))}
          </span>
          <h2 className="title">{PAGE_REVIEWS_HEADER}</h2>
          <div className="publication-notes-wrapper">
            <PublicationNotes
              slice={(info?.publication || info?.url) ?? ''}
              prefix={PUBLICATION_NOTE_PREFIX}
              externals={externals}
            />
          </div>
          <Divider />
        </section>
      </div>
    </div>
  );
};

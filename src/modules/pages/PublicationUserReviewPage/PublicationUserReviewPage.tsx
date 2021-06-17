import React from 'react';
import Button from 'antd/lib/button';
import Divider from 'antd/lib/divider';
import List from 'antd/lib/list';
import { OPEN_AUGMENTATION_BUILDER_MESSAGE, SIDEBAR_PAGE } from 'constant';
import 'antd/lib/list/style/index.css';
import 'antd/lib/switch/style/index.css';
import 'antd/lib/button/style/index.css';
import './PublicationUserReviewPage.scss';

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
export const PublicationUserReviewPage: PublicationUserReviewPage = ({ rating, info }) => {
  //-----------------------------------------------------------------------------------------------
  // ! Handlers
  //-----------------------------------------------------------------------------------------------
  const handleClose = () => {
    chrome.runtime.sendMessage({
      type: OPEN_AUGMENTATION_BUILDER_MESSAGE,
      page: SIDEBAR_PAGE.ACTIVE,
    });
  };

  const item = (item: PublicationTag) => (
    <List.Item>
      <div className="publication-page-user-review-row">
        <span>{item.rating}&nbsp;⭐&nbsp;</span>
        <span>{item.text}</span>
      </div>
    </List.Item>
  );

  const header = <h2 className="title">{PAGE_REVIEWS_HEADER}</h2>;

  //-----------------------------------------------------------------------------------------------
  // ! Render
  //-----------------------------------------------------------------------------------------------
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
          <h2 className="title">{PAGE_HEADER.replace('<placeholder>', info?.url)}</h2>
          <span className="publication-page-rating">
            {PAGE_RATING_TEXT.replace('<placeholder>', String(rating))}
          </span>
          <span className="publication-page-description">{info?.description}</span>
          <Divider />
        </section>
        <section>
          <List header={header} dataSource={info?.tags} renderItem={item} />
        </section>
      </div>
    </div>
  );
};

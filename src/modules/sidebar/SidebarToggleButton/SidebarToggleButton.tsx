/**
 * @module SidebarToggleButton
 * @author Matyas Angyal<matyas@laso.ai>
 * @license (C) Insight
 * @version 1.0.0
 */
import React from 'react';
import List from 'antd/lib/list';
import Button from 'antd/lib/button';
import Tooltip from 'antd/lib/tooltip';
import {
  flipSidebar,
  AIRTABLE_IMPROVE_SEARCH_LINK,
  EMPTY_AUGMENTATION,
  HIDE_TAB_FAKE_URL,
  getFirstValidTabIndex,
  APP_NAME,
  OPEN_AUGMENTATION_BUILDER_MESSAGE,
  OPEN_BUILDER_PAGE,
} from 'utils';
import 'antd/lib/divider/style/index.css';
import 'antd/lib/button/style/index.css';
import 'antd/lib/tooltip/style/index.css';
import './SidebarToggleButton.scss';

const removeEmoji = (s) => {
  return s.replace(/^[^\w\s]*/gi, '');
};

export const SidebarToggleButton: SidebarToggleButton = ({ tabs }) => {
  const handleClick = () => {
    if (!tabs.length) {
      chrome.runtime.sendMessage({
        type: OPEN_AUGMENTATION_BUILDER_MESSAGE,
        page: OPEN_BUILDER_PAGE.BUILDER,
        augmentation: EMPTY_AUGMENTATION,
      } as OpenBuilderMessage);
    }
    flipSidebar(document, 'show', tabs?.length);
  };

  const ListItem = (item: SidebarTab) => (
    <List.Item>
      <List.Item.Meta
        title={removeEmoji(item.title.length > 36 ? item.title.slice(0, 35) + '...' : item.title)}
      />
    </List.Item>
  );

  return getFirstValidTabIndex(tabs) !== '0' ? (
    <Tooltip title={'Preview lenses ("I" key)'} destroyTooltipOnHide={{ keepParent: false }}>
      <div onClick={handleClick} className="insight-sidebar-toggle-button">
        <div className="insight-sidebar-toggle-appname">
          <span className="insight-sidebar-toggle-appname-text">{APP_NAME}</span>
        </div>
        <List
          style={{ paddingRight: 5 }}
          itemLayout="horizontal"
          dataSource={tabs.filter(({ url }) => url?.href !== HIDE_TAB_FAKE_URL)}
          renderItem={ListItem}
        />
      </div>
    </Tooltip>
  ) : (
    <div className="add-augmentation-button insight-sidebar-toggle-button empty">
      <div className="insight-sidebar-toggle-appname">
        <span className="insight-sidebar-toggle-appname-text">{APP_NAME}</span>
      </div>
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <Button type="text" target="blank" href={AIRTABLE_IMPROVE_SEARCH_LINK}>
          Send Feedback
        </Button>
        <Button type="text" onClick={handleClick}>
          Create a lens
        </Button>
      </div>
    </div>
  );
};

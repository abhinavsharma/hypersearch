/**
 * @module SidebarToggleButton
 * @author Abhinav Sharma<abhinav@laso.ai>
 * @author Matyas Angyal<matyas@laso.ai>
 * @license (C) Insight
 * @version 1.0.0
 */
import React from 'react';
import List from 'antd/lib/list';
import Tooltip from 'antd/lib/tooltip';
import {
  flipSidebar,
  removeEmoji,
  APP_NAME,
  EMPTY_AUGMENTATION,
  HIDE_TAB_FAKE_URL,
  OPEN_AUGMENTATION_BUILDER_MESSAGE,
  OPEN_BUILDER_PAGE,
  URL_PARAM_TAB_TITLE_KEY,
  EXPAND_KEY,
} from 'utils';
import 'antd/lib/divider/style/index.css';
import 'antd/lib/button/style/index.css';
import 'antd/lib/tooltip/style/index.css';
import 'antd/lib/list/style/index.css';
import './SidebarToggleButton.scss';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';

/** MAGICS **/
const TOOLTIP_TEXT = `Preview lenses ("${EXPAND_KEY.KEY}" key)`;
const MORE_TABS_TEXT = '<placeholder> more';
const LIST_STYLE = { paddingRight: 5 };
const MAX_TAB_LENGTH = 3;

export const SidebarToggleButton: SidebarToggleButton = ({ tabs }) => {
  const handleClick = () => {
    if (!tabs.length) {
      chrome.runtime.sendMessage({
        type: OPEN_AUGMENTATION_BUILDER_MESSAGE,
        page: OPEN_BUILDER_PAGE.BUILDER,
        augmentation: EMPTY_AUGMENTATION,
      } as OpenBuilderMessage);
    }
    SidebarLoader.isPreview = true;
    flipSidebar(document, 'show', tabs?.length, SidebarLoader.maxAvailableSpace);
  };

  const ListItem = (item: SidebarTab) => (
    <List.Item>
      <List.Item.Meta
        title={item.url.searchParams.get(URL_PARAM_TAB_TITLE_KEY) ?? removeEmoji(item.title)}
      />
    </List.Item>
  );

  const filteredTabs = tabs.filter(({ url }) => url?.href !== HIDE_TAB_FAKE_URL);

  // Calculate the relative height of the nub by using the tab's title length
  const tabHeight = filteredTabs.length
    ? tabs.slice(0, MAX_TAB_LENGTH + 1).reduce((a, tab) => {
        const titleLength = tab.title.length * 8 < 50 ? 50 : tab.title.length * 8; // 1 ch is approximately 8 px
        const titleSpace = 50; // space for one line
        return a + Math.abs(titleLength / titleSpace) * 30; // average height of a line
      }, 0)
    : 0;

  const dataSource =
    tabs.length > 3
      ? filteredTabs.slice(0, MAX_TAB_LENGTH).concat([
          {
            id: '0',
            url: new URL('https://example.com'),
            description: '',
            augmentation: Object.create(null),
            title: MORE_TABS_TEXT.replace(
              '<placeholder>',
              String(filteredTabs.length - MAX_TAB_LENGTH),
            ),
          },
        ])
      : filteredTabs;

  const keepParent = { keepParent: false };

  return (
    <Tooltip title={TOOLTIP_TEXT} destroyTooltipOnHide={keepParent}>
      <div onClick={handleClick} className="insight-sidebar-toggle-button" data-height={tabHeight}>
        <div className="insight-sidebar-toggle-appname">
          <span className="insight-sidebar-toggle-appname-text">{APP_NAME}</span>
        </div>
        <List
          style={LIST_STYLE}
          itemLayout="horizontal"
          dataSource={dataSource}
          renderItem={ListItem}
        />
      </div>
    </Tooltip>
  );
};

/**
 * @module SidebarToggleButton
 * @author Matyas Angyal<matyas@laso.ai>
 * @license (C) Insight
 * @version 1.0.0
 */
import React from 'react';
import List from 'antd/lib/list';
import Tooltip from 'antd/lib/tooltip';
import {
  flipSidebar,
  EMPTY_AUGMENTATION,
  HIDE_TAB_FAKE_URL,
  APP_NAME,
  OPEN_AUGMENTATION_BUILDER_MESSAGE,
  OPEN_BUILDER_PAGE,
  removeEmoji,
} from 'utils';
import 'antd/lib/divider/style/index.css';
import 'antd/lib/button/style/index.css';
import 'antd/lib/tooltip/style/index.css';
import './SidebarToggleButton.scss';

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
        title={
          item.url.searchParams.get('insight-tab-title') ??
          removeEmoji(item.title.length > 30 ? item.title.slice(0, 29) + '...' : item.title)
        }
      />
    </List.Item>
  );

  // Calculate the relative height of the nub by using the tab's title length
  const tabHeight = tabs.reduce((a, tab) => {
    const titleLength = tab.title.length * 8 < 70 ? 70 : tab.title.length * 8; // 1 ch is approximately 8 px
    const titleSpace = 70; // space for one line is 75px
    return a + Math.abs(titleLength / titleSpace) * 30; // average height of a line is 25px
  }, 0);

  return (
    <Tooltip title={'Preview lenses ("I" key)'} destroyTooltipOnHide={{ keepParent: false }}>
      <div onClick={handleClick} className="insight-sidebar-toggle-button" data-height={tabHeight}>
        <div className="insight-sidebar-toggle-appname">
          <span className="insight-sidebar-toggle-appname-text">{APP_NAME}</span>
        </div>
        <List
          style={{ paddingRight: 5 }}
          itemLayout="horizontal"
          dataSource={
            tabs.length > 3
              ? tabs
                  .filter(({ url }) => url?.href !== HIDE_TAB_FAKE_URL)
                  .slice(0, 3)
                  .concat([
                    {
                      title: `${tabs.length - 3} more`,
                      id: 'FAKE_ID',
                      url: new URL('https://example.com'),
                    },
                  ])
              : tabs.filter(({ url }) => url?.href !== HIDE_TAB_FAKE_URL)
          }
          renderItem={ListItem}
        />
      </div>
    </Tooltip>
  );
};

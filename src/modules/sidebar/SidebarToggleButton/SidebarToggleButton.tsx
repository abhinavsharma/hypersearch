/**
 * @module SidebarToggleButton
 * @author Matyas Angyal<matyas@laso.ai>
 * @license (C) Insight
 * @version 1.0.0
 */
import React, { Suspense } from 'react';
import List from 'antd/lib/list';
import Button from 'antd/lib/button';
import Divider from 'antd/lib/divider';
import { goTo } from 'route-lite';
import { flipSidebar } from 'utils/flipSidebar/flipSidebar';
import { EditAugmentationPage } from 'modules/augmentations';
import {
  AIRTABLE_IMPROVE_SEARCH_LINK,
  EMPTY_AUGMENTATION,
  HIDE_TAB_FAKE_URL,
  getFirstValidTabIndex,
  APP_NAME,
} from 'utils';
import 'antd/lib/divider/style/index.css';
import 'antd/lib/button/style/index.css';
import './SidebarToggleButton.scss';
import {} from 'utils';

const DoubleLeftOutlined = React.lazy(
  async () => await import('@ant-design/icons/DoubleLeftOutlined').then((mod) => mod),
);

export const SidebarToggleButton: SidebarToggleButton = ({ tabs }) => {
  const handleClick = () => {
    if (!tabs.length) {
      goTo(EditAugmentationPage, { augmentation: EMPTY_AUGMENTATION, isAdding: true });
    }
    flipSidebar(document, 'show', tabs?.length);
  };

  const ListItem = (item: SidebarTab) => (
    <List.Item>
      <List.Item.Meta
        title={item.title.length > 18 ? item.title.slice(0, 17) + '...' : item.title}
      />
    </List.Item>
  );

  return getFirstValidTabIndex(tabs) !== '0' ? (
    <div onClick={handleClick} className="insight-sidebar-toggle-button">
      <div className="insight-sidebar-toggle-appname">
        <Suspense fallback={null}>
          <DoubleLeftOutlined />
        </Suspense>
        <span className="insight-sidebar-toggle-appname-text">
          {APP_NAME}
        </span>
      </div>
      <List
        itemLayout="horizontal"
        dataSource={tabs.filter(({ url }) => url?.href !== HIDE_TAB_FAKE_URL)}
        renderItem={ListItem}
      />
    </div>
  ) : (
    <div className="add-augmentation-button insight-sidebar-toggle-button empty">
      <div className="insight-sidebar-toggle-appname">{APP_NAME}</div>
      <Button type="text" target="blank" href={AIRTABLE_IMPROVE_SEARCH_LINK}>
        🤔 Send Feedback
      </Button>
      <Divider />
      <Button type="text" onClick={handleClick}>
        Create a lens
      </Button>
    </div>
  );
};

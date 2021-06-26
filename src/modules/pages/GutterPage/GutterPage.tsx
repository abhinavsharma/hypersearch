/**
 * @module modules:pages
 * @version 1.0.0
 * @license (C) Insight
 */

import React, { Suspense, useState } from 'react';
import Button from 'antd/lib/button';
import { Edit3 } from 'react-feather';
import Tag from 'antd/lib/tag';
import Divider from 'antd/lib/divider';
import SidebarLoader from 'lib/sidebar';
import AugmentationManager from 'lib/augmentations';
import { DomainStateCheckbox } from 'modules/gutter/DomainStateCheckbox/DomainStateCheckbox';
import {
  ACTION_KEY,
  ACTION_LABEL,
  LEGACY_ACTION_TYPE,
  EMPTY_AUGMENTATION,
  MESSAGE,
  PAGE,
  PROTECTED_AUGMENTATIONS,
  AUGMENTATION_ID,
} from 'constant';
import 'antd/lib/divider/style/index.css';
import 'antd/lib/button/style/index.css';
import 'antd/lib/tag/style/index.css';
import './GutterPage.scss';

const PlusOutlined = React.lazy(
  async () => await import('@ant-design/icons/PlusOutlined').then((mod) => mod),
);

//-----------------------------------------------------------------------------------------------
// ! Magics
//-----------------------------------------------------------------------------------------------
const HEADER_LEFT_BUTTON_TEXT = 'Close';
const HEADER_TITLE = 'Domain Settings';
const INSTALLED_SECTION_TITLE = 'Add this domain to a local lens';
const INSTALLED_SECTION_SUBTITLE = 'When this lens is triggered then this domain will be searched';
const HIDING_SECTION_TITLE = 'Lenses that block this domain';
const HIDING_SECTION_SUBTITLE = '';
const SEARCHING_SECTION_TITLE = 'Lenses that search this domain';
const SEARCHING_SECTION_SUBTITLE = '';
const DISABLED_SUGGESTED_BUTTON_TEXT = 'Disable Lens';
const REMOVE_FROM_INSTALLED_BUTTON_TEXT = 'Remove from Lens';
const ADD_TO_AUGMENTATION_BUTTON_TEXT = 'Add to Lens';
const ADD_TO_TRUSTLIST_BUTTON_SUBTITLE = 'Mark domains as trusted source';
const ADD_TO_AUGMENTATION_BUTTON_SUBTITLE = 'Currently searches';
const ADD_TO_AUGMENTATION_BUTTON_NEW_ACTION = 'Add as new action';
const CREATE_NEW_SEARCHING_AUGMENTATION_BUTTON_TEXT = 'Create new Lens that searches this domain';
const EDIT_SUGGESTED_AUGMENTATION_BUTTON_TEXT = 'Fork Lens';
const EDIT_INSTALLED_AUGMENTATION_BUTTON_TEXT = 'Edit Lens';
const OPEN_NOTE_BUTTON_TEXT = 'Open notes for this page';

//-----------------------------------------------------------------------------------------------
// ! Component
//-----------------------------------------------------------------------------------------------
export const GutterPage: GutterPage = ({ hidingAugmentations = [], domain, inline }) => {
  const [currentHiders, setCurrentHiders] = useState<Augmentation[]>(
    hidingAugmentations.filter(({ id }) => id !== AUGMENTATION_ID.BLOCKLIST),
  );

  const searchingAugmentations = [
    ...SidebarLoader.installedAugmentations,
    ...SidebarLoader.suggestedAugmentations,
    ...SidebarLoader.otherAugmentations.filter(({ installed }) => installed),
  ].filter(
    (augmentation) =>
      !!augmentation.actions.action_list.filter(({ key, value }) => {
        if (key === ACTION_KEY.SEARCH_DOMAINS) {
          return !!value.find((searchedDomain) => searchedDomain === domain);
        }
        return false;
      }).length && augmentation.id !== AUGMENTATION_ID.TRUSTLIST,
  );

  const availableLocalAugmentations: Record<
    string,
    Array<Augmentation & { actionIndex: number }>
  > = [
    ...SidebarLoader.installedAugmentations,
    ...SidebarLoader.otherAugmentations.filter(({ installed }) => installed),
  ].reduce((a, augmentation) => {
    const isNote = augmentation.actions.action_list.find(
      (action) => action.key === ACTION_KEY.URL_NOTE,
    );
    const searchDomainActions = augmentation.actions.action_list.reduce(
      (actions, action, index) => {
        const { key, value } = action;
        if (key === ACTION_KEY.SEARCH_DOMAINS && !value.includes(domain)) {
          actions.push({ ...action, index });
        }
        return actions;
      },
      [] as Array<ActionObject & { index: number }>,
    );
    if (!Array.isArray(a[domain])) a[domain] = [];
    if (!(PROTECTED_AUGMENTATIONS as readonly string[]).includes(augmentation.id)) {
      searchDomainActions.forEach((action) => {
        a[domain].push({ ...augmentation, actionIndex: action.index });
      });
      !isNote &&
        a[domain].push({ ...augmentation, actionIndex: augmentation.actions.action_list.length });
    }
    return a;
  }, Object.create(null));

  const sections: Section[] = [
    {
      type: 'local',
      augmentations: availableLocalAugmentations[domain],
      title: INSTALLED_SECTION_TITLE,
      subtitle: INSTALLED_SECTION_SUBTITLE,
    },
    {
      type: 'block',
      augmentations: currentHiders,
      title: HIDING_SECTION_TITLE,
      subtitle: HIDING_SECTION_SUBTITLE,
    },
    {
      type: 'search',
      augmentations: searchingAugmentations,
      title: SEARCHING_SECTION_TITLE,
      subtitle: SEARCHING_SECTION_SUBTITLE,
    },
  ];

  //-----------------------------------------------------------------------------------------------
  // ! Handlers
  //-----------------------------------------------------------------------------------------------

  const handleClose = () => {
    chrome.runtime.sendMessage({
      type: MESSAGE.OPEN_PAGE,
      page: PAGE.ACTIVE,
    });
  };

  const handleAddSearchDomainToLocal = (augmentation: Augmentation, index: number) => {
    const newActions = augmentation.actions.action_list.map((action, actionIndex) =>
      actionIndex === index ? { ...action, value: [...action.value, domain] } : action,
    );
    if (index === augmentation.actions.action_list.length) {
      newActions.push({
        key: ACTION_KEY.SEARCH_DOMAINS,
        label: ACTION_LABEL.SEARCH_DOMAINS,
        value: [domain],
        type: LEGACY_ACTION_TYPE.LIST,
      });
    }
    AugmentationManager.addOrEditAugmentation(augmentation, {
      actions: newActions,
    });
  };

  const handleEditInstalled = (augmentation: Augmentation) => {
    chrome.runtime.sendMessage({
      type: MESSAGE.OPEN_PAGE,
      page: PAGE.BUILDER,
      augmentation,
    });
  };

  const handleDeleteInstalled = (augmentation: Augmentation, type: Section['type']) => {
    const checkKey = type === 'block' ? ACTION_KEY.SEARCH_HIDE_DOMAIN : ACTION_KEY.SEARCH_DOMAINS;
    const newData: Record<string, any> = {
      actions: augmentation.actions.action_list.map((action) => {
        const { key, value } = action;
        return key === checkKey
          ? { ...action, value: value.filter((valueDomain) => valueDomain !== domain) }
          : action;
      }),
    };
    if (type === 'block') {
      setCurrentHiders((prev) => prev.filter(({ id }) => id !== augmentation.id));
      SidebarLoader.hideDomains = SidebarLoader.hideDomains.filter((hidden) => hidden !== domain);
    }
    AugmentationManager.addOrEditAugmentation(augmentation, newData);
  };

  const handleDisableSuggested = (augmentation: Augmentation, type: Section['type']) => {
    if (type === 'block') {
      setCurrentHiders((prev) => prev.filter(({ id }) => id !== augmentation.id));
      SidebarLoader.hideDomains = SidebarLoader.hideDomains.filter((hidden) => hidden !== domain);
    }
    AugmentationManager.disableSuggestedAugmentation(augmentation);
  };

  const handleCreateAugmentation = () => {
    chrome.runtime.sendMessage({
      type: MESSAGE.OPEN_PAGE,
      page: PAGE.BUILDER,
      create: true,
      augmentation: {
        ...EMPTY_AUGMENTATION,
        actions: {
          ...EMPTY_AUGMENTATION.actions,
          action_list: [
            {
              key: ACTION_KEY.SEARCH_DOMAINS,
              label: ACTION_LABEL.SEARCH_DOMAINS,
              type: LEGACY_ACTION_TYPE.LIST,
              value: [domain],
            },
          ],
        },
      },
    });
  };

  const handleOpenNotes = () => {
    chrome.runtime.sendMessage({
      type: MESSAGE.OPEN_PAGE,
      page: PAGE.NOTES,
      url: domain,
      publication: domain,
      forceCustom: true,
    });
  };

  //-----------------------------------------------------------------------------------------------
  // ! Render
  //-----------------------------------------------------------------------------------------------
  return (
    <div id="gutter-page" className={`sidebar-page ${inline ? 'inline-gutter-page-embedded' : ''}`}>
      {!inline && (
        <header className="sidebar-page-header">
          <Button type="link" onClick={handleClose} className="left-button">
            {HEADER_LEFT_BUTTON_TEXT}
          </Button>
          <span className="page-title">{HEADER_TITLE}</span>
        </header>
      )}
      <div className="sidebar-page-wrapper">
        <section>
          <Button className={'insight-create-note'} type="primary" block onClick={handleOpenNotes}>
            <Edit3 width={16} height={16} />
            {`\u00a0${OPEN_NOTE_BUTTON_TEXT}`}
          </Button>
          <h3 className="domain-text">
            <code>{domain}</code>
          </h3>
          <DomainStateCheckbox domain={domain} />
        </section>
        {sections.map(({ title, subtitle, augmentations, type }) =>
          augmentations?.length ? (
            <React.Fragment key={title}>
              <Divider />
              <section>
                {title && augmentations?.length > 0 && <h2 className="title">{title}</h2>}
                {subtitle && augmentations?.length > 0 && <h3 className="sub-title">{subtitle}</h3>}
                {augmentations.map((augmentation) => {
                  const handleAddToLocal = () =>
                    handleAddSearchDomainToLocal(augmentation, augmentation.actionIndex ?? -1);
                  const handleEdit = () => handleEditInstalled(augmentation);
                  const handleDelete = () => handleDeleteInstalled(augmentation, type);
                  const handleDisable = () => handleDisableSuggested(augmentation, type);
                  switch (type) {
                    case 'block':
                      return (
                        <div className="insight-augmentation-row" key={augmentation.id}>
                          {augmentation.name}
                          {!augmentation.installed ? (
                            <Tag
                              className="insight-augmentation-row-button"
                              color="volcano"
                              onClick={handleDisable}
                            >
                              {DISABLED_SUGGESTED_BUTTON_TEXT}
                            </Tag>
                          ) : (
                            <Tag
                              className="insight-augmentation-row-button"
                              color="volcano"
                              onClick={handleDelete}
                            >
                              {REMOVE_FROM_INSTALLED_BUTTON_TEXT}
                            </Tag>
                          )}
                        </div>
                      );
                    case 'search':
                      return (
                        <div className="insight-augmentation-row" key={augmentation.id}>
                          {augmentation.name}
                          <Tag
                            className="insight-augmentation-row-button"
                            color="geekblue"
                            onClick={handleEdit}
                          >
                            {!augmentation.installed
                              ? EDIT_SUGGESTED_AUGMENTATION_BUTTON_TEXT
                              : EDIT_INSTALLED_AUGMENTATION_BUTTON_TEXT}
                          </Tag>
                          {!augmentation.installed ? (
                            <Tag
                              className="insight-augmentation-row-button"
                              color="volcano"
                              onClick={handleDisable}
                            >
                              {DISABLED_SUGGESTED_BUTTON_TEXT}
                            </Tag>
                          ) : (
                            <Tag
                              className="insight-augmentation-row-button"
                              color="volcano"
                              onClick={handleDelete}
                            >
                              {REMOVE_FROM_INSTALLED_BUTTON_TEXT}
                            </Tag>
                          )}
                        </div>
                      );
                    case 'local':
                      return (
                        <div
                          className="insight-augmentation-row"
                          key={augmentation.id + augmentation.actionIndex}
                        >
                          <div className="insight-augmentation-row-name">
                            {augmentation.name}
                            <span className="insight-augmentation-row-extra">
                              {(() => {
                                const action =
                                  augmentation.actions.action_list[augmentation.actionIndex ?? -1];
                                return action?.key === ACTION_KEY.SEARCH_DOMAINS
                                  ? augmentation.id === AUGMENTATION_ID.TRUSTLIST &&
                                    !action.value?.length
                                    ? ADD_TO_TRUSTLIST_BUTTON_SUBTITLE
                                    : `${ADD_TO_AUGMENTATION_BUTTON_SUBTITLE}\u00a0${action.value.join(
                                        ', ',
                                      )}`
                                  : ADD_TO_AUGMENTATION_BUTTON_NEW_ACTION;
                              })()}
                            </span>
                          </div>
                          <Tag
                            className="insight-augmentation-row-button"
                            color="geekblue"
                            onClick={handleAddToLocal}
                          >
                            {ADD_TO_AUGMENTATION_BUTTON_TEXT}
                          </Tag>
                        </div>
                      );
                  }
                })}
              </section>
            </React.Fragment>
          ) : null,
        )}
        {!inline ? (
          <>
            <Divider />
            <Button
              type="text"
              block
              onClick={handleCreateAugmentation}
              className="create-local-search-domain-augmentation-button"
            >
              <Suspense fallback={null}>
                <PlusOutlined />
              </Suspense>
              {`\u00a0${CREATE_NEW_SEARCHING_AUGMENTATION_BUTTON_TEXT}`}
            </Button>
          </>
        ) : (
          <Divider />
        )}
      </div>
    </div>
  );
};

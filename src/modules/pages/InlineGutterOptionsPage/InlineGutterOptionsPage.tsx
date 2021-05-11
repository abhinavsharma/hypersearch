import React, { Suspense, useState } from 'react';
import Button from 'antd/lib/button';
import Tag from 'antd/lib/tag';
import Divider from 'antd/lib/divider';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import AugmentationManager from 'lib/AugmentationManager/AugmentationManager';
import { DomainStateCheckbox } from 'modules/gutter/DomainStateCheckbox/DomainStateCheckbox';
import {
  ACTION_KEYS,
  ACTION_LABELS,
  ACTION_TYPES,
  EMPTY_AUGMENTATION,
  MY_BLOCKLIST_ID,
  MY_TRUSTLIST_ID,
  OPEN_AUGMENTATION_BUILDER_MESSAGE,
  OPEN_BUILDER_PAGE,
  PROTECTED_AUGMENTATIONS,
  REMOVE_HIDE_DOMAIN_OVERLAY_MESSAGE,
  REMOVE_SEARCHED_DOMAIN_MESSAGE,
} from 'utils';
import 'antd/lib/divider/style/index.css';
import 'antd/lib/button/style/index.css';
import 'antd/lib/tag/style/index.css';
import './InlineGutterOptionsPage.scss';

/** MAGICS **/
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

const PlusOutlined = React.lazy(
  async () => await import('@ant-design/icons/PlusOutlined').then((mod) => mod),
);

export const InlineGutterOptionsPage: InlineGutterOptionsPage = ({
  hidingAugmentations = [],
  domain,
  inline,
}) => {
  const [currentHiders, setCurrentHiders] = useState<AugmentationObject[]>(
    hidingAugmentations.filter(({ id }) => id !== MY_BLOCKLIST_ID),
  );

  const searchingAugmentations = [
    ...SidebarLoader.installedAugmentations,
    ...SidebarLoader.suggestedAugmentations,
    ...SidebarLoader.otherAugmentations.filter(({ installed }) => installed),
  ].filter(
    (augmentation) =>
      !!augmentation.actions.action_list.filter(({ key, value }) => {
        if (key === ACTION_KEYS.SEARCH_DOMAINS) {
          return !!value.find((searchedDomain) => searchedDomain === domain);
        }
        return false;
      }).length && augmentation.id !== MY_TRUSTLIST_ID,
  );

  const availableLocalAugmentations: Record<
    string,
    Array<AugmentationObject & { actionIndex: number }>
  > = [
    ...SidebarLoader.installedAugmentations,
    ...SidebarLoader.otherAugmentations.filter(({ installed }) => installed),
  ].reduce((a, augmentation) => {
    const searchDomainActions = augmentation.actions.action_list.reduce(
      (actions, action, index) => {
        const { key, value } = action;
        if (key === ACTION_KEYS.SEARCH_DOMAINS && !value.includes(domain)) {
          actions.push({ ...action, index });
        }
        return actions;
      },
      [],
    );
    if (!Array.isArray(a[domain])) a[domain] = [];
    if (!PROTECTED_AUGMENTATIONS.includes(augmentation.id)) {
      searchDomainActions.forEach((action) => {
        a[domain].push({ ...augmentation, actionIndex: action.index });
      });
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

  const handleClose = () => {
    chrome.runtime.sendMessage({
      type: OPEN_AUGMENTATION_BUILDER_MESSAGE,
      page: OPEN_BUILDER_PAGE.ACTIVE,
    } as OpenActivePageMessage);
  };

  const handleAddSearchDomainToLocal = (augmentation: AugmentationObject, index: number) => {
    const newActions = augmentation.actions.action_list.map((action, actionIndex) =>
      actionIndex === index ? { ...action, value: [...action.value, domain] } : action,
    );
    if (index === augmentation.actions.action_list.length) {
      newActions.push({
        key: ACTION_KEYS.SEARCH_DOMAINS,
        label: ACTION_LABELS.SEARCH_DOMAINS,
        value: [domain],
        type: ACTION_TYPES.LIST,
      });
    }
    AugmentationManager.addOrEditAugmentation(augmentation, {
      actions: newActions,
    });
  };

  const handleEditInstalled = (augmentation: AugmentationObject) => {
    chrome.runtime.sendMessage({
      type: OPEN_AUGMENTATION_BUILDER_MESSAGE,
      page: OPEN_BUILDER_PAGE.BUILDER,
      augmentation,
    } as OpenBuilderMessage);
  };

  const handleDeleteInstalled = (augmentation: AugmentationObject, type: Section['type']) => {
    const checkKey = type === 'block' ? ACTION_KEYS.SEARCH_HIDE_DOMAIN : ACTION_KEYS.SEARCH_DOMAINS;
    const newData: Record<string, any> = {
      actions: augmentation.actions.action_list.map((action) => {
        const { key, value } = action;
        return key === checkKey
          ? { ...action, value: value.filter((valueDomain) => valueDomain !== domain) }
          : action;
      }),
    };

    if (type === 'search') {
      window.postMessage(
        {
          name: REMOVE_SEARCHED_DOMAIN_MESSAGE,
          remove: augmentation.id,
          domain,
          selector: {
            link: SidebarLoader.customSearchEngine.querySelector?.['desktop'],
            featured: SidebarLoader.customSearchEngine.querySelector?.featured ?? Array(0),
            container: SidebarLoader.customSearchEngine.querySelector?.result_container_selector,
          },
        },
        '*',
      );
    }

    AugmentationManager.addOrEditAugmentation(augmentation, newData);

    if (type === 'block') {
      setCurrentHiders((prev) => prev.filter(({ id }) => id !== augmentation.id));
      SidebarLoader.hideDomains = SidebarLoader.hideDomains.filter((hidden) => hidden !== domain);
      window.postMessage(
        {
          name: REMOVE_HIDE_DOMAIN_OVERLAY_MESSAGE,
          remove: augmentation.id,
          domain,
          selector: {
            link: SidebarLoader.customSearchEngine.querySelector?.['desktop'],
            featured: SidebarLoader.customSearchEngine.querySelector?.featured ?? Array(0),
            container: SidebarLoader.customSearchEngine.querySelector?.result_container_selector,
          },
        },
        '*',
      );
    }
  };

  const handleDisableSuggested = (augmentation: AugmentationObject, type: Section['type']) => {
    AugmentationManager.disableSuggestedAugmentation(augmentation);

    if (type === 'search') {
      window.postMessage(
        {
          name: REMOVE_SEARCHED_DOMAIN_MESSAGE,
          remove: augmentation.id,
          domain,
          selector: {
            link: SidebarLoader.customSearchEngine.querySelector?.['desktop'],
            featured: SidebarLoader.customSearchEngine.querySelector?.featured ?? Array(0),
            container: SidebarLoader.customSearchEngine.querySelector?.result_container_selector,
          },
        },
        '*',
      );
    }

    if (type === 'block') {
      setCurrentHiders((prev) => prev.filter(({ id }) => id !== augmentation.id));
      SidebarLoader.hideDomains = SidebarLoader.hideDomains.filter((hidden) => hidden !== domain);
      window.postMessage(
        {
          name: REMOVE_HIDE_DOMAIN_OVERLAY_MESSAGE,
          remove: augmentation.id,
          domain,
          selector: {
            link: SidebarLoader.customSearchEngine.querySelector?.['desktop'],
            featured: SidebarLoader.customSearchEngine.querySelector?.featured ?? Array(0),
            container: SidebarLoader.customSearchEngine.querySelector?.result_container_selector,
          },
        },
        '*',
      );
    }
  };

  const handleCreateAugmentation = () => {
    chrome.runtime.sendMessage({
      type: OPEN_AUGMENTATION_BUILDER_MESSAGE,
      page: OPEN_BUILDER_PAGE.BUILDER,
      create: true,
      augmentation: {
        ...EMPTY_AUGMENTATION,
        actions: {
          ...EMPTY_AUGMENTATION.actions,
          action_list: [
            {
              key: ACTION_KEYS.SEARCH_DOMAINS,
              label: ACTION_LABELS.SEARCH_DOMAINS,
              type: ACTION_TYPES.LIST,
              value: [domain],
            },
          ],
        },
      },
    } as OpenBuilderMessage);
  };

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
                    handleAddSearchDomainToLocal(augmentation, augmentation.actionIndex);
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
                                  augmentation.actions.action_list[augmentation.actionIndex];
                                return action?.key === ACTION_KEYS.SEARCH_DOMAINS
                                  ? augmentation.id === MY_TRUSTLIST_ID && !action.value?.length
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
              {`\u0a00${CREATE_NEW_SEARCHING_AUGMENTATION_BUTTON_TEXT}`}
            </Button>
          </>
        ) : (
          <Divider />
        )}
      </div>
    </div>
  );
};

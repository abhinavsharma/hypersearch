import React, { Suspense, useState } from 'react';
import Button from 'antd/lib/button';
import Tag from 'antd/lib/tag';
import Divider from 'antd/lib/divider';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import AugmentationManager from 'lib/AugmentationManager/AugmentationManager';
import { DomainStateCheckbox } from '../DomainStateCheckbox/DomainStateCheckbox';
import {
  EMPTY_AUGMENTATION,
  MY_BLOCKLIST_ID,
  MY_TRUSTLIST_ID,
  OPEN_AUGMENTATION_BUILDER_MESSAGE,
  OPEN_BUILDER_PAGE,
  PROTECTED_AUGMENTATIONS,
  REMOVE_HIDE_DOMAIN_OVERLAY_MESSAGE,
  REMOVE_SEARCHED_DOMAIN_MESSAGE,
  SEARCH_DOMAINS_ACTION,
  SEARCH_HIDE_DOMAIN_ACTION,
} from 'utils';
import 'antd/lib/divider/style/index.css';
import 'antd/lib/button/style/index.css';
import 'antd/lib/tag/style/index.css';
import './InlineGutterOptionsPage.scss';

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
        if (key === SEARCH_DOMAINS_ACTION) {
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
        if (key === SEARCH_DOMAINS_ACTION && !value.includes(domain)) {
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
      title: 'Add this domain to a local lens',
      subtitle: 'When this lens is triggered then this domain will be searched',
    },
    {
      type: 'block',
      augmentations: currentHiders,
      title: 'Lenses that block this domain',
      subtitle: null,
    },
    {
      type: 'search',
      augmentations: searchingAugmentations,
      title: 'Lenses that search this domain',
      subtitle: null,
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
        key: SEARCH_DOMAINS_ACTION,
        label: 'Search only these domains',
        value: [domain],
        type: 'list',
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
    const checkKey = type === 'block' ? SEARCH_HIDE_DOMAIN_ACTION : SEARCH_DOMAINS_ACTION;
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
            link:
              SidebarLoader.customSearchEngine.querySelector?.[
                window.top.location.href.search(/google\.com/) > -1 ? 'pad' : 'desktop'
              ],
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
              key: SEARCH_DOMAINS_ACTION,
              label: 'Search only these domains',
              type: 'list',
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
            Close
          </Button>
          <span className="page-title">Domain Settings</span>
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
          !!augmentations?.length ? (
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
                        <div className="augmentation-row" key={augmentation.id}>
                          {augmentation.name}
                          {!augmentation.installed ? (
                            <Tag
                              className="augmentation-row-button"
                              color="volcano"
                              onClick={handleDisable}
                            >
                              Disable Lens
                            </Tag>
                          ) : (
                            <Tag
                              className="augmentation-row-button"
                              color="volcano"
                              onClick={handleDelete}
                            >
                              Remove from Lens
                            </Tag>
                          )}
                        </div>
                      );
                    case 'search':
                      return (
                        <div className="augmentation-row" key={augmentation.id}>
                          {augmentation.name}
                          <Tag
                            className="augmentation-row-button"
                            color="geekblue"
                            onClick={handleEdit}
                          >
                            {!augmentation.installed ? 'Fork Lens' : 'Edit Lens'}
                          </Tag>
                          {!augmentation.installed ? (
                            <Tag
                              className="augmentation-row-button"
                              color="volcano"
                              onClick={handleDisable}
                            >
                              Disable Lens
                            </Tag>
                          ) : (
                            <Tag
                              className="augmentation-row-button"
                              color="volcano"
                              onClick={handleDelete}
                            >
                              Remove from Lens
                            </Tag>
                          )}
                        </div>
                      );
                    case 'local':
                      return (
                        <div
                          className="augmentation-row"
                          key={augmentation.id + augmentation.actionIndex}
                        >
                          <div className="augmentation-row-name">
                            {augmentation.name}
                            <span className="augmentation-row-extra">
                              {(() => {
                                const action =
                                  augmentation.actions.action_list[augmentation.actionIndex];
                                return action?.key === SEARCH_DOMAINS_ACTION
                                  ? augmentation.id === MY_TRUSTLIST_ID && !action.value?.length
                                    ? 'Mark domains as trusted sources'
                                    : `Currently searches\u00a0${action.value.join(', ')}`
                                  : 'Add as new action';
                              })()}
                            </span>
                          </div>
                          <Tag
                            className="augmentation-row-button"
                            color="geekblue"
                            onClick={handleAddToLocal}
                          >
                            Add to Lens
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
              &nbsp;Create new Lens that searches this domain
            </Button>
          </>
        ) : (
          <Divider />
        )}
      </div>
    </div>
  );
};

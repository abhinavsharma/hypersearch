/**
 * @module modules:pages
 * @version 1.0.0
 * @license (C) Insight
 */

import React, { Suspense, useEffect, useState } from 'react';
import Button from 'antd/lib/button';
import Divider from 'antd/lib/divider';
import SidebarLoader from 'lib/sidebar';
import { AugmentationRow } from 'modules/builder';
import { GutterPage } from 'modules/pages';
import { Settings } from 'react-feather';
import { makeEllipsis, getFirstValidTabIndex, extractUrlProperties } from 'lib/helpers';
import { flipSidebar } from 'lib/flip';
import { APP_NAME, MESSAGE, EMPTY_AUGMENTATION, PAGE, SWITCH_TO_TAB, ACTION_KEY } from 'constant';
import 'antd/lib/button/style/index.css';
import 'antd/lib/divider/style/index.css';

const ZoomInOutlined = React.lazy(
  async () => await import('@ant-design/icons/ZoomInOutlined').then((mod) => mod),
);

//-----------------------------------------------------------------------------------------------
// ! Magics
//-----------------------------------------------------------------------------------------------
const HEADER_TITLE = 'Filters';
const HEADER_LEFT_BUTTON_TEXT = 'Close';
const INSTALLED_SECTION_TITLE = 'Your Local Filters for This Page';
const PINNED_SECTION_TITLE = 'Currently Pinned Filters';
const SUGGESTED_SECTION_TITLE = 'Suggested for This Page';
const SUGGESTED_SECTION_SUBTITLE = `Filters suggested by ${APP_NAME} for this page.`;
const HIDDEN_SECTION_TITLE = ' Hidden';
const HIDDEN_SECTION_SUBTITLE = 'Filters you have hidden.';
const UNMATCHED_SECTION_TITLE = 'Unmatched Filters';
const UNMATCHED_SECTION_SUBTITLE = 'Filters not matching this page.';
const CREATE_LENS_BUTTON_TEXT = 'Create New Filter';
const SETTINGS_ICON_COLOR = '#999999';

//-----------------------------------------------------------------------------------------------
// ! Component
//-----------------------------------------------------------------------------------------------
export const ActivePage: ActivePage = () => {
  const domain = extractUrlProperties(SidebarLoader.url.href).hostname ?? '';

  const [tourStep, setTourStep] = useState<string>(SidebarLoader.tourStep);
  const [hidingAugmentations, setHidingAugmentations] = useState<Augmentation[]>(
    SidebarLoader.installedAugmentations
      .concat(SidebarLoader.otherAugmentations)
      .reduce((augmentations, augmentation) => {
        const isBlockingDomain = !!augmentation.actions.action_list.find(
          ({ key, value }) => key === ACTION_KEY.SEARCH_HIDE_DOMAIN && value.includes(domain),
        );
        isBlockingDomain && augmentations.push(augmentation);
        return augmentations;
      }, [] as Augmentation[]),
  );

  //-----------------------------------------------------------------------------------------------
  // ! Handlers
  //-----------------------------------------------------------------------------------------------
  const handleOpenSettings = (e: React.MouseEvent) => {
    if (e.shiftKey) {
      chrome.runtime.sendMessage({
        type: MESSAGE.OPEN_PAGE,
        page: PAGE.FEATURE,
      });
    } else {
      chrome.runtime.sendMessage({
        type: MESSAGE.OPEN_PAGE,
        page: PAGE.SETTINGS,
      });
    }
  };

  const handleClose = () => {
    if (tourStep) {
      setTourStep('');
      SidebarLoader.tourStep = '';
    }
    if (getFirstValidTabIndex(SidebarLoader.sidebarTabs) === '0') {
      if (!SidebarLoader.isSerp) {
        chrome.runtime.sendMessage({
          type: SWITCH_TO_TAB,
          index: '1000',
        });
      } else if (window.top?.document) {
        flipSidebar(window.top.document, 'hide', SidebarLoader, true);
      }
    } else {
      chrome.runtime.sendMessage({
        type: SWITCH_TO_TAB,
        index: getFirstValidTabIndex(SidebarLoader.sidebarTabs),
      });
    }
  };

  const augmentationSorter = (a: Augmentation, b: Augmentation) => {
    if (!a.installed && b.installed) return 1;
    return (
      // sorts by name ignoring emojis
      (a.name.match(/[\w]/)?.[0].toLowerCase().charCodeAt(0) ?? 0) -
      (b.name.match(/[\w]/)?.[0].toLowerCase().charCodeAt(0) ?? 0)
    );
  };

  const handleCreate = () =>
    chrome.runtime.sendMessage({
      type: MESSAGE.OPEN_PAGE,
      page: PAGE.BUILDER,
      augmentation: EMPTY_AUGMENTATION,
      create: true,
    });

  const sections = [
    {
      augmentations: SidebarLoader.installedAugmentations.filter(
        (augmentation) =>
          !SidebarLoader.pinnedAugmentations.find(({ id }) => id === augmentation.id) &&
          !augmentation.actions.action_list.find((action) => action.key === ACTION_KEY.URL_NOTE),
      ),
      title: INSTALLED_SECTION_TITLE,
      subtitle: makeEllipsis(SidebarLoader.url.href, 60),
      button: (
        <div className={'insight-create-lens'}>
          <Button
            className={tourStep === '2' ? 'insight-tour-shake' : ''}
            type="primary"
            block
            onClick={handleCreate}
          >
            <Suspense fallback={null}>
              <ZoomInOutlined />
            </Suspense>
            {`\u00a0${CREATE_LENS_BUTTON_TEXT}`}
          </Button>
        </div>
      ),
    },
    {
      augmentations: SidebarLoader.pinnedAugmentations,
      title: PINNED_SECTION_TITLE,
      pinned: true,
    },
    {
      augmentations: SidebarLoader.suggestedAugmentations.filter(
        (augmentation) =>
          !SidebarLoader.pinnedAugmentations.find(({ id }) => id === augmentation.id),
      ),
      title: SUGGESTED_SECTION_TITLE,
      subtitle: SUGGESTED_SECTION_SUBTITLE,
    },
    {
      augmentations: SidebarLoader.ignoredAugmentations
        .filter(
          (augmentation) =>
            !SidebarLoader.pinnedAugmentations.find(({ id }) => id === augmentation.id),
        )
        .sort(augmentationSorter),
      title: HIDDEN_SECTION_TITLE,
      subtitle: HIDDEN_SECTION_SUBTITLE,
      ignored: true,
    },
    {
      augmentations: SidebarLoader.otherAugmentations
        .filter(
          (augmentation) =>
            !SidebarLoader.pinnedAugmentations.find(({ id }) => id === augmentation.id),
        )
        .sort(augmentationSorter),
      title: UNMATCHED_SECTION_TITLE,
      subtitle: UNMATCHED_SECTION_SUBTITLE,
      other: true,
    },
  ];

  useEffect(() => {
    setTourStep(SidebarLoader.tourStep);
    // Singleton instance not reinitialized on rerender.
    // ! Be careful when updating the dependency list!
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [SidebarLoader.tourStep]);

  useEffect(() => {
    setHidingAugmentations(
      SidebarLoader.installedAugmentations
        .concat(SidebarLoader.otherAugmentations)
        .reduce((augmentations, augmentation) => {
          const isBlockingDomain = !!augmentation.actions.action_list.find(
            ({ key, value }) => key === ACTION_KEY.SEARCH_HIDE_DOMAIN && value.includes(domain),
          );
          isBlockingDomain && augmentations.push(augmentation);
          return augmentations;
        }, [] as Augmentation[]),
    );
    // Singleton instance not reinitialized on rerender.
    // ! Be careful when updating the dependency list!
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [SidebarLoader.installedAugmentations, SidebarLoader.otherAugmentations]);

  //-----------------------------------------------------------------------------------------------
  // ! Render
  //-----------------------------------------------------------------------------------------------
  return (
    <div id="active-page" className="sidebar-page">
      <header className="sidebar-page-header">
        <Button
          type="link"
          className={`left-button ${tourStep === '6' ? 'insight-tour-shake' : ''}`}
          onClick={handleClose}
        >
          {HEADER_LEFT_BUTTON_TEXT}
        </Button>
        <span className="page-title">{HEADER_TITLE}</span>
        { false && <Button type="text" className="right-button" onClick={handleOpenSettings}>
          <Suspense fallback={null}>
            <Settings stroke={SETTINGS_ICON_COLOR} size={20} />
          </Suspense>
        </Button> }
      </header>
      <div className="sidebar-page-wrapper">
        {!SidebarLoader.isSerp && (
          <GutterPage
            domain={domain}
            hidingAugmentations={hidingAugmentations}
            inline
          />
        )}
        {sections.map(
          ({ augmentations, button, title, subtitle, pinned, other, ignored }, i, a) => {
            const hasNextSection = !!a[i + 1];
            return augmentations.length || i === 0 ? (
              <React.Fragment key={title}>
                <section>
                  {title && <h2 className="title">{title}</h2>}
                  {subtitle && <h3 className="sub-title">{subtitle}</h3>}
                  {augmentations.map((augmentation) => (
                    <AugmentationRow
                      key={augmentation.id}
                      augmentation={augmentation}
                      pinned={pinned}
                      other={other}
                      ignored={ignored}
                    />
                  ))}
                  {button && button}
                </section>
                {hasNextSection && <Divider />}
              </React.Fragment>
            ) : null;
          },
        )}
      </div>
    </div>
  );
};

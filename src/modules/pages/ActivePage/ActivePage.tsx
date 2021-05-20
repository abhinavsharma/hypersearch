import React, { Suspense, useEffect, useState } from 'react';
import Button from 'antd/lib/button';
import Divider from 'antd/lib/divider';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import { AugmentationRow } from 'modules/builder';
import { GutterPage } from 'modules/pages';
import { Settings } from 'react-feather';
import {
  makeEllipsis,
  APP_NAME,
  OPEN_AUGMENTATION_BUILDER_MESSAGE,
  EMPTY_AUGMENTATION,
  OPEN_BUILDER_PAGE,
  getFirstValidTabIndex,
  flipSidebar,
  SWITCH_TO_TAB,
  OPEN_SETTINGS_PAGE_MESSAGE,
  extractUrlProperties,
  ACTION_KEYS,
} from 'utils';
import 'antd/lib/button/style/index.css';
import 'antd/lib/divider/style/index.css';

/** MAGICS **/
const HEADER_TITLE = 'Lenses';
const HEADER_LEFT_BUTTON_TEXT = 'Close';
const INSTALLED_SECTION_TITLE = 'Your Local Lenses for This Page';
const PINNED_SECTION_TITLE = 'Currently Pinned Lenses';
const SUGGESTED_SECTION_TITLE = 'Suggested for This Page';
const SUGGESTED_SECTION_SUBTITLE = `Lenses suggested by ${APP_NAME} for this page.`;
const HIDDEN_SECTION_TITLE = ' Hidden';
const HIDDEN_SECTION_SUBTITLE = 'Lenses you have hidden.';
const UNMATCHED_SECTION_TITLE = 'Unmatched Lenses';
const UNMATCHED_SECTION_SUBTITLE = 'Lenses not matching this page.';
const CREATE_LENS_BUTTON_TEXT = 'Create New Lens';
const SETTINGS_ICON_COLOR = '#999999';

const ZoomInOutlined = React.lazy(
  async () => await import('@ant-design/icons/ZoomInOutlined').then((mod) => mod),
);

export const ActivePage: ActivePage = () => {
  const domain = extractUrlProperties(SidebarLoader.url.href).hostname;
  const [tourStep, setTourStep] = useState<string>(SidebarLoader.tourStep);
  const [hidingAugmentations, setHidingAugmentations] = useState<AugmentationObject[]>(
    SidebarLoader.installedAugmentations
      .concat(SidebarLoader.otherAugmentations)
      .reduce((augmentations, augmentation) => {
        const isBlockingDomain = !!augmentation.actions.action_list.find(
          ({ key, value }) => key === ACTION_KEYS.SEARCH_HIDE_DOMAIN && value.includes(domain),
        );
        isBlockingDomain && augmentations.push(augmentation);
        return augmentations;
      }, [] as AugmentationObject[]),
  );

  const handleOpenSettings = () => {
    chrome.runtime.sendMessage({ type: OPEN_SETTINGS_PAGE_MESSAGE });
  };

  const handleClose = () => {
    if (tourStep) {
      setTourStep('');
      SidebarLoader.tourStep = '';
    }
    if (getFirstValidTabIndex(SidebarLoader.sidebarTabs) === '0') {
      flipSidebar(window.top.document, 'hide', 0, SidebarLoader.maxAvailableSpace, true);
    } else {
      chrome.runtime.sendMessage({
        type: SWITCH_TO_TAB,
        index: getFirstValidTabIndex(SidebarLoader.sidebarTabs),
      });
    }
  };

  const augmentationSorter = (a: AugmentationObject, b: AugmentationObject) => {
    if (!a.installed && b.installed) return 1;
    return (
      // sorts by name ignoring emojis
      (a.name.match(/[\w]/)?.[0].toLowerCase().charCodeAt(0) ?? 0) -
      (b.name.match(/[\w]/)?.[0].toLowerCase().charCodeAt(0) ?? 0)
    );
  };

  const handleCreate = () =>
    chrome.runtime.sendMessage({
      type: OPEN_AUGMENTATION_BUILDER_MESSAGE,
      page: OPEN_BUILDER_PAGE.BUILDER,
      augmentation: EMPTY_AUGMENTATION,
      create: true,
    } as OpenBuilderMessage);

  const sections = [
    {
      augmentations: SidebarLoader.installedAugmentations.filter(
        (augmentation) =>
          !SidebarLoader.pinnedAugmentations.find(({ id }) => id === augmentation.id),
      ),
      title: INSTALLED_SECTION_TITLE,
      subtitle: makeEllipsis(SidebarLoader.url.href, 60),
      button: (
        <Button
          className={tourStep === '2' ? 'insight-tour-shake' : ''}
          type="text"
          onClick={handleCreate}
        >
          <Suspense fallback={null}>
            <ZoomInOutlined />
          </Suspense>
          {`\u00a0${CREATE_LENS_BUTTON_TEXT}`}
        </Button>
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
            ({ key, value }) => key === ACTION_KEYS.SEARCH_HIDE_DOMAIN && value.includes(domain),
          );
          isBlockingDomain && augmentations.push(augmentation);
          return augmentations;
        }, [] as AugmentationObject[]),
    );
    // Singleton instance not reinitialized on rerender.
    // ! Be careful when updating the dependency list!
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [SidebarLoader.installedAugmentations, SidebarLoader.otherAugmentations]);

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
        <Button type="text" className="right-button" onClick={handleOpenSettings}>
          <Suspense fallback={null}>
            <Settings stroke={SETTINGS_ICON_COLOR} size={20} />
          </Suspense>
        </Button>
      </header>
      <div className="sidebar-page-wrapper">
        {!SidebarLoader.isSerp && (
          <GutterPage domain={domain} hidingAugmentations={hidingAugmentations} inline />
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

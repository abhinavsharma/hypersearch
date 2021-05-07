import React, { Suspense, useEffect, useState } from 'react';
import Button from 'antd/lib/button';
import Divider from 'antd/lib/divider';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import { AugmentationRow } from 'modules/augmentations';
import { InlineGutterOptionsPage } from 'modules/gutter';
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
  SEARCH_HIDE_DOMAIN_ACTION,
} from 'utils';
import 'antd/lib/button/style/index.css';
import 'antd/lib/divider/style/index.css';

const ZoomInOutlined = React.lazy(
  async () => await import('@ant-design/icons/ZoomInOutlined').then((mod) => mod),
);

export const ActiveAugmentationsPage: ActiveAugmentationsPage = () => {
  const domain = extractUrlProperties(SidebarLoader.url.href).hostname;
  const [tourStep, setTourStep] = useState<string>(SidebarLoader.tourStep);
  const [hidingAugmentations] = useState<AugmentationObject[]>(
    SidebarLoader.installedAugmentations
      .concat(SidebarLoader.otherAugmentations)
      .reduce((augmentations, augmentation) => {
        const isBlockingDomain = !!augmentation.actions.action_list.find(
          ({ key, value }) => key === SEARCH_HIDE_DOMAIN_ACTION && value.includes(domain),
        );
        isBlockingDomain && augmentations.push(augmentation);
        return augmentations;
      }, []),
  );

  const handleOpenSettings = () => {
    chrome.runtime.sendMessage({ type: OPEN_SETTINGS_PAGE_MESSAGE });
  };

  const handleClose = () => {
    if (tourStep) {
      setTourStep(null);
      SidebarLoader.tourStep = null;
    }
    if (getFirstValidTabIndex(SidebarLoader.sidebarTabs) === '0') {
      flipSidebar(window.top.document, 'hide', 0, true);
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
      a.name.match(/[\w]/)[0].toLowerCase().charCodeAt(0) -
      b.name.match(/[\w]/)[0].toLowerCase().charCodeAt(0)
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
      title: 'Your Local Lenses for This Page',
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
          &nbsp;Create New Lens
        </Button>
      ),
    },
    {
      augmentations: SidebarLoader.pinnedAugmentations,
      title: 'Currently Pinned Lenses',
      pinned: true,
    },
    {
      augmentations: SidebarLoader.suggestedAugmentations.filter(
        (augmentation) =>
          !SidebarLoader.pinnedAugmentations.find(({ id }) => id === augmentation.id),
      ),
      title: 'Suggested for This Page',
      subtitle: `Lenses suggested by ${APP_NAME} for this page.`,
    },
    {
      augmentations: SidebarLoader.ignoredAugmentations
        .filter(
          (augmentation) =>
            !SidebarLoader.pinnedAugmentations.find(({ id }) => id === augmentation.id),
        )
        .sort(augmentationSorter),
      title: 'Hidden',
      subtitle: 'Lenses you have hidden.',
      ignored: true,
    },
    {
      augmentations: SidebarLoader.otherAugmentations
        .filter(
          (augmentation) =>
            !SidebarLoader.pinnedAugmentations.find(({ id }) => id === augmentation.id),
        )
        .sort(augmentationSorter),
      title: 'Unmatched Lenses',
      subtitle: 'Lenses not matching this page.',
      other: true,
    },
  ];

  useEffect(() => {
    setTourStep(SidebarLoader.tourStep);
  }, [SidebarLoader.tourStep]);

  useEffect(() => {
    SidebarLoader.installedAugmentations
      .concat(SidebarLoader.otherAugmentations)
      .reduce((augmentations, augmentation) => {
        const isBlockingDomain = !!augmentation.actions.action_list.find(
          ({ key, value }) => key === SEARCH_HIDE_DOMAIN_ACTION && value.includes(domain),
        );
        isBlockingDomain && augmentations.push(augmentation);
        return augmentations;
      }, []);
  }, [SidebarLoader.installedAugmentations, SidebarLoader.otherAugmentations]);

  return (
    <div id="active-page" className="sidebar-page">
      <header className="sidebar-page-header">
        <Button
          type="link"
          className={`left-button ${tourStep === '6' ? 'insight-tour-shake' : ''}`}
          onClick={handleClose}
        >
          Close
        </Button>
        <span className="page-title">Lenses</span>
        <Button type="text" className="right-button" onClick={handleOpenSettings}>
          <Suspense fallback={null}>
            <Settings stroke={'#999'} size={20} />
          </Suspense>
        </Button>
      </header>
      <div className="sidebar-page-wrapper">
        {!SidebarLoader.isSerp && (
          <InlineGutterOptionsPage
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

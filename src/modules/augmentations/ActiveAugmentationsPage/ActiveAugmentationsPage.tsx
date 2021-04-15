import React, { Suspense } from 'react';
import Router from 'route-lite';
import Button from 'antd/lib/button';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import Divider from 'antd/lib/divider';
import { AugmentationRow } from 'modules/augmentations';
import { makeEllipsis, APP_NAME } from 'utils';
import { useActiveAugmentationPage } from './useActiveAugmentationPage';
import 'antd/lib/button/style/index.css';
import 'antd/lib/divider/style/index.css';
import './ActiveAugmentationsPage.scss';

const ZoomInOutlined = React.lazy(
  async () => await import('@ant-design/icons/ZoomInOutlined').then((mod) => mod),
);

export const ActiveAugmentationsPage: ActiveAugmentationsPage = ({ setActiveKey }) => {
  const {
    installedAugmentations,
    suggestedAugmentations,
    ignoredAugmentations,
    otherAugmentations,
    pinnedAugmentations,
    augmentationSorter,
    handleEdit,
  } = useActiveAugmentationPage(setActiveKey);

  const sections = [
    {
      augmentations: installedAugmentations.filter(
        (augmentation) => !pinnedAugmentations.find(({ id }) => id === augmentation.id),
      ),
      title: 'Your Local Lenses Matching This Page',
      subtitle: makeEllipsis(SidebarLoader.url.href, 60),
      button: (
        <Button type="text" block onClick={handleEdit}>
          <Suspense fallback={null}>
            <ZoomInOutlined />
          </Suspense>
          &nbsp;Create New Lens
        </Button>
      ),
    },
    {
      augmentations: pinnedAugmentations,
      title: 'Currently Pinned Lenses',
      pinned: true,
    },
    {
      augmentations: suggestedAugmentations.filter(
        (augmentation) => !pinnedAugmentations.find(({ id }) => id === augmentation.id),
      ),
      title: 'Suggested for This Page',
      subtitle: `Lenses suggested by ${APP_NAME} for this page.`,
    },
    {
      augmentations: ignoredAugmentations
        .filter((augmentation) => !pinnedAugmentations.find(({ id }) => id === augmentation.id))
        .sort(augmentationSorter),
      title: 'Hidden',
      subtitle: 'Lenses you have hidden.',
      ignored: true,
    },
    {
      augmentations: otherAugmentations
        .filter((augmentation) => !pinnedAugmentations.find(({ id }) => id === augmentation.id))
        .sort(augmentationSorter),
      title: 'Other',
      subtitle: 'Lenses not matching this page.',
      other: true,
    },
  ];

  return (
    <Router>
      <div id="active-augmentations-page">
        {sections.map(
          ({ augmentations, button, title, subtitle, pinned, other, ignored }, i, a) => {
            const hasNextSection = !!a[i + 1];
            return (
              <React.Fragment key={title}>
                <section>
                  {title && <h2 className="title">{title}</h2>}
                  {subtitle && <h3 className="sub-title">{subtitle}</h3>}
                  {augmentations.map((augmentation) => (
                    <AugmentationRow
                      pinned={pinned}
                      other={other}
                      ignored={ignored}
                      key={augmentation.id}
                      augmentation={augmentation}
                      setActiveKey={setActiveKey}
                    />
                  ))}
                  {button && button}
                </section>
                {hasNextSection && <Divider />}
              </React.Fragment>
            );
          },
        )}
      </div>
    </Router>
  );
};

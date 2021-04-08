import React, { Suspense, useEffect, useState } from 'react';
import Router, { goTo } from 'route-lite';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Button from 'antd/lib/button';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import Divider from 'antd/lib/divider';
import { EditAugmentationPage, AugmentationRow } from 'modules/augmentations';
import {
  APP_NAME,
  EMPTY_AUGMENTATION,
  OPEN_AUGMENTATION_BUILDER_MESSAGE,
  UPDATE_SIDEBAR_TABS_MESSAGE,
} from 'utils/constants';
import 'antd/lib/button/style/index.css';
import 'antd/lib/grid/style/index.css';
import 'antd/lib/divider/style/index.css';
import './ActiveAugmentationsPage.scss';

const ZoomInOutlined = React.lazy(
  async () => await import('@ant-design/icons/ZoomInOutlined').then((mod) => mod),
);

export const ActiveAugmentationsPage: ActiveAugmentationsPage = ({ setActiveKey }) => {
  const [installedAugmentations, setInstalledAugmentations] = useState<AugmentationObject[]>(
    SidebarLoader.installedAugmentations,
  );
  const [suggestedAugmentations, setSuggestedAugmentations] = useState<AugmentationObject[]>(
    SidebarLoader.suggestedAugmentations,
  );
  const [ignoredAugmentations, setIgnoredAugmentations] = useState<AugmentationObject[]>(
    SidebarLoader.ignoredAugmentations,
  );
  const [otherAugmentations, setOtherAugmentations] = useState<AugmentationObject[]>(
    SidebarLoader.otherAugmentations,
  );

  useEffect(() => {
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.type === UPDATE_SIDEBAR_TABS_MESSAGE) {
        setInstalledAugmentations(SidebarLoader.installedAugmentations);
        setSuggestedAugmentations(SidebarLoader.suggestedAugmentations);
        setIgnoredAugmentations(SidebarLoader.ignoredAugmentations);
        setOtherAugmentations(SidebarLoader.otherAugmentations);
      }
      if (msg.type === OPEN_AUGMENTATION_BUILDER_MESSAGE) {
        (msg.augmentation || msg.create) &&
          goTo(EditAugmentationPage, {
            augmentation: msg.create ? EMPTY_AUGMENTATION : msg.augmentation,
            isAdding: msg.create,
            setActiveKey,
          });
      }
    });
  }, []);

  const augmentationSorter = (a: AugmentationObject, b: AugmentationObject) => {
    if (!a.installed && b.installed) return 1;
    return (
      a.name.match(/[\w]/)[0].toLowerCase().charCodeAt(0) -
      b.name.match(/[\w]/)[0].toLowerCase().charCodeAt(0)
    );
  };

  return (
    <Router>
      <div className="insight-active-augmentations-page">
        <Divider />
        <Row>
          <Col>
            <h2>Your Local Lenses Matching This Page</h2>
            <h3>{`${SidebarLoader.url.href.slice(0, 60)}...`}</h3>
            {installedAugmentations.map((augmentation) => (
              <AugmentationRow
                key={augmentation.id}
                augmentation={augmentation}
                setActiveKey={setActiveKey}
              />
            ))}
          </Col>
        </Row>
        <Row>
          <Button
            className="add-augmentation-button"
            type="text"
            block
            onClick={() =>
              goTo(EditAugmentationPage, {
                augmentation: EMPTY_AUGMENTATION,
                isAdding: true,
                initiatedFromActives: true,
                setActiveKey,
              })
            }
          >
            <Suspense fallback={null}>
              <ZoomInOutlined />
            </Suspense>{' '}
            Create New Lens
          </Button>
        </Row>
        <Divider />
        <Row>
          <Col>
            <h2>Suggested for This Page</h2>
            <h3>Lenses suggested by {APP_NAME} for this page.</h3>
            {suggestedAugmentations
              .filter((i) => i.actions.action_list.some((i) => i.key !== 'inject_js'))
              .map((augmentation) => (
                <AugmentationRow
                  key={augmentation.id}
                  augmentation={augmentation}
                  setActiveKey={setActiveKey}
                />
              ))}
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col>
            <h2>Hidden</h2>
            <h3>Lenses you have hidden.</h3>
            {ignoredAugmentations.sort(augmentationSorter).map((augmentation) => (
              <AugmentationRow
                ignored
                key={augmentation.id}
                augmentation={augmentation}
                setActiveKey={setActiveKey}
              />
            ))}
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col>
            <h2>Other</h2>
            <h3>Lenses not matching this page.</h3>
            {otherAugmentations.sort(augmentationSorter).map((augmentation) => (
              <AugmentationRow
                key={augmentation.id}
                augmentation={augmentation}
                setActiveKey={setActiveKey}
              />
            ))}
          </Col>
        </Row>
      </div>
    </Router>
  );
};

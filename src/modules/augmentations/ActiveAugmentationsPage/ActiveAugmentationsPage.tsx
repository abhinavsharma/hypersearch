import React, { useEffect, useState } from 'react';
import Router, { goTo } from 'route-lite';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Button from 'antd/lib/button';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import Divider from 'antd/lib/divider';
import { EditAugmentationPage, AugmentationRow } from 'modules/augmentations';
import {
  EMPTY_AUGMENTATION,
  OPEN_AUGMENTATION_BUILDER_MESSAGE,
  UPDATE_SIDEBAR_TABS_MESSAGE,
} from 'utils/constants';
import 'antd/lib/button/style/index.css';
import 'antd/lib/grid/style/index.css';
import 'antd/lib/divider/style/index.css';
import './ActiveAugmentationsPage.scss';

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
      if (msg.type === OPEN_AUGMENTATION_BUILDER_MESSAGE && msg.create) {
        goTo(EditAugmentationPage, {
          augmentation: EMPTY_AUGMENTATION,
          isAdding: true,
          setActiveKey,
        });
      }
    });
  }, []);

  return (
    <Router>
      <div className="insight-active-augmentations-page">
        <Divider />
        <Row>
          <Col>
            <h2>Your Custom Lenses for This Page</h2>
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
            ➕ Add lens
          </Button>
        </Row>
        <Divider />
        <Row>
          <Col>
            <h2>Suggested Lenses for This Page</h2>
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
            <h2>Hidden Lenses</h2>
            {ignoredAugmentations.map((augmentation) => (
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
            <h2>Other Lenses</h2>
            {otherAugmentations.map((augmentation) => (
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

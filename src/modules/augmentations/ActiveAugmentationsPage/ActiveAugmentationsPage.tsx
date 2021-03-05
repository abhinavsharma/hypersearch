import React, { useEffect, useState } from 'react';
import Router, { Link, goTo } from 'route-lite';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Button from 'antd/lib/button';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import { EditAugmentationPage } from 'modules/augmentations';
import { EMPTY_AUGMENTATION, UPDATE_SIDEBAR_TABS_MESSAGE } from 'utils/constants';
import 'antd/lib/button/style/index.css';
import 'antd/lib/grid/style/index.css';
import './ActiveAugmentationsPage.scss';

export const ActiveAugmentationsPage: ActiveAugmentationsPage = () => {
  const [installedAugmentations, setInstalledAugmentations] = useState<AugmentationObject[]>(
    SidebarLoader.installedAugmentations,
  );
  const [suggestedAugmentations, setSuggestedAugmentations] = useState<AugmentationObject[]>(
    SidebarLoader.suggestedAugmentations,
  );
  const [ignoredAugmentations, setIgnoredAugmentations] = useState<AugmentationObject[]>(
    SidebarLoader.ignoredAugmentations,
  );

  useEffect(() => {
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.type === UPDATE_SIDEBAR_TABS_MESSAGE) {
        setInstalledAugmentations(SidebarLoader.installedAugmentations);
        setSuggestedAugmentations(SidebarLoader.suggestedAugmentations);
        setIgnoredAugmentations(SidebarLoader.ignoredAugmentations);
      }
    });
  }, []);

  const handleUnIgnore = (augmentation: AugmentationObject) => {
    SidebarLoader.ignoredAugmentations = SidebarLoader.ignoredAugmentations.filter(
      (i) => i.id !== augmentation.id,
    );
    chrome.storage.local.remove(`ignored-${augmentation.id}`);
    SidebarLoader.suggestedAugmentations.push(augmentation);
    chrome.runtime.sendMessage({ type: UPDATE_SIDEBAR_TABS_MESSAGE });
  };

  return (
    <Router>
      <div className="insight-active-augmentations-page">
        <Row>
          <Col>
            <h2>Your custom filters for this page</h2>
            <h3>{`${SidebarLoader.url.href.slice(0, 60)}...`}</h3>
            {installedAugmentations.map((augmentation) => (
              <div className="installed-augmentation-row" key={augmentation.id}>
                <Link
                  component={EditAugmentationPage}
                  componentProps={{ augmentation: { ...augmentation, installed: true } }}
                  key={augmentation.id}
                >
                  <Button className="installed-augmentation-button installed " type="text" block>
                    {augmentation.name}
                  </Button>
                </Link>
              </div>
            ))}
          </Col>
        </Row>
        <Row>
          <Button
            className="add-augmentation-button"
            type="text"
            block
            onClick={() =>
              goTo(EditAugmentationPage, { augmentation: EMPTY_AUGMENTATION, isAdding: true })
            }
          >
            ➕ Add filter
          </Button>
        </Row>
        <Row>
          <Col>
            <h2>Suggested filters for this page</h2>
            {suggestedAugmentations
              .filter((i) => i.actions.action_list.some((i) => i.key !== 'inject_js'))
              .map((augmentation) => (
                <Link
                  component={EditAugmentationPage}
                  componentProps={{
                    augmentation: { ...augmentation, installed: false },
                    isAdding: true,
                  }}
                  key={augmentation.id}
                >
                  <Button type="text" block key={augmentation.id}>
                    {augmentation.name}
                  </Button>
                </Link>
              ))}
          </Col>
        </Row>
        <Row>
          <Col>
            <h2>Hidden filters</h2>
            {ignoredAugmentations.map((augmentation) => (
              <Button
                type="text"
                block
                key={augmentation.id}
                onClick={() => handleUnIgnore(augmentation)}
              >
                {augmentation.name}
              </Button>
            ))}
          </Col>
        </Row>
      </div>
    </Router>
  );
};
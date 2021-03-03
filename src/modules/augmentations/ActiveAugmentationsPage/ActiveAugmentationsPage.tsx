import React, { useEffect, useState } from 'react';
import Router, { Link, goTo } from 'route-lite';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Button from 'antd/lib/button';
import { EditAugmentationPage } from 'modules/augmentations';
import { EMPTY_AUGMENTATION } from 'utils/constants';
import 'antd/lib/button/style/index.css';
import 'antd/lib/grid/style/index.css';
import './ActiveAugmentationsPage.scss';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';

export const ActiveAugmentationsPage: ActiveAugmentationsPage = () => {
  const [augmentations, setAugmentations] = useState<AugmentationObject[]>();

  useEffect(() => {
    setAugmentations(SidebarLoader.installedAugmentations);
  }, [SidebarLoader.installedAugmentations]);

  return (
    <Router>
      <div className="inisight-active-augmentations-page">
        <Row>
          <Col>
            <h2>Installed augmentations for this page</h2>
            <h3>{`${SidebarLoader.url.href.slice(0, 60)}...`}</h3>
            {augmentations?.map((augmentation) => (
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
            ➕ Add extension
          </Button>
        </Row>
        <Row>
          <Col>
            <h2>Suggested augmentations for this page</h2>
            {SidebarLoader.suggestedAugmentations
              .filter(
                (i) =>
                  !SidebarLoader.installedAugmentations.some(
                    (installed) => installed.id === i.id,
                  ) && i.actions.action_list.some((i) => i.key !== 'inject_js'),
              )
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
      </div>
    </Router>
  );
};

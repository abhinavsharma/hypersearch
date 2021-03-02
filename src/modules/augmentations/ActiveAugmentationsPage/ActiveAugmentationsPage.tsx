import React, { useCallback, useContext, useEffect, useState } from 'react';
import Router, { Link } from 'route-lite';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Button from 'antd/lib/button';
import { AugmentationContext } from 'modules/sidebar';
import { EditAugmentationPage } from 'modules/augmentations';
import { getLocalAugmentations } from 'lib/getLocalAugmentations/getLocalAugmentations';
import 'antd/lib/button/style/index.css';
import 'antd/lib/grid/style/index.css';
import './ActiveAugmentationsPage.scss';
import { EDIT_AUGMENTATION_SUCCESS } from 'utils/messages';

export const ActiveAugmentationsPage = () => {
  const [localAugmentations, setLocalAugmentations] = useState<SuggestedAugmentationObject[]>();
  const { suggested, url } = useContext<AugmentationContext>(AugmentationContext);

  const loadAugmentations = useCallback(async () => {
    const results = await getLocalAugmentations();
    setLocalAugmentations(suggested.filter((i) => results.includes(i.id)));
  }, []);

  useEffect(() => {
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.type === EDIT_AUGMENTATION_SUCCESS) {
        loadAugmentations();
      }
    });
  }, []);

  useEffect(() => {
    loadAugmentations();
  }, [loadAugmentations]);

  return (
    <Router>
      <div className="inisight-active-augmentations-page">
        <Row>
          <Col>
            <h2>Installed augmentations for this page</h2>
            <h3>{`${url.slice(0, 60)}...`}</h3>
            {!!localAugmentations &&
              localAugmentations.map((augmentation) => (
                <Link
                  component={EditAugmentationPage}
                  componentProps={{ augmentation, enabled: true }}
                  key={augmentation.id}
                >
                  <Button className="installed-augmentation-button" type="text" block>
                    {augmentation.name}
                  </Button>
                </Link>
              ))}
          </Col>
        </Row>
        <Row>
          <Col>
            <h2>Suggested augmentations for this page</h2>
            {suggested
              .filter(
                (suggested) => !localAugmentations?.find((local) => local.id === suggested.id),
              )
              .map((augmentation) => (
                <Link
                  component={EditAugmentationPage}
                  componentProps={{ augmentation, enabled: false }}
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

import React, { useContext } from 'react';
import Router, { Link } from 'route-lite';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Button from 'antd/lib/button';
import { AugmentationContext } from 'components/Sidebar/Sidebar';
import { AllAugmentationsPage } from 'components/AllAugmentationsPage/AllAugmentationsPage';
import 'antd/lib/button/style/index.css';
import 'antd/lib/grid/style/index.css';
import './ActiveAugmentationsPage.scss';
import { EditAugmentationPage } from 'components/EditAugmentationPage/EditAugmentationPage';

const AllAugmentationsButton = ({ suggested }) => (
  <Link component={AllAugmentationsPage} componentProps={{ suggested }}>
    <Button type="primary" block className="insight-add-augmentation-button">
      See all suggested augmentations
    </Button>
  </Link>
);

export const ActiveAugmentationsPage = () => {
  const { suggested, installed, url } = useContext<AugmentationContext>(AugmentationContext);

  return (
    <Router>
      <div className="inisight-active-augmentations-page">
        <Row>
          <Col>
            <h2>Installed augmentations for this page</h2>
            <h3>{`${url.slice(0, 60)}...`}</h3>
            {installed.map((augmentation) => (
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
            {suggested.slice(0, 10).map((augmentation) => (
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
        <AllAugmentationsButton suggested={suggested} />
      </div>
    </Router>
  );
};
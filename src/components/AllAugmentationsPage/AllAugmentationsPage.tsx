import React from 'react';
import { Link } from 'route-lite';
import Button from 'antd/lib/button';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import { goBack } from 'route-lite';
import 'antd/lib/button/style/index.css';
import 'antd/lib/grid/style/index.css';
import './AllAugmentationsPage.scss';
import { EditAugmentationPage } from 'components/EditAugmentationPage/EditAugmentationPage';

const Header = () => (
  <>
    <div className="add-augmentation-tab-header ant-tabs-tab">
      <Button type="link" onClick={() => goBack()}>
        Close
      </Button>
      <span>Extensions</span>
    </div>
    <h2>All suggested augmentations for this page</h2>
  </>
);

export const AllAugmentationsPage: AllAugmentationsPage = ({ suggested }) => {
  return (
    <div className="all-augmentations-page-container">
      <Header />

      <div className="all-augmentations-page-wrapper">
        <Row>
          <Col>
            {suggested.map((augmentation) => (
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
    </div>
  );
};

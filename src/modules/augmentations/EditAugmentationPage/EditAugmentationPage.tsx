import React, { useState } from 'react';
import Button from 'antd/lib/button';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Switch from 'antd/lib/switch';
import Typography from 'antd/lib/typography';
import { goBack } from 'route-lite';
import { ShareAugmentationButton, DeleteAugmentationButton } from 'modules/augmentations';
import 'antd/lib/button/style/index.css';
import 'antd/lib/typography/style/index.css';
import 'antd/lib/switch/style/index.css';
import 'antd/lib/input/style/index.css';
import 'antd/lib/grid/style/index.css';
import './EditAugmentationPage.scss';

const { Text } = Typography;

const Header = () => (
  <>
    <div className="edit-augmentation-tab-header ant-tabs-tab">
      <Button type="link" onClick={() => goBack()} className="insight-augmentation-tab-button">
        Cancel
      </Button>
      <span>Edit extension</span>
      <Button type="link" onClick={() => null} className="insight-augmentation-tab-button">
        Save
      </Button>
    </div>
  </>
);

export const EditAugmentationPage: EditAugmentationPage = ({ augmentation, enabled }) => {
  const [name, setName] = useState<string>(augmentation.name);

  const handleEditName = {
    onChange: setName,
    autoSize: {
      minRows: 1,
      maxRows: 1,
    },
  };

  return (
    <div className="edit-augmentation-page-container">
      <Header />
      <div className="edit-augmentation-page-wrapper">
        <Row>
          <Col xs={12}>Name</Col>
          <Col xs={12}>
            <Text editable={handleEditName}>{name}</Text>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>Description</Col>
          <Col xs={12}>{augmentation.description}</Col>
        </Row>
        <Row>
          <Col xs={12}>Enabled</Col>
          <Col xs={12}>
            <Switch defaultChecked={enabled} />
          </Col>
        </Row>
        <Row className="button-row">
          <Col xs={12}>
            <ShareAugmentationButton />
          </Col>
          <Col xs={12}>
            <DeleteAugmentationButton />
          </Col>
        </Row>
        <div className="edit-augmentation-logic-wrapper">
          <Row className="no-border">
            <Col>
              <h2>Edit logic</h2>
              <span>
                If <strong>{augmentation.conditions.evaluate_with === 'OR' ? 'any' : 'all'}</strong>{' '}
                of these conditions are true
              </span>
            </Col>
          </Row>
          {augmentation.conditions.condition_list.map((condition, i) => (
            <Row key={condition.value + String(i)} className="edit-augmentation-condition-row">
              <Col xs={12}>{condition.label}</Col>
              <Col xs={12}>{condition.value}</Col>
            </Row>
          ))}
          <Row className="no-border">
            <Col>
              <span>Then</span>
            </Col>
          </Row>
          {augmentation.actions.action_list.map((action, i) => (
            <Row key={action.value + String(i)} className="edit-augmentation-condition-row">
              <Col xs={12}>{action.label}</Col>
              <Col xs={12}>
                {Array.isArray(action.value)
                  ? `[ ${action.value
                      .map((value) => value)
                      .toString()
                      .split(',')
                      .join(', ')} ]`
                  : action.value}
              </Col>
            </Row>
          ))}
        </div>
      </div>
    </div>
  );
};

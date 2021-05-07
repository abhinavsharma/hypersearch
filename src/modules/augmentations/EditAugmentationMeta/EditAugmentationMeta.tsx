import React from 'react';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Input from 'antd/lib/input';
import Switch from 'antd/lib/switch';
import { DeleteAugmentationButton } from 'modules/augmentations';
import { ShareButton } from 'modules/shared';
import 'antd/lib/switch/style/index.css';
import 'antd/lib/input/style/index.css';
import 'antd/lib/grid/style/index.css';
import './EditAugmentationMeta.scss';

export const EditAugmentationMeta: EditAugmentationMeta = ({
  augmentation,
  name,
  onNameChange,
  description,
  onDescriptionChange,
  enabled,
  setEnabled,
}) => {
  return (
    <>
      <Row className="insight-large-input-row">
        <Col xs={12}>Name</Col>
        <Col xs={12}>
          <Input onChange={onNameChange} value={name} />
        </Col>
      </Row>
      <Row className="insight-large-input-row">
        <Col xs={12}>Description (optional)</Col>
        <Col xs={12}>
          <Input onChange={onDescriptionChange} value={description} />
        </Col>
      </Row>
      <Row className="insight-large-input-row">
        <Col xs={12}>Enabled</Col>
        <Col xs={12}>
          <Switch
            className="augmentation-enabled-switch"
            defaultChecked={enabled}
            onChange={setEnabled}
          />
        </Col>
      </Row>
      <div id="meta-button-row">
        <ShareButton disabled={!augmentation.installed} augmentation={augmentation} />
        <DeleteAugmentationButton augmentation={augmentation} disabled={!augmentation.installed} />
      </div>
    </>
  );
};

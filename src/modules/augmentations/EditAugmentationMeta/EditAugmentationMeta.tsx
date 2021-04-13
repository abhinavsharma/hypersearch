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
      <Row>
        <Col xs={12}>Name</Col>
        <Col xs={12}>
          <Input onChange={onNameChange} value={name} />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>Description (optional)</Col>
        <Col xs={12}>
          <Input onChange={onDescriptionChange} value={description} />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>Enabled</Col>
        <Col xs={12}>
          <Switch defaultChecked={enabled} onChange={setEnabled} />
        </Col>
      </Row>
      <Row className="button-row">
        <Col xs={12}>
          <ShareButton disabled={!augmentation.installed} augmentation={augmentation} />
        </Col>
        <Col xs={12}>
          <DeleteAugmentationButton
            augmentation={augmentation}
            disabled={!augmentation.installed}
          />
        </Col>
      </Row>
    </>
  );
};

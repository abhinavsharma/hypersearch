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

/** MAGICS **/
const NAME_SECTION_LABEL = 'Name';
const DESCRIPTION_SECTION_LABEL = 'Description (optional)';
const ENABLED_SECTION_LABEL = 'Enabled';

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
        <Col xs={12}>{NAME_SECTION_LABEL}</Col>
        <Col xs={12}>
          <Input onChange={onNameChange} value={name} />
        </Col>
      </Row>
      <Row className="insight-large-input-row">
        <Col xs={12}>{DESCRIPTION_SECTION_LABEL}</Col>
        <Col xs={12}>
          <Input onChange={onDescriptionChange} value={description} />
        </Col>
      </Row>
      <Row className="insight-large-input-row">
        <Col xs={12}>{ENABLED_SECTION_LABEL}</Col>
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

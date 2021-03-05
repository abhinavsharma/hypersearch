import React, { useEffect, useState } from 'react';
import { debug } from 'lumos-shared-js';
import { goBack } from 'route-lite';
import Button from 'antd/lib/button';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Switch from 'antd/lib/switch';
import Typography from 'antd/lib/typography';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import { v4 as uuid } from 'uuid';
import { UPDATE_SIDEBAR_TABS_MESSAGE } from 'utils/constants';
import {
  ShareAugmentationButton,
  DeleteAugmentationButton,
  EditConditionInput,
  EditActionInput,
} from 'modules/augmentations';
import 'antd/lib/button/style/index.css';
import 'antd/lib/typography/style/index.css';
import 'antd/lib/switch/style/index.css';
import 'antd/lib/input/style/index.css';
import 'antd/lib/grid/style/index.css';
import './EditAugmentationPage.scss';

const { Text } = Typography;

export const EditAugmentationPage: EditAugmentationPage = ({ augmentation, isAdding }) => {
  const [installedAugmentations, setInstalledAugmentations] = useState<AugmentationObject[]>();
  const [name, setName] = useState<string>(augmentation.name);
  const [description, setDescription] = useState<string>(augmentation.description);
  const [isActive, setIsActive] = useState<boolean>(augmentation.enabled || isAdding);
  const [conditionEvaluation, setConditionEvaluation] = useState<Condition['evaluate_with']>(
    augmentation.conditions.evaluate_with,
  );

  const [conditions, setConditions] = useState<CustomCondition[]>(
    augmentation.conditions.condition_list.map((cond, index) => ({
      ...cond,
      id: index.toString(),
    })),
  );

  const [actions, setActions] = useState<ActionObject[]>(augmentation.actions.action_list);

  useEffect(() => {
    setInstalledAugmentations(SidebarLoader.installedAugmentations);
  }, [SidebarLoader.installedAugmentations]);

  const handleSave = () => {
    if (isDisabled) return null;
    const customId = `cse-custom-${
      augmentation.id !== '' ? augmentation.id : name.replace(/[\s]/g, '_').toLowerCase()
    }-${uuid()}`;
    const id = augmentation.id.startsWith('cse-custom-') ? augmentation.id : customId;
    const updated = {
      ...augmentation,
      id,
      name,
      description,
      conditions: {
        condition_list: conditions,
        evaluate_with: conditionEvaluation,
      },
      actions: {
        ...augmentation.actions,
        action_list: actions,
      },
      enabled: isActive,
      installed: true,
    };
    debug(
      'EditAugmentationPage - save\n---\n\tOriginal',
      augmentation,
      '\n\tUpdated',
      updated,
      '\n---',
    );
    SidebarLoader.installedAugmentations = [
      updated,
      ...installedAugmentations.filter((i) => i.id !== updated.id),
    ];
    chrome.storage.local.set({ [id]: updated });
    chrome.runtime.sendMessage({ type: UPDATE_SIDEBAR_TABS_MESSAGE });
    setTimeout(() => goBack(), 100);
  };

  const handleDeleteAction = (e: string) => {
    setActions((prev) => {
      const updated = { ...prev[0], value: prev[0].value.filter((i) => i !== e) };
      return [updated];
    });
  };

  const handleSaveAction = (e: string) => {
    setActions((prev) => {
      const updated = prev[0];
      const existingIndex = updated.value.indexOf(e);
      if (existingIndex > 1) updated.value.map((cur, index) => (index === existingIndex ? e : cur));
      else updated.value.push(e);
      return [updated];
    });
  };

  const handleDeleteCondition = (e) => {
    setConditions((prev) => prev.filter((i) => i.value !== e.value));
  };

  const handleSaveCondition = (e) => {
    setConditions((prev) =>
      prev.map((i) => {
        if (i.id === e.id) {
          return e;
        } else {
          return i;
        }
      }),
    );
  };

  const handleAddCondition = (e) => {
    setConditions((prev) => [...prev, e]);
  };

  const handleEditName = {
    onChange: setName,
    autoSize: {
      minRows: 1,
      maxRows: 1,
    },
  };

  const handleEditDescription = {
    onChange: setDescription,
    autoSize: {
      minRows: 1,
      maxRows: 1,
    },
  };

  const isDisabled = !name || !actions.length || !conditions.length;

  return (
    <div className="edit-augmentation-page-container">
      <div className="edit-augmentation-tab-header ant-tabs-tab">
        <Button type="link" onClick={goBack} className="insight-augmentation-tab-button">
          Cancel
        </Button>
        <span>{`${!isAdding ? 'Edit' : 'Add'} filter`}</span>
        <Button
          type="link"
          onClick={handleSave}
          className="insight-augmentation-tab-button"
          disabled={isDisabled}
        >
          {!isAdding ? 'Save' : 'Add'}
        </Button>
      </div>
      <div className="edit-augmentation-page-wrapper">
        <Row>
          <Col xs={12}>Name</Col>
          <Col xs={12}>
            <Text editable={handleEditName}>{name}</Text>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>Description</Col>
          <Col xs={12}>
            <Text editable={handleEditDescription}>{description}</Text>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>Enabled</Col>
          <Col xs={12}>
            <Switch defaultChecked={isActive} onChange={setIsActive} />
          </Col>
        </Row>
        <Row className="button-row">
          <Col xs={12}>
            <ShareAugmentationButton
              augmentation={augmentation}
              disabled={!augmentation.installed}
            />
          </Col>
          <Col xs={12}>
            <DeleteAugmentationButton
              augmentation={augmentation}
              disabled={!augmentation.installed}
            />
          </Col>
        </Row>
        <div className="edit-augmentation-logic-wrapper">
          <Row className="no-border">
            <Col>
              <h2>Edit logic</h2>
              <span className="operation-description">
                If{' '}
                <Button
                  type="link"
                  onClick={() => setConditionEvaluation((prev) => (prev == 'AND' ? 'OR' : 'AND'))}
                  className="insight-augmentation-edit-evaluation"
                >
                  <strong>{conditionEvaluation == 'AND' ? 'all' : 'any'}</strong>
                </Button>
                of these conditions are true
              </span>
            </Col>
          </Row>
          {conditions.map((condition, i) => (
            <EditConditionInput
              key={condition.value + String(i)}
              condition={condition}
              label={condition.label}
              addCondition={handleAddCondition}
              saveCondition={handleSaveCondition}
              deleteCondition={handleDeleteCondition}
              noDelete={conditions.length === 1}
              disabled={!condition.value}
            />
          ))}
          <Row className="no-border">
            <Button
              className="add-operation-button"
              type="link"
              block
              onClick={() =>
                setConditions((prev) => [
                  ...prev,
                  {
                    id: conditions.length.toString(),
                    key: 'search_contains',
                    type: 'list',
                    label: 'Search results contain domain',
                    value: [''],
                  },
                ])
              }
            >
              ➕ Add condition
            </Button>
          </Row>
          <Row className="no-border">
            <Col>
              <span className="operation-description">Then</span>
            </Col>
          </Row>
          {actions.map(({ value, label }) =>
            value.map((action, i) => (
              <EditActionInput
                key={`${action}-${i}`}
                label={i === 0 && label}
                action={action}
                saveAction={handleSaveAction}
                deleteAction={handleDeleteAction}
                noDelete={value.length === 1}
              />
            )),
          )}
          <EditActionInput
            label={undefined}
            action={''}
            saveAction={handleSaveAction}
            deleteAction={handleDeleteAction}
            noDelete={false}
          />
        </div>
      </div>
    </div>
  );
};

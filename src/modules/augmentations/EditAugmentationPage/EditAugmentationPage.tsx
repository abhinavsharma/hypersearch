import React, { useEffect, useState } from 'react';
import { debug } from 'lumos-shared-js';
import { goBack } from 'route-lite';
import Button from 'antd/lib/button';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Input from 'antd/lib/input';
import Switch from 'antd/lib/switch';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import { v4 as uuid } from 'uuid';
import { EMPTY_AUGMENTATION, UPDATE_SIDEBAR_TABS_MESSAGE } from 'utils/constants';
import {
  ShareAugmentationButton,
  DeleteAugmentationButton,
  EditConditionInput,
  EditActionInput,
} from 'modules/augmentations';
import 'antd/lib/button/style/index.css';
import 'antd/lib/switch/style/index.css';
import 'antd/lib/input/style/index.css';
import 'antd/lib/grid/style/index.css';
import './EditAugmentationPage.scss';

export const EditAugmentationPage: EditAugmentationPage = ({ augmentation, isAdding }) => {
  const [installedAugmentations, setInstalledAugmentations] = useState<AugmentationObject[]>();
  const [name, setName] = useState<string>(augmentation.name);
  const [description, setDescription] = useState<string>(augmentation.description);
  const [isActive, setIsActive] = useState<boolean>(augmentation.enabled || isAdding);
  const [conditionEvaluation, setConditionEvaluation] = useState<Condition['evaluate_with']>(
    augmentation.conditions.evaluate_with,
  );

  const [conditions, setConditions] = useState<CustomCondition[]>(
    isAdding && !augmentation.conditions.condition_list[0].value.length
      ? Array(5)
          .fill(null)
          .map((_, i) => ({
            ...EMPTY_AUGMENTATION.conditions.condition_list[0],
            value: [
              Array.from(new Set(SidebarLoader.domains.map((domain) => domain.split('/')[0])))[i],
            ],
            id: i.toString(),
          }))
          .filter((i) => !!i.value[0])
      : augmentation.conditions.condition_list.map((cond, index) => ({
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

  const handleEditName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleEditDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
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
            <Input onChange={handleEditName} value={name} />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>Description</Col>
          <Col xs={12}>
            <Input onChange={handleEditDescription} value={description} />
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
          <Row className="no-border condition-footer">
            <Button
              className="add-operation-button"
              type="link"
              onClick={() =>
                setConditions((prev) => [
                  ...prev.filter((i) => i.key !== 'any_url'),
                  {
                    id: conditions.length.toString(),
                    key: 'search_contains',
                    type: 'list',
                    label: 'Search results contain domain',
                    value: [''],
                    isAdding: true,
                  },
                ])
              }
            >
              ➕ Add condition
            </Button>
            {conditions[0].key !== 'any_url' && (
              <Button
                type="link"
                onClick={() =>
                  setConditions([
                    {
                      id: '0',
                      key: 'any_url',
                      label: 'Any page',
                      type: 'list',
                      value: ['.*'],
                    },
                  ])
                }
              >
                Match any page
              </Button>
            )}
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
            label={!actions[0].value.length && 'Search only these domains'}
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

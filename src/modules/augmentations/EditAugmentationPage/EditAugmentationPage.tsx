import React, { useEffect, useState } from 'react';
import { goBack } from 'route-lite';
import Button from 'antd/lib/button';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import { v4 as uuid } from 'uuid';
import { EMPTY_AUGMENTATION, UPDATE_SIDEBAR_TABS_MESSAGE } from 'utils/constants';
import { debug } from 'utils/helpers';
import { EditAugmentationMeta, EditAugmentationActions } from 'modules/augmentations';
import 'antd/lib/button/style/index.css';
import 'antd/lib/collapse/style/index.css';
import './EditAugmentationPage.scss';
import { EditAugmentationConditions } from '../EditAugmentationConditions/EditAugmentationConditions';
import Collapse from 'antd/lib/collapse/Collapse';
import { flipSidebar } from 'utils/flipSidebar/flipSidebar';

const { Panel } = Collapse;

export const EditAugmentationPage: EditAugmentationPage = ({
  augmentation,
  isAdding,
  initiatedFromActives,
  setActiveKey,
}) => {
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

  const handleClose = () => {
    if (!setActiveKey) {
      goBack();
    } else {
      setActiveKey(isAdding && !initiatedFromActives ? '1' : '0');
      goBack();
    }
  };

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

  const handleDeleteCondition = (e: CustomCondition) => {
    setConditions((prev) => prev.filter((i) => i.value !== e.value));
  };

  const handleSaveCondition = (e: CustomCondition) => {
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

  const handleAddCondition = (e: CustomCondition) => {
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
        <Button type="link" onClick={handleClose} className="insight-augmentation-tab-button">
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
        <Collapse accordion defaultActiveKey={['1']}>
          <Panel header="Do this" key="1">
            <div className="edit-augmentation-logic-wrapper">
              <EditAugmentationActions
                actions={actions}
                onSave={handleSaveAction}
                onDelete={handleDeleteAction}
              />
            </div>
          </Panel>
          <Panel header="When" key="2">
            <div className="edit-augmentation-logic-wrapper">
              <EditAugmentationConditions
                conditions={conditions}
                setConditions={setConditions}
                evaluation={conditionEvaluation}
                setEvaluation={setConditionEvaluation}
                onAdd={handleAddCondition}
                onDelete={handleDeleteCondition}
                onSave={handleSaveCondition}
              />
            </div>
          </Panel>
          <Panel header="About" key="3">
            <EditAugmentationMeta
              augmentation={augmentation}
              name={name}
              description={description}
              onNameChange={handleEditName}
              onDescriptionChange={handleEditDescription}
              enabled={isActive}
              setEnabled={setIsActive}
            />
          </Panel>
        </Collapse>
      </div>
    </div>
  );
};

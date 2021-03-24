import React, { useEffect, useState } from 'react';
import { goBack } from 'route-lite';
import Collapse from 'antd/lib/collapse/Collapse';
import Button from 'antd/lib/button';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import { v4 as uuid } from 'uuid';
import { EMPTY_AUGMENTATION, UPDATE_SIDEBAR_TABS_MESSAGE } from 'utils/constants';
import { debug } from 'utils/helpers';
import {
  EditAugmentationMeta,
  EditAugmentationActions,
  EditAugmentationConditions,
} from 'modules/augmentations';
import 'antd/lib/button/style/index.css';
import 'antd/lib/collapse/style/index.css';
import './EditAugmentationPage.scss';

const { Panel } = Collapse;

export const EditAugmentationPage: EditAugmentationPage = ({
  augmentation,
  isAdding,
  initiatedFromActives,
  setActiveKey,
}) => {
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
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
      : augmentation.conditions.condition_list.map((condition, index) => ({
          ...condition,
          id: index.toString(),
        })),
  );

  const [actions, setActions] = useState<CustomAction[]>(
    augmentation.actions.action_list.map((action, index) => ({
      ...action,
      id: index.toString(),
    })),
  );

  useEffect(() => {
    setInstalledAugmentations(SidebarLoader.installedAugmentations);
  }, [SidebarLoader.installedAugmentations]);

  useEffect(() => {
    setIsDisabled(
      !name ||
        !actions.length ||
        !conditions.length ||
        !!actions?.filter((action) => !action.key).length,
    );
  }, [name, actions, conditions.length]);

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
        action_list: actions.map((action) => ({
          ...action,
          value: action.value.filter((i) => i !== ''),
        })),
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

  const handleSaveAction = (e: CustomAction) => {
    setActions((prev) => {
      // Merge all `search_domains` actions into one action.
      if (e.key === 'search_domains') {
        const existing = prev.find((i) => i.key === 'search_domains');
        if (existing) {
          existing.value =
            e.value[0] !== '' && e.value.length !== existing.value.length
              ? Array.from(new Set(e.value))
              : Array.from(new Set(existing.value.concat(e.value)));
          // We also need to remove all the other actions with `search_domains` key, because
          // when the user adds a new action with that key, A new index will be created anyway.
          return prev.reduce((newActions, prevAction) => {
            if (prevAction.id === existing.id) {
              newActions.push(existing);
            } else {
              prevAction.key && prevAction.key !== 'search_domains' && newActions.push(prevAction);
            }
            return newActions;
          }, []);
        }
      }
      return prev.map((i) => {
        if (i.id === e.id) {
          return {
            ...e,
            key: e.key ?? i.key,
            label: e.label ?? i.label,
          };
        } else {
          return i;
        }
      });
    });
  };

  const handleDeleteCondition = (e: CustomCondition) => {
    setConditions((prev) => prev.filter((i) => i.value !== e.value));
  };

  const handleDeleteAction = (e: CustomAction) => {
    setActions((prev) => prev.filter((i) => i.id !== e.id));
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

  const handleAddAction = (e: CustomAction) => {
    setActions((prev) => [...prev, e]);
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

  return (
    <div className="edit-augmentation-page-container">
      <div className="edit-augmentation-tab-header ant-tabs-tab">
        <Button type="link" onClick={handleClose} className="insight-augmentation-tab-button">
          Cancel
        </Button>
        <span>{`${!isAdding ? 'Edit' : 'Add'} lens`}</span>
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
                onAdd={handleAddAction}
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

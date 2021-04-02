import React, { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { goBack } from 'route-lite';
import Collapse from 'antd/lib/collapse/Collapse';
import Button from 'antd/lib/button';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import AugmentationManager from 'lib/AugmentationManager/AugmentationManager';
import { EMPTY_AUGMENTATION, SEARCH_DOMAINS_ACTION, SEARCH_HIDE_DOMAIN_ACTION } from 'utils';
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
  augmentation = Object.create(null),
  isAdding,
  initiatedFromActives,
  setActiveKey,
}) => {
  const [refreshOnSave, setRefreshOnSave] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [name, setName] = useState<string>(
    isAdding && !!augmentation.name.length
      ? `${augmentation.name} / Modified`
      : augmentation.name || '🎉 My Lens',
  );
  const [description, setDescription] = useState<string>(isAdding ? '' : augmentation.description);
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
            id: uuid(),
          }))
          .filter(({ value }) => !!value[0])
      : augmentation.conditions.condition_list.map((condition) => ({
          ...condition,
          id: uuid(),
        })),
  );

  const [actions, setActions] = useState<CustomAction[]>(
    augmentation.actions.action_list.map((action) => ({
      ...action,
      id: uuid(),
    })),
  );

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
    AugmentationManager.addOrEditAugmentation(
      augmentation,
      {
        actions,
        conditions,
        conditionEvaluation,
        description,
        name,
        isActive,
      },
      refreshOnSave,
    );
    setTimeout(() => goBack(), 100);
  };

  const handleSaveAction = (e: CustomAction) => {
    setActions((prev) => {
      if (e.key === SEARCH_HIDE_DOMAIN_ACTION) {
        setRefreshOnSave(true);
      }
      // Merge all `search_domains` actions into one action.
      if (e.key === SEARCH_DOMAINS_ACTION) {
        const existing = prev.find((i) => i.key === SEARCH_DOMAINS_ACTION);
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
              prevAction.key &&
                prevAction.key !== SEARCH_DOMAINS_ACTION &&
                newActions.push(prevAction);
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
    setActions((prev) => {
      if (e.key === SEARCH_HIDE_DOMAIN_ACTION) {
        setRefreshOnSave(true);
      }
      return prev.filter((i) => i.id !== e.id);
    });
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
        <span>{`${!isAdding ? 'Edit' : 'Add'} Lens`}</span>
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

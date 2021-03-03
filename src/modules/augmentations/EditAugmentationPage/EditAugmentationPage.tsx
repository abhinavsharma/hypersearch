import React, { useEffect, useState } from 'react';
import { goBack } from 'route-lite';
import Button from 'antd/lib/button';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Switch from 'antd/lib/switch';
import Typography from 'antd/lib/typography';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
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
  const [isActive, setIsActive] = useState<boolean>(augmentation.enabled);
  const [conditionEvaluation, setConditionEvaluation] = useState<Condition['evaluate_with']>(
    augmentation.conditions.evaluate_with,
  );

  const [conditions, setConditions] = useState<CustomCondition[]>(
    augmentation.conditions.condition_list.map((cond, index) => ({
      ...cond,
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

  const handleSave = async () => {
    if (isDisabled) return null;
    const updated = {
      ...augmentation,
      id: augmentation.id !== '' ? augmentation.id : name.replace(/[\s]/g, '_').toLowerCase(),
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
    SidebarLoader.installedAugmentations = [
      updated,
      ...installedAugmentations.filter((i) => i.id !== updated.id),
    ];
    chrome.storage.local.set({ [augmentation.id]: updated });
    chrome.runtime.sendMessage({ type: UPDATE_SIDEBAR_TABS_MESSAGE });
    setTimeout(() => goBack(), 100);
  };

  const handleDeleteAction = (e) => {
    setActions((prev) => prev.filter((i) => i.value !== e.value));
  };

  const handleSaveAction = (e) => {
    console.log(e);
    setActions((prev) =>
      prev.map((i) => {
        if (i.id === e.id) {
          return e;
        } else {
          return i;
        }
      }),
    );
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

  const handleAddAction = (e) => {
    handleAddAction((prev) => [...prev, e]);
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
        <span>{`${!isAdding ? 'Edit' : 'Add'} extension`}</span>
        <Button
          type="link"
          onClick={handleSave}
          className="insight-augmentation-tab-button"
          disabled={isDisabled}
        >
          {!isAdding ? 'Save' : 'Install'}
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
              <span>
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
              type="text"
              block
              onClick={() =>
                setConditions((prev) => [
                  ...prev,
                  {
                    id: conditions.length.toString(),
                    key: 'search_contains',
                    type: 'list',
                    label: 'Search results contain domain',
                    value: '',
                  },
                ])
              }
            >
              ➕ Add condition
            </Button>
          </Row>
          <Row className="no-border">
            <Col>
              <span>Then</span>
            </Col>
          </Row>
          {actions.map((action, i) => (
            <EditActionInput
              key={action.value + String(i)}
              action={action}
              addAction={handleAddAction}
              saveAction={handleSaveAction}
              deleteAction={handleDeleteAction}
              noDelete={actions.length === 1}
              disabled={!action.value}
            />
          ))}
          <Row className="no-border">
            <Button
              className="add-operation-button"
              type="text"
              block
              onClick={() =>
                setActions((prev) => [
                  ...prev,
                  {
                    id: prev.length.toString(),
                    key: 'search_domains',
                    label: 'Search only these domains',
                    type: 'list',
                    value: '',
                  },
                ])
              }
            >
              ➕ Add action
            </Button>
          </Row>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import Collapse from 'antd/lib/collapse/Collapse';
import Button from 'antd/lib/button';
import Popover from 'antd/lib/popover';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import AugmentationManager from 'lib/AugmentationManager/AugmentationManager';
import {
  EditAugmentationMeta,
  EditAugmentationActions,
  EditAugmentationConditions,
} from 'modules/augmentations';
import {
  ANY_URL_CONDITION_TEMPLATE,
  EMPTY_AUGMENTATION,
  OPEN_AUGMENTATION_BUILDER_MESSAGE,
  OPEN_BUILDER_PAGE,
  SEARCH_DOMAINS_ACTION,
  SEARCH_INTENT_IS_US_NEWS_TEMPLATE,
  SIDEBAR_Z_INDEX,
} from 'utils';
import 'antd/lib/button/style/index.css';
import 'antd/lib/popover/style/index.css';
import 'antd/lib/collapse/style/index.css';
import './EditAugmentationPage.scss';

const { Panel } = Collapse;

export const EditAugmentationPage: EditAugmentationPage = ({
  augmentation = EMPTY_AUGMENTATION,
  isAdding,
}) => {
  const [tourStep, setTourStep] = useState<string>(SidebarLoader.tourStep);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [name, setName] = useState<string>(
    !!tourStep
      ? '🗞 My Trusted News'
      : !augmentation.installed && !!augmentation.name?.length
      ? `${augmentation.name} / Forked`
      : augmentation.name || '🎉 My Lens',
  );
  const [description, setDescription] = useState<string>(
    !!tourStep ? 'News sources I trust' : !augmentation.installed ? '' : augmentation.description,
  );
  const [isActive, setIsActive] = useState<boolean>(
    augmentation.enabled || !augmentation.installed,
  );
  const [conditionEvaluation, setConditionEvaluation] = useState<Condition['evaluate_with']>(
    augmentation.conditions.evaluate_with,
  );

  const [conditions, setConditions] = useState<CustomCondition[]>(
    isAdding
      ? [
          {
            ...(tourStep === '2' ? SEARCH_INTENT_IS_US_NEWS_TEMPLATE : ANY_URL_CONDITION_TEMPLATE),
            id: uuid(),
          },
        ]
      : augmentation.conditions.condition_list.map((condition) => ({
          ...condition,
          id: uuid(),
        })),
  );

  const [actions, setActions] = useState<CustomAction[]>(
    !!tourStep
      ? [
          {
            id: uuid(),
            key: SEARCH_DOMAINS_ACTION,
            label: 'Search only these domains',
            type: 'list',
            value: ['cnn.com', 'foxnews.com', 'wsj.com', 'bloomberg.com', 'apnews.com'],
          },
        ]
      : augmentation.actions.action_list.map((action) => ({
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
    chrome.runtime.sendMessage({
      type: OPEN_AUGMENTATION_BUILDER_MESSAGE,
      page: OPEN_BUILDER_PAGE.ACTIVE,
    } as OpenActivePageMessage);
  };

  const handleSave = () => {
    if (isDisabled) return null;
    if (!!tourStep) {
      setTourStep('6');
      SidebarLoader.tourStep = '6';
    }
    handleClose();
    AugmentationManager.addOrEditAugmentation(augmentation, {
      actions,
      conditions,
      conditionEvaluation,
      description,
      name,
      isActive,
    });
  };

  const handleSaveAction = (e: CustomAction) => {
    setActions((prev) => prev.map((i) => (i.id === e.id ? e : i)));
  };

  const handleSaveCondition = (e: CustomCondition) => {
    setConditions((prev) => prev.map((i) => (i.id === e.id ? e : i)));
  };

  const handleDeleteCondition = (e: CustomCondition) => {
    setConditions((prev) => prev.filter((i) => i.value !== e.value));
  };

  const handleDeleteAction = (e: CustomAction) => {
    setActions((prev) => prev.filter((i) => i.id !== e.id));
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

  const WhenTourTitle = () => {
    const [isOpenWhen, setIsOpenWhen] = useState<boolean>(tourStep === '2');
    const tooltipContainer = useRef(null);

    const handleCloseWhenPopover = () => {
      setIsOpenWhen(false);
      setTourStep('3');
      SidebarLoader.tourStep = '3';
    };

    const content = (
      <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
        <span>Here, you can set the conditions for when this lens is shown</span>
        <Button block type="link" onClick={handleCloseWhenPopover}>
          Ok
        </Button>
      </div>
    );

    return (
      <div className="builder-page-collapse-panel-title">
        {tourStep === '2' ? (
          <>
            <Popover
              content={content}
              title="When this lens triggers"
              visible={isOpenWhen}
              trigger="click"
              placement="leftTop"
              getPopupContainer={() => tooltipContainer?.current}
            >
              When
            </Popover>
            <div
              className="tooltip-container popover-container"
              ref={tooltipContainer}
              style={{ zIndex: SIDEBAR_Z_INDEX + 1 }}
            />
          </>
        ) : (
          'When'
        )}
      </div>
    );
  };

  const ThenTourTitle = () => {
    const [isOpenThen, setIsOpenThen] = useState<boolean>(tourStep === '3');
    const tooltipContainer = useRef(null);

    const handleCloseThenPopover = () => {
      setIsOpenThen(false);
      setTourStep('4');
      SidebarLoader.tourStep = '4';
    };

    const content = (
      <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
        <span>
          We’re going to create a lens that searches only some domains. Click here to see all the
          different types of lens actions.
        </span>
        <Button block type="link" onClick={handleCloseThenPopover}>
          Ok
        </Button>
      </div>
    );

    return (
      <div className="builder-page-collapse-panel-title">
        {tourStep === '3' ? (
          <>
            <Popover
              content={content}
              title="What this lens does"
              visible={isOpenThen}
              trigger="click"
              placement="leftTop"
              getPopupContainer={() => tooltipContainer?.current}
            >
              When
            </Popover>
            <div
              className="tooltip-container popover-container"
              ref={tooltipContainer}
              style={{ zIndex: SIDEBAR_Z_INDEX + 1 }}
            />
          </>
        ) : (
          'Then'
        )}
      </div>
    );
  };

  const MetaTourTitle = () => {
    const [isOpenMeta, setIsOpenMeta] = useState<boolean>(tourStep === '4');
    const tooltipContainer = useRef(null);

    const handleCloseMetaPopover = () => {
      setIsOpenMeta(false);
      setTourStep('5');
      SidebarLoader.tourStep = '5';
    };

    const content = (
      <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
        <span>From here you can rename your lens, disable it temporarily or share it.</span>
        <Button block type="link" onClick={handleCloseMetaPopover}>
          Ok
        </Button>
      </div>
    );

    return (
      <div className="builder-page-collapse-panel-title">
        {tourStep === '4' ? (
          <>
            <Popover
              content={content}
              title="Metadata"
              visible={isOpenMeta}
              trigger="click"
              placement="leftTop"
              getPopupContainer={() => tooltipContainer?.current}
            >
              When
            </Popover>
            <div
              className="tooltip-container popover-container"
              ref={tooltipContainer}
              style={{ zIndex: SIDEBAR_Z_INDEX + 1 }}
            />
          </>
        ) : (
          'About'
        )}
      </div>
    );
  };

  useEffect(() => {
    setTourStep(SidebarLoader.tourStep);
  }, [SidebarLoader.tourStep]);

  return (
    <div id="builder-page" className="sidebar-page">
      <header className="sidebar-page-header">
        <Button type="link" onClick={handleClose} className="left-button">
          Cancel
        </Button>
        <span className="page-title">{`${!isAdding ? 'Edit' : 'Add'} Local Lens`}</span>
        <Button
          type="link"
          onClick={handleSave}
          className={`right-button ${tourStep === '5' ? 'insight-tour-shake' : ''}`}
          disabled={isDisabled}
        >
          {!isAdding ? 'Save' : 'Add'}
        </Button>
      </header>
      <div className="sidebar-page-wrapper">
        <Collapse defaultActiveKey={!!tourStep ? [] : ['2', '3']}>
          <Panel className="builder-page-collapse-panel" header={<WhenTourTitle />} key="1">
            <EditAugmentationConditions
              conditions={conditions}
              setConditions={setConditions}
              evaluation={conditionEvaluation}
              setEvaluation={setConditionEvaluation}
              onAdd={handleAddCondition}
              onDelete={handleDeleteCondition}
              onSave={handleSaveCondition}
            />
          </Panel>
          <Panel className="builder-page-collapse-panel" header={<ThenTourTitle />} key="2">
            <EditAugmentationActions
              actions={actions}
              onAdd={handleAddAction}
              onSave={handleSaveAction}
              onDelete={handleDeleteAction}
            />
          </Panel>
          <Panel className="builder-page-collapse-panel" header={<MetaTourTitle />} key="3">
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

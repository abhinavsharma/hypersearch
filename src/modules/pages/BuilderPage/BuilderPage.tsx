/**
 * @module modules:pages
 * @version 1.0.0
 * @license (C) Insight
 */

import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import Collapse from 'antd/lib/collapse/Collapse';
import Button from 'antd/lib/button';
import Popover from 'antd/lib/popover';
import SidebarLoader from 'lib/sidebar';
import AugmentationManager from 'lib/augmentations';
import { MetaSection, ActionsSection, ConditionsSection } from 'modules/builder';
import {
  ANY_URL_CONDITION_TEMPLATE,
  AUGMENTATION_TITLE,
  EMPTY_AUGMENTATION,
  OPEN_AUGMENTATION_BUILDER_MESSAGE,
  SIDEBAR_PAGE,
  SIDEBAR_Z_INDEX,
  TOUR_AUGMENTATION,
} from 'constant';
import 'antd/lib/button/style/index.css';
import 'antd/lib/popover/style/index.css';
import 'antd/lib/collapse/style/index.css';
import './BuilderPage.scss';

const { Panel } = Collapse;

//-----------------------------------------------------------------------------------------------
// ! Magics
//-----------------------------------------------------------------------------------------------
const HEADER_LEFT_BUTTON = 'Cancel';
const HEADER_ADD_TITLE = 'Add Local Lens';
const HEADER_EDIT_TITLE = 'Edit Local Lens';
const HEADER_ADD_RIGHT_BUTTON = 'Add';
const HEADER_EDIT_RIGHT_BUTTON = 'Save';
// * WHEN
const WHEN_HEADER_TEXT = 'When';
const WHEN_TOUR_POPUP_TITLE = 'When this lens triggers';
const WHEN_TOUR_POPUP_CONTENT = 'Here, you can set the conditions for when this lens is shown';
// * THEN
const THEN_HEADER_TEXT = 'Then';
const THEN_TOUR_POPUP_TITLE = 'What this lens does';
const THEN_TOUR_POPUP_TEXT =
  'We’re going to create a lens that searches only some domains. Click here to see all the different types of lens actions.';
// * META
const META_HEADER_TEXT = 'About';
const META_TOUR_POPUP_TITLE = 'Metadata';
const META_TOUR_POPUP_TEXT =
  'From here you can rename your lens, disable it temporarily or share it.';

const TOUR_TOOLTIP_STYLE: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  width: '200px',
};

const TOUR_TOOLTIP_CONTAINER_STYLE: React.CSSProperties = { zIndex: SIDEBAR_Z_INDEX + 1 };

//-----------------------------------------------------------------------------------------------
// ! Component
//-----------------------------------------------------------------------------------------------
export const BuilderPage: BuilderPage = ({ augmentation = EMPTY_AUGMENTATION, isAdding }) => {
  const [tourStep, setTourStep] = useState<string>(SidebarLoader.tourStep);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  const [name, setName] = useState<string>(
    /* eslint-disable */
    tourStep
      ? TOUR_AUGMENTATION.name
      : !augmentation.installed && !!augmentation.name?.length
        ? `${augmentation.name}${AUGMENTATION_TITLE.FORKED}`
        : augmentation.name || AUGMENTATION_TITLE.NEW,
    /* eslint-enable */
  );

  const [description, setDescription] = useState<string>(
    /* eslint-disable */
    tourStep
      ? TOUR_AUGMENTATION.description
      : !augmentation.installed
        ? ''
        : augmentation.description,
    /* eslint-enable */
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
            ...(tourStep === '2'
              ? TOUR_AUGMENTATION.conditions.condition_list[0]
              : ANY_URL_CONDITION_TEMPLATE),
            id: uuid(),
          },
        ]
      : augmentation.conditions.condition_list.map((condition) => ({
          ...condition,
          id: uuid(),
        })),
  );

  const [actions, setActions] = useState<CustomAction[]>(
    tourStep
      ? [
          {
            id: uuid(),
            ...TOUR_AUGMENTATION.actions.action_list[0],
          },
        ]
      : augmentation.actions.action_list.map((action) => ({
          id: uuid(),
          ...action,
        })),
  );

  //-----------------------------------------------------------------------------------------------
  // ! Handlers
  //-----------------------------------------------------------------------------------------------

  const handleClose = () => {
    chrome.runtime.sendMessage({
      type: OPEN_AUGMENTATION_BUILDER_MESSAGE,
      page: SIDEBAR_PAGE.ACTIVE,
    });
  };

  const handleSave = (): void => {
    if (isDisabled) return;
    if (tourStep) {
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

  useEffect(() => {
    setIsDisabled(
      !name ||
        !actions.length ||
        !conditions.length ||
        !!actions?.filter((action) => !action.key).length,
    );
  }, [name, actions, conditions.length]);

  useEffect(() => {
    setTourStep(SidebarLoader.tourStep);
    // Singleton instance not reinitialized on rerender.
    // ! Be careful when updating the dependency list!
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [SidebarLoader.tourStep]);

  //-----------------------------------------------------------------------------------------------
  // ! Render
  //-----------------------------------------------------------------------------------------------
  const SectionHeader: SectionHeader = ({ title, tourTitle, tourText }) => {
    const [isVisible, setIsVisible] = useState<boolean>(tourStep === '2');
    const tooltipContainer = useRef<HTMLDivElement>(null);

    const handleCloseWhenPopover = () => {
      setIsVisible(false);
      setTourStep('3');
      SidebarLoader.tourStep = '3';
    };

    const content = (
      <div style={TOUR_TOOLTIP_STYLE}>
        <span>{tourText}</span>
        <Button block type="link" onClick={handleCloseWhenPopover}>
          Ok
        </Button>
      </div>
    );

    const getPopupContainer = () => tooltipContainer.current as HTMLDivElement;

    return (
      <div className="builder-page-collapse-panel-title">
        {tourStep === '2' ? (
          <>
            <Popover
              content={content}
              title={tourTitle}
              visible={isVisible}
              trigger="click"
              placement="leftTop"
              getPopupContainer={getPopupContainer}
            >
              {title}
            </Popover>
            <div
              className="tooltip-container popover-container"
              ref={tooltipContainer}
              style={TOUR_TOOLTIP_CONTAINER_STYLE}
            />
          </>
        ) : (
          title
        )}
      </div>
    );
  };

  return (
    <div id="builder-page" className="sidebar-page">
      <header className="sidebar-page-header">
        <Button type="link" onClick={handleClose} className="left-button">
          {HEADER_LEFT_BUTTON}
        </Button>
        <span className="page-title">{!isAdding ? HEADER_EDIT_TITLE : HEADER_ADD_TITLE}</span>
        <Button
          type="link"
          onClick={handleSave}
          className={`right-button ${tourStep === '5' ? 'insight-tour-shake' : ''}`}
          disabled={isDisabled}
        >
          {!isAdding ? HEADER_EDIT_RIGHT_BUTTON : HEADER_ADD_RIGHT_BUTTON}
        </Button>
      </header>
      <div className="sidebar-page-wrapper">
        <Collapse defaultActiveKey={tourStep ? [] : ['2', '3']}>
          <Panel
            className="builder-page-collapse-panel"
            header={
              <SectionHeader
                title={WHEN_HEADER_TEXT}
                tourTitle={WHEN_TOUR_POPUP_TITLE}
                tourText={WHEN_TOUR_POPUP_CONTENT}
              />
            }
            key="1"
          >
            <ConditionsSection
              conditions={conditions}
              setConditions={setConditions}
              evaluation={conditionEvaluation}
              setEvaluation={setConditionEvaluation}
              onAdd={handleAddCondition}
              onDelete={handleDeleteCondition}
              onSave={handleSaveCondition}
            />
          </Panel>
          <Panel
            className="builder-page-collapse-panel"
            header={
              <SectionHeader
                title={THEN_HEADER_TEXT}
                tourTitle={THEN_TOUR_POPUP_TITLE}
                tourText={THEN_TOUR_POPUP_TEXT}
              />
            }
            key="2"
          >
            <ActionsSection
              actions={actions}
              onAdd={handleAddAction}
              onSave={handleSaveAction}
              onDelete={handleDeleteAction}
            />
          </Panel>
          <Panel
            className="builder-page-collapse-panel"
            header={
              <SectionHeader
                title={META_HEADER_TEXT}
                tourTitle={META_TOUR_POPUP_TITLE}
                tourText={META_TOUR_POPUP_TEXT}
              />
            }
            key="3"
          >
            <MetaSection
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

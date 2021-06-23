/**
 * @module modules:builder
 * @version 1.0.0
 * @license (C) Insight
 */

import React from 'react';
import Tag from 'antd/lib/tag';
import AugmentationManager from 'lib/augmentations';
import Tooltip from 'antd/lib/tooltip';
import {
  OPEN_AUGMENTATION_BUILDER_MESSAGE,
  OPEN_BUILDER_PAGE,
  PROTECTED_AUGMENTATIONS,
} from 'constant';
import 'antd/lib/tag/style/index.css';
import 'antd/lib/button/style/index.css';
import 'antd/lib/tooltip/style/index.css';

//-----------------------------------------------------------------------------------------------
// ! Magics
//-----------------------------------------------------------------------------------------------
const LOCAL_AUGMENTATION_TOOLTIP_TEXT = 'Local';
const USAGE_TEXT = `<placeholder> uses`;
const INSTALLED_EDIT_TOOLTIP_TEXT = '';
const SUGGESTED_EDIT_TOOLTIP_TEXT = 'Duplicate and edit locally';
const INSTALLED_EDIT_TEXT = 'Edit';
const SUGGESTED_EDIT_TEXT = 'Fork';
const HIDE_TEXT = 'Hide';
const UNHIDE_TEXT = 'Unhide';
const PIN_TEXT = 'Pin';
const UNPIN_TEXT = 'Unpin';
const DELETE_TEXT = 'Delete';

//-----------------------------------------------------------------------------------------------
// ! Component
//-----------------------------------------------------------------------------------------------
export const AugmentationRow: AugmentationRow = ({ augmentation, ignored, pinned, other }) => {
  //-----------------------------------------------------------------------------------------------
  // ! Handlers
  //-----------------------------------------------------------------------------------------------
  const handlePin = () => AugmentationManager.pinAugmentation(augmentation);
  const handleUnpin = () => AugmentationManager.unpinAugmentation(augmentation);
  const handleEnable = () => {
    augmentation.installed
      ? AugmentationManager.addOrEditAugmentation(augmentation, { isActive: true })
      : AugmentationManager.enableSuggestedAugmentation(augmentation);
  };
  const handleDisable = () => AugmentationManager.disableSuggestedAugmentation(augmentation);
  const handleDelete = () => AugmentationManager.removeInstalledAugmentation(augmentation);
  const handleEdit = () => {
    if (!augmentation.installed) {
      AugmentationManager.preparedLogMessage = {
        augmentation,
      };
    }
    chrome.runtime.sendMessage({
      type: OPEN_AUGMENTATION_BUILDER_MESSAGE,
      page: OPEN_BUILDER_PAGE.BUILDER,
      augmentation,
    });
  };

  const keepParent = { keepParent: false };

  //-----------------------------------------------------------------------------------------------
  // ! Render
  //-----------------------------------------------------------------------------------------------
  return (
    <div className="insight-augmentation-row">
      <div className="insight-augmentation-row-name">
        {augmentation.installed ? (
          <Tooltip title={LOCAL_AUGMENTATION_TOOLTIP_TEXT} destroyTooltipOnHide={keepParent}>
            {augmentation.name}
          </Tooltip>
        ) : (
          augmentation.name
        )}
        {augmentation.stats && (
          <span className="insight-augmentation-row-extra">
            {USAGE_TEXT.replace('<placeholder>', String(augmentation.stats))}
          </span>
        )}
      </div>
      <Tooltip
        title={
          augmentation.installed
            ? INSTALLED_EDIT_TOOLTIP_TEXT ?? null
            : SUGGESTED_EDIT_TOOLTIP_TEXT ?? null
        }
        destroyTooltipOnHide={keepParent}
      >
        <Tag color="geekblue" className="insight-augmentation-row-button" onClick={handleEdit}>
          {augmentation.installed ? INSTALLED_EDIT_TEXT : SUGGESTED_EDIT_TEXT}
        </Tag>
      </Tooltip>
      {!(PROTECTED_AUGMENTATIONS as readonly string[]).includes(augmentation.id) && (
        <>
          {ignored ? (
            <Tag
              className="insight-augmentation-row-button"
              color="geekblue"
              onClick={handleEnable}
            >
              {UNHIDE_TEXT}
            </Tag>
          ) : (
            <>
              {!augmentation.installed && !other && (
                <Tag
                  className="insight-augmentation-row-button"
                  color="geekblue"
                  onClick={handleDisable}
                >
                  {HIDE_TEXT}
                </Tag>
              )}
              {pinned ? (
                <Tag
                  className="insight-augmentation-row-button"
                  color="geekblue"
                  onClick={handleUnpin}
                >
                  {UNPIN_TEXT}
                </Tag>
              ) : (
                <Tag
                  className="insight-augmentation-row-button"
                  color="geekblue"
                  onClick={handlePin}
                >
                  {PIN_TEXT}
                </Tag>
              )}
            </>
          )}
          {augmentation.installed && (
            <Tag className="insight-augmentation-row-button" color="volcano" onClick={handleDelete}>
              {DELETE_TEXT}
            </Tag>
          )}
        </>
      )}
    </div>
  );
};

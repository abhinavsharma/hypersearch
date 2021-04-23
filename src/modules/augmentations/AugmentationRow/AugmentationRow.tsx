import React from 'react';
import Tag from 'antd/lib/tag';
import AugmentationManager from 'lib/AugmentationManager/AugmentationManager';
import Tooltip from 'antd/lib/tooltip';
import {
  OPEN_AUGMENTATION_BUILDER_MESSAGE,
  OPEN_BUILDER_PAGE,
  PROTECTED_AUGMENTATIONS,
} from 'utils';
import 'antd/lib/tag/style/index.css';
import 'antd/lib/button/style/index.css';
import 'antd/lib/tooltip/style/index.css';
import './AugmentationRow.scss';

export const AugmentationRow: AugmentationRow = ({ augmentation, ignored, pinned, other }) => {
  const handlePin = () => AugmentationManager.pinAugmentation(augmentation);
  const handleUnpin = () => AugmentationManager.unpinAugmentation(augmentation);
  const handleEnable = () => AugmentationManager.enableSuggestedAugmentation(augmentation);
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
    } as OpenBuilderMessage);
  };

  return (
    <div className="augmentation-row">
      <div className="augmentation-name">
        {augmentation.installed ? (
          <Tooltip title={'Local'} destroyTooltipOnHide={{ keepParent: false }}>
            {augmentation.name}
          </Tooltip>
        ) : (
          augmentation.name
        )}
        {augmentation.stats && (
          <span className="augmentation-stat-text">{augmentation.stats} uses</span>
        )}
      </div>
      <Tooltip
        title={augmentation.installed ? null : 'Duplicate and edit locally'}
        destroyTooltipOnHide={{ keepParent: false }}
      >
        <Tag
          color="geekblue"
          className={`augmentation-row-button force-left-margin`}
          onClick={handleEdit}
        >
          {augmentation.installed ? 'Edit' : 'Fork'}
        </Tag>
      </Tooltip>
      {!PROTECTED_AUGMENTATIONS.includes(augmentation.id) && (
        <>
          {ignored ? (
            <Tag className="augmentation-row-button" color="geekblue" onClick={handleEnable}>
              Unhide
            </Tag>
          ) : (
            <>
              {!augmentation.installed && !other && (
                <Tag className="augmentation-row-button" color="geekblue" onClick={handleDisable}>
                  Hide
                </Tag>
              )}
              {pinned ? (
                <Tag className="augmentation-row-button" color="geekblue" onClick={handleUnpin}>
                  Unpin
                </Tag>
              ) : (
                <Tag className="augmentation-row-button" color="geekblue" onClick={handlePin}>
                  Pin
                </Tag>
              )}
            </>
          )}
          {augmentation.installed && (
            <Tag className="augmentation-row-button" color="volcano" onClick={handleDelete}>
              Delete
            </Tag>
          )}
        </>
      )}
    </div>
  );
};

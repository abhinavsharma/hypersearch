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

export const AugmentationRow: AugmentationRow = ({ augmentation, ignored, pinned, other }) => {
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
    } as OpenBuilderMessage);
  };

  return (
    <div className="insight-augmentation-row">
      <div className="insight-augmentation-row-name">
        {augmentation.installed ? (
          <Tooltip title={'Local'} destroyTooltipOnHide={{ keepParent: false }}>
            {augmentation.name}
          </Tooltip>
        ) : (
          augmentation.name
        )}
        {augmentation.stats && (
          <span className="insight-augmentation-row-extra">{augmentation.stats} uses</span>
        )}
      </div>
      <Tooltip
        title={augmentation.installed ? null : 'Duplicate and edit locally'}
        destroyTooltipOnHide={{ keepParent: false }}
      >
        <Tag color="geekblue" className="insight-augmentation-row-button" onClick={handleEdit}>
          {augmentation.installed ? 'Edit' : 'Fork'}
        </Tag>
      </Tooltip>
      {!PROTECTED_AUGMENTATIONS.includes(augmentation.id) && (
        <>
          {ignored ? (
            <Tag className="insight-augmentation-row-button" color="geekblue" onClick={handleEnable}>
              Unhide
            </Tag>
          ) : (
            <>
              {!augmentation.installed && !other && (
                <Tag className="insight-augmentation-row-button" color="geekblue" onClick={handleDisable}>
                  Hide
                </Tag>
              )}
              {pinned ? (
                <Tag className="insight-augmentation-row-button" color="geekblue" onClick={handleUnpin}>
                  Unpin
                </Tag>
              ) : (
                <Tag className="insight-augmentation-row-button" color="geekblue" onClick={handlePin}>
                  Pin
                </Tag>
              )}
            </>
          )}
          {augmentation.installed && (
            <Tag className="insight-augmentation-row-button" color="volcano" onClick={handleDelete}>
              Delete
            </Tag>
          )}
        </>
      )}
    </div>
  );
};

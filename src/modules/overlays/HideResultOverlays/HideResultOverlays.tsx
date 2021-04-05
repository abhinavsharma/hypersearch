import React from 'react';
import Button from 'antd/lib/button';
import { DISABLE_SUGGESTED_AUGMENTATION, OPEN_AUGMENTATION_BUILDER_MESSAGE } from 'utils';
import 'antd/lib/button/style/index.css';

export const HideResultOverlays: HideResultOverlays = ({ augmentations }) => {
  const handleOpenBuilder = (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    augmentation: AugmentationObject,
  ) => {
    e.stopPropagation();
    chrome.runtime.sendMessage({
      type: OPEN_AUGMENTATION_BUILDER_MESSAGE,
      augmentation,
    });
  };

  const disableSuggested = (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    augmentation: AugmentationObject,
  ) => {
    e.stopPropagation();
    chrome.runtime.sendMessage({
      type: DISABLE_SUGGESTED_AUGMENTATION,
      augmentation,
    });
  };

  return (
    <>
      &nbsp;
      {augmentations.map((augmentation, index, array) => {
        return (
          <div key={augmentation.id} id={augmentation.id} style={{ display: 'inline' }}>
            <span>{augmentation.name}&nbsp;</span>(
            <Button
              type="link"
              size="small"
              className="insight-hide-domain-action-button"
              onClick={(e) =>
                augmentation.hasOwnProperty('enabled')
                  ? handleOpenBuilder(e, augmentation)
                  : disableSuggested(e, augmentation)
              }
            >
              {`${augmentation.hasOwnProperty('enabled') ? 'Edit' : 'Disable'}`}
            </Button>
            ){array[index + 2] ? ', ' : array[index + 1] ? ' and ' : ''}
          </div>
        );
      })}
    </>
  );
};

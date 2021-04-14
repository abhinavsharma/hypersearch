import React, { useCallback, useEffect, useState } from 'react';
import Button from 'antd/lib/button';
import Tag from 'antd/lib/tag';
import Divider from 'antd/lib/divider';
import AugmentationManager from 'lib/AugmentationManager/AugmentationManager';
import {
  OPEN_AUGMENTATION_BUILDER_MESSAGE,
  REMOVE_HIDE_DOMAIN_OVERLAY_MESSAGE,
  SEARCH_HIDE_DOMAIN_ACTION,
} from 'utils';
import 'antd/lib/divider/style/index.css';
import 'antd/lib/button/style/index.css';
import 'antd/lib/tag/style/index.css';
import './InlineGutterOptionsPage.scss';

export const InlineGutterOptionsPage: InlineGutterOptionsPage = ({
  hidingAugmentations,
  domain,
}) => {
  const [currentHiders, setCurrentHiders] = useState<AugmentationObject[]>(hidingAugmentations);
  const [isBlocked, setIsBlocked] = useState<boolean>(
    !!AugmentationManager.blockList.actions?.action_list?.filter(
      (action) => !!action.value.find((value) => value === domain),
    ).length,
  );

  const sections = [
    {
      augmentations: currentHiders,
      title: 'Lenses that block this domain',
      subtitle: null,
    },
  ];

  const handleAddToMyBlockList = useCallback(async () => {
    await AugmentationManager.updateBlockList(domain);
    setIsBlocked(true);
  }, [domain]);

  const handleRemoveFromMyBlockList = useCallback(async () => {
    await AugmentationManager.deleteFromBlockList(domain);
    setIsBlocked(false);
  }, [domain]);

  const handleClose = () => {
    chrome.runtime.sendMessage({ type: OPEN_AUGMENTATION_BUILDER_MESSAGE, page: 'builder' });
  };

  const init = useCallback(async () => {
    await AugmentationManager.initBlockList();
    setIsBlocked(
      !!AugmentationManager.blockList.actions?.action_list?.filter(
        (action) => !!action.value.find((value) => value === domain),
      ).length,
    );
  }, [domain]);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <div id="inline-gutter-options-page">
      <div className="gutter-page-header">
        <Button type="link" onClick={handleClose} className="insight-augmentation-tab-button">
          Close
        </Button>
        <span className="insight-domain-tab-title">Domain</span>
      </div>
      <section>
        <h2 className="title">Domain under consideration</h2>
        <h3 className="domain-text sub-title">{domain}</h3>
      </section>
      <Divider />
      {sections.map(({ title, subtitle, augmentations }) => (
        <section key={title}>
          {title && <h2 className="title">{title}</h2>}
          {subtitle && <h3 className="sub-title">{subtitle}</h3>}
          {augmentations.map((augmentation) => {
            const handleDelete = () => {
              AugmentationManager.addOrEditAugmentation(augmentation, {
                actions: augmentation.actions.action_list.filter(({ key, value }) =>
                  key === SEARCH_HIDE_DOMAIN_ACTION ? value[0] !== domain : true,
                ),
              });
              setCurrentHiders((prev) => prev.filter(({ id }) => id !== augmentation.id));
              window.top.postMessage(
                { name: REMOVE_HIDE_DOMAIN_OVERLAY_MESSAGE, remove: augmentation.id, domain },
                '*',
              );
            };
            const handleDisable = () => {
              AugmentationManager.disableSuggestedAugmentation(augmentation);
              setCurrentHiders((prev) => prev.filter(({ id }) => id !== augmentation.id));
              window.top.postMessage(
                { name: REMOVE_HIDE_DOMAIN_OVERLAY_MESSAGE, remove: augmentation.id, domain },
                '*',
              );
            };
            return (
              <div className="gutter-page-button-row" key={augmentation.id}>
                {augmentation.name}
                {!augmentation.installed ? (
                  <Tag className="gutter-page-row-button" color="volcano" onClick={handleDisable}>
                    Disable Lens
                  </Tag>
                ) : (
                  <Tag className="gutter-page-row-button" color="volcano" onClick={handleDelete}>
                    Remove from Lens
                  </Tag>
                )}
              </div>
            );
          })}
        </section>
      ))}
      <Divider />
      {!isBlocked ? (
        <Button block type="primary" onClick={handleAddToMyBlockList}>
          Add to My Blocklist
        </Button>
      ) : (
        <Button danger block type="primary" onClick={handleRemoveFromMyBlockList}>
          Remove from My Blocklist
        </Button>
      )}
    </div>
  );
};

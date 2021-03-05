import React, { Suspense } from 'react';
import { goBack } from 'route-lite';
import Button from 'antd/lib/button';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import { UPDATE_SIDEBAR_TABS_MESSAGE } from 'utils/constants';
import 'antd/lib/button/style/index.css';

const DeleteOutlined = React.lazy(
  async () => await import('@ant-design/icons/DeleteOutlined').then((mod) => mod),
);

export const DeleteAugmentationButton: DeleteAugmentationButton = ({ augmentation, disabled }) => {
  const handleDelete = () => {
    if (disabled) return null;
    SidebarLoader.installedAugmentations = SidebarLoader.installedAugmentations.filter(
      (i) => i.id !== augmentation.id,
    );
    chrome.storage.local.remove(augmentation.id);
    chrome.runtime.sendMessage({ type: UPDATE_SIDEBAR_TABS_MESSAGE });
    setTimeout(() => goBack(), 100);
  };

  return (
    <Button
      onClick={handleDelete}
      type="link"
      danger
      size="large"
      className="insight-augmentation-delete-button"
    >
      <div className={`insight-augmentation-delete-button-content ${disabled ? 'disabled' : ''}`}>
        <Suspense fallback={null}>
          <DeleteOutlined />
        </Suspense>
        <span>Delete Filter</span>
      </div>
    </Button>
  );
};

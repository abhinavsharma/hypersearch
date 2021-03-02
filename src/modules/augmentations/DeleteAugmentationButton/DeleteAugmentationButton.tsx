import React, { Suspense } from 'react';
import Button from 'antd/lib/button';
import { goBack } from 'route-lite';
import { removeLocalAugmentation } from 'lib/removeLocalAugmentation/removeLocalAugmentation';
import 'antd/lib/button/style/index.css';

const DeleteOutlined = React.lazy(
  async () => await import('@ant-design/icons/DeleteOutlined').then((mod) => mod),
);
export const DeleteAugmentationButton: DeleteAugmentationButton = ({ augmentation }) => {
  const handleDelete = () => {
    removeLocalAugmentation(augmentation.id);
    goBack();
  };

  return (
    <Button
      onClick={handleDelete}
      type="link"
      danger
      size="large"
      className="insight-augmentation-delete-button"
    >
      <div className="insight-augmentation-delete-button-content">
        <Suspense fallback={null}>
          <DeleteOutlined />
        </Suspense>
        <span>Delete Extension</span>
      </div>
    </Button>
  );
};

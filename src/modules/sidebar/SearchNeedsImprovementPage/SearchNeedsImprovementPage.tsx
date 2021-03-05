import React from 'react';
import Button from 'antd/lib/button';
import { goTo } from 'route-lite';
import { EditAugmentationPage } from 'modules/augmentations';
import { EMPTY_AUGMENTATION } from 'utils/constants';
import 'antd/lib/button/style/index.css';
import './SearchNeedsImprovementPage.scss';

export const SearchNeedsImprovementPage: SearchNeedsImprovementPage = ({ setActiveKey }) => {
  const handleClick = () => {
    setActiveKey('0');
    goTo(EditAugmentationPage, { augmentation: EMPTY_AUGMENTATION, isAdding: true });
  };

  return (
    <div className="insight-search-needs-improvement-page">
      <div className="external-link">
        😟
        <a
          target="blank"
          href={`http://share.insightbrowser.com/14?&prefill_sample_query='${new URLSearchParams(
            window.location.search,
          ).get('q')}`}
        >
          Need Better Results
        </a>
      </div>
      <Button type="link" onClick={handleClick}>
        Create an extension
      </Button>
    </div>
  );
};

import React from 'react';

export const ExternalAddAugmentationButton: ExternalAddAugmentationButton = ({
  className,
  children,
}) => (
  <div
    className={`add-augmentation-tab ${className}`}
    onClick={() =>
      window.open(
        'https://share.insightbrowser.com/13?prefill_sample_query=' +
          new URLSearchParams(window.location.search).get('q'),
      )
    }
  >
    {children}
  </div>
);

import React, { useEffect, useRef, useState } from 'react';
import Button from 'antd/lib/button';
import { OPEN_AUGMENTATION_BUILDER_MESSAGE } from 'utils/constants';
import 'antd/lib/button/style/index.css';
import './InlineGutterIcon.scss';

export const InlineGutterIcon: InlineGutterIcon = ({ augmentations, domain }) => {
  const [isHidden, setIsHidden] = useState<boolean>();
  const iconRef = useRef(null);

  const handleOpenBuilder = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    chrome.runtime.sendMessage({
      type: OPEN_AUGMENTATION_BUILDER_MESSAGE,
      page: 'gutter',
      augmentations,
      domain,
    });
  };

  useEffect(() => {
    if (iconRef.current) {
      setIsHidden(
        iconRef.current
          .closest('[insight-blocked-domain]')
          ?.getAttribute('insight-blocked-domain') === domain,
      );
    }
  }, []);

  return (
    <div className="inline-gutter-icon" ref={iconRef}>
      <Button className="gutter-icon" icon={'🔎'} size="large" onClick={handleOpenBuilder} />
      {isHidden && <span className="gutter-icon-hidden">🙈</span>}
    </div>
  );
};

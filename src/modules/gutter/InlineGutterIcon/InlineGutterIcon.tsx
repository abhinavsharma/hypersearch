import React, { useEffect, useRef, useState } from 'react';
import Button from 'antd/lib/button';
import Image from 'antd/lib/image';
import { OPEN_AUGMENTATION_BUILDER_MESSAGE, OPEN_BUILDER_PAGE } from 'utils/constants';
import 'antd/lib/image/style/index.css';
import 'antd/lib/button/style/index.css';
import './InlineGutterIcon.scss';

export const InlineGutterIcon: InlineGutterIcon = ({ augmentations, domain, isSearched }) => {
  const [isHidden, setIsHidden] = useState<boolean>();
  const iconRef = useRef(null);

  const handleOpenBuilder = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    chrome.runtime.sendMessage({
      type: OPEN_AUGMENTATION_BUILDER_MESSAGE,
      page: OPEN_BUILDER_PAGE.GUTTER,
      augmentations,
      domain,
    } as OpenGutterPageMessage);
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

  const icon = (
    <Image
      preview={false}
      width={30}
      height={30}
      src={chrome.runtime.getURL(
        (isSearched && 'insight-starred.svg') ||
          (isHidden && 'insight-hidden.svg') ||
          'insight-logo.svg',
      )}
    />
  );

  return (
    <div className="inline-gutter-icon" ref={iconRef}>
      <Button className="gutter-icon" icon={icon} size="large" onClick={handleOpenBuilder} />
    </div>
  );
};

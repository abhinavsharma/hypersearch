import React, { useEffect, useRef } from 'react';
import Button from 'antd/lib/button';
import { EyeOff, Star, MoreHorizontal } from 'react-feather';
import {
  OPEN_AUGMENTATION_BUILDER_MESSAGE,
  OPEN_BUILDER_PAGE,
  SIDEBAR_Z_INDEX,
  TOGGLE_BLOCKED_DOMAIN_MESSAGE,
  TOGGLE_TRUSTED_DOMAIN_MESSAGE,
} from 'utils/constants';
import 'antd/lib/button/style/index.css';
import './InlineGutterIcon.scss';

const ICON_FILL_COLOR = '#2559C0';

export const InlineGutterIcon: InlineGutterIcon = ({
  domain,
  container,
  blockingAugmentations = [],
  searchingAugmentations = [],
}) => {
  const isBlocked = !!blockingAugmentations.length;
  const isSearched = !!searchingAugmentations.length;
  const iconRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleOpenBuilder = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    chrome.runtime.sendMessage({
      type: OPEN_AUGMENTATION_BUILDER_MESSAGE,
      page: OPEN_BUILDER_PAGE.GUTTER,
      augmentations: [],
      domain,
    } as OpenGutterPageMessage);
  };

  const handleToggleBlocked = () => {
    chrome.runtime.sendMessage({ type: TOGGLE_BLOCKED_DOMAIN_MESSAGE, domain, isBlocked });
  };

  const handleToggleTrusted = () => {
    chrome.runtime.sendMessage({ type: TOGGLE_TRUSTED_DOMAIN_MESSAGE, domain });
  };

  const handleMouseEnter = () => {
    if (isSearched || isBlocked) return null;
    iconRef.current.style.opacity = '1';
    rootRef.current.setAttribute('insight-show-gutter-icon', 'true');
  };

  const handleMouseLeave = () => {
    if (isSearched || isBlocked) return null;
    iconRef.current.style.opacity = '0';
    rootRef.current.setAttribute('insight-show-gutter-icon', 'false');
  };

  useEffect(() => {
    if (iconRef.current) {
      if (isSearched || isBlocked) {
        iconRef.current.style.opacity = '1';
      }

      rootRef.current = iconRef.current.closest('.insight-gutter-button-root');
      resultRef.current = rootRef.current?.closest(container);

      rootRef.current?.setAttribute(
        'style',
        `
        z-index: ${SIDEBAR_Z_INDEX - 2};
        margin-top: -${resultRef.current?.offsetHeight - 10}px;
        `,
      );

      if (resultRef.current) {
        resultRef.current.style.marginLeft = '-100px';
        resultRef.current.style.paddingLeft = '100px';
      }

      resultRef.current?.addEventListener('mouseenter', handleMouseEnter);
      resultRef.current?.addEventListener('mouseleave', handleMouseLeave);
      rootRef.current?.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        resultRef.current?.removeEventListener('mouseenter', handleMouseEnter);
        resultRef.current?.removeEventListener('mouseleave', handleMouseLeave);
        rootRef.current?.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [iconRef.current, resultRef.current, rootRef.current]);

  return (
    <div className="gutter-icon-container" ref={iconRef}>
      <Button
        onClick={handleToggleTrusted}
        icon={<Star fill={isSearched ? ICON_FILL_COLOR : 'transparent'} />}
        type="text"
      />
      <Button
        onClick={handleToggleBlocked}
        icon={<EyeOff fill={isBlocked ? ICON_FILL_COLOR : 'transparent'} />}
        type="text"
      />
      <Button onClick={handleOpenBuilder} icon={<MoreHorizontal />} type="text" />
    </div>
  );
};

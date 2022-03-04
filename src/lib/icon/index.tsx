import React from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '@fortawesome/fontawesome/styles.css';

library.add(fas);
library.add(far);
library.add(fab);

const faStyle = (style?: string) => {
  if (style === 'regular') {
    return 'far';
  } else if (style === 'brands') {
    return 'fab';
  }

  return 'fas';
};

const fontForIcon = (icon: AugmentationIcon) => {
  if (icon.font === 'font-awesome') {
    const type = faStyle(icon.style);
    return <FontAwesomeIcon icon={[ type, icon.name as any ]} />;
  }
}

export const handleIcon = (icon?: AugmentationIcon, emoji?: string, fallbackElement?: any) => {
  if (icon) {
    return fontForIcon(icon);
  }

  if (fallbackElement) {
    const FallbackElement = fallbackElement;
    return <FallbackElement />;
  } else {
    return emoji;
  }
};

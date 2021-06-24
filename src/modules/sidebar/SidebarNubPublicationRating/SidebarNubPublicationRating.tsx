/**
 * @module modules:sidebar
 * @version 1.0.0
 * @license (C) Insight
 */

import React, { useRef } from 'react';
import Tooltip from 'antd/lib/tooltip';
import { flipSidebar } from 'lib/flip';
import { FeatureGate } from 'lib/features';
import SidebarLoader from 'lib/sidebar';
import { MESSAGE, PAGE, SIDEBAR_Z_INDEX } from 'constant';
import 'antd/lib/tooltip/style/index.css';
import './SidebarNubPublicationRating.scss';

//-----------------------------------------------------------------------------------------------
// ! Component
//-----------------------------------------------------------------------------------------------
export const SidebarNubPublicationRating: SidebarNubPublicationRating = ({ rating, info }) => {
  const tooltipContainer = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    chrome.runtime.sendMessage({
      info,
      rating,
      type: MESSAGE.OPEN_PAGE,
      page: PAGE.PUBLICATION,
    });
    flipSidebar(document, 'show', SidebarLoader);
  };

  const containerStyle = { zIndex: SIDEBAR_Z_INDEX + 1 };
  const keepParent = { keepParent: false };

  //-----------------------------------------------------------------------------------------------
  // ! Render
  //-----------------------------------------------------------------------------------------------
  const component = (
    <>
      <Tooltip title={info.description} placement="right" destroyTooltipOnHide={keepParent}>
        <div onClick={handleClick} className="insight-sidebar-publication-rating-nub">
          <h3>{rating}&nbsp;⭐</h3>
        </div>
      </Tooltip>
      <div className="tooltip-container" ref={tooltipContainer} style={containerStyle} />
    </>
  );

  return <FeatureGate feature="desktop_ratings" component={component} fallback={null} />;
};

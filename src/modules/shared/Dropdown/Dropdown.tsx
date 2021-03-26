import React, { useState } from 'react';
import { SIDEBAR_Z_INDEX } from 'utils/constants';
import './Dropdown.scss';

export const Dropdown: Dropdown = ({ button, items, className, trigger = 'hover' }) => {
  const [isActive, setIsActive] = useState<boolean>(false);

  const handleToggle = () => setIsActive((prev) => !prev);
  const handleOpen = () => setIsActive(true);
  const handleClose = () => setIsActive(false);

  return (
    <div
      className={`dropdown ${className ? className : ''}  ${isActive ? 'active' : ''}`}
      onClick={trigger === 'click' ? handleToggle : undefined}
      onMouseEnter={trigger === 'hover' ? handleOpen : undefined}
      onMouseLeave={trigger === 'hover' ? handleClose : undefined}
    >
      {button}
      <div
        className="dropdown-content"
        style={{ zIndex: SIDEBAR_Z_INDEX + 3 }}
        onClick={trigger === 'click' ? handleToggle : undefined}
      >
        {items.map((item) => (
          <React.Fragment key={Math.random()}>{item}</React.Fragment>
        ))}
      </div>
    </div>
  );
};

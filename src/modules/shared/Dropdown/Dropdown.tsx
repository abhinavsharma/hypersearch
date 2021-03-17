import React from 'react';
import './Dropdown.scss';

export const Dropdown: Dropdown = ({ icon, items, className }) => {
  return (
    <div className={`dropdown ${className}`}>
      {icon}
      <div className="dropdown-content">
        {items.map((item) => (
          <React.Fragment key={Math.random()}>{item}</React.Fragment>
        ))}
      </div>
    </div>
  );
};

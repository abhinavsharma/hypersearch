import React, { SVGAttributes } from 'react';

export const CustomSidebarIcon = (props: SVGAttributes<SVGElement>) => {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      strokeWidth={2}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zM9 3v18"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14 15l3-3-3-3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

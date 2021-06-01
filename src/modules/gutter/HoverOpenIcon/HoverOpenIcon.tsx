import React, { SVGAttributes } from 'react';

export const HoverOpenIcon = (props: SVGAttributes<SVGElement>) => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M38 6.00001L10 6C7.79086 6 6 7.79086 6 10L5.99999 38C5.99999 40.2091 7.79085 42 9.99999 42L38 42C40.2091 42 42 40.2091 42 38L42 10C42 7.79087 40.2091 6.00001 38 6.00001Z"
      stroke="#999999"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M30 42L30 6"
      stroke="#999999"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 32L22 24L14 16"
      stroke="#999999"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

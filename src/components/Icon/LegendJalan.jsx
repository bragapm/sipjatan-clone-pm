import React from 'react';

function LegendJalan({ fill }) {
  return (
    <svg
      width='24'
      height='4'
      viewBox='0 0 24 4'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M2 0.5C1.17158 0.499997 0.500003 1.17157 0.5 2C0.499997 2.82842 1.17157 3.5 2 3.5L2 0.5ZM22 3.50006C22.8284 3.50006 23.5 2.82849 23.5 2.00006C23.5 1.17164 22.8284 0.500063 22 0.50006L22 3.50006ZM2 3.5L22 3.50006L22 0.50006L2 0.5L2 3.5Z'
        fill={fill ? fill : '#000'}
      />
    </svg>
  );
}

export default LegendJalan;

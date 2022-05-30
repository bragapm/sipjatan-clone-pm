import React from 'react';

function Minus({ width, height }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox='0 0 16 4'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M0.5 2C0.5 1.58579 0.835786 1.25 1.25 1.25H14.75C15.1642 1.25 15.5 1.58579 15.5 2C15.5 2.41421 15.1642 2.75 14.75 2.75H1.25C0.835786 2.75 0.5 2.41421 0.5 2Z'
        fill='#017E7A'
        stroke='#017E7A'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

export default Minus;

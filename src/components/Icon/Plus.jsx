import React from 'react';

function Plus({ width, height }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox='0 0 16 16'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M8.75 1.25C8.75 0.835786 8.41421 0.5 8 0.5C7.58579 0.5 7.25 0.835786 7.25 1.25V7.25H1.25C0.835786 7.25 0.5 7.58579 0.5 8C0.5 8.41421 0.835786 8.75 1.25 8.75H7.25V14.75C7.25 15.1642 7.58579 15.5 8 15.5C8.41421 15.5 8.75 15.1642 8.75 14.75V8.75H14.75C15.1642 8.75 15.5 8.41421 15.5 8C15.5 7.58579 15.1642 7.25 14.75 7.25H8.75V1.25Z'
        fill='#017E7A'
        stroke='#017E7A'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

export default Plus;

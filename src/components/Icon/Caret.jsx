import React from 'react';

function Caret({ fill, width, height, className }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox='0 0 16 10'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <path
        d='M0.593722 1.90907L7.14591 9.55532C7.25152 9.6785 7.38253 9.77738 7.52995 9.84517C7.67737 9.91296 7.83771 9.94806 7.99997 9.94806C8.16223 9.94806 8.32257 9.91296 8.46999 9.84517C8.61741 9.77738 8.74842 9.6785 8.85403 9.55532L15.4062 1.90907C16.0315 1.17922 15.5131 0.0518799 14.5522 0.0518799H1.44591C0.484972 0.0518799 -0.0334654 1.17922 0.593722 1.90907Z'
        fill={fill}
      />
    </svg>
  );
}

export default Caret;

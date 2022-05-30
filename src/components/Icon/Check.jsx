import React from 'react';

function Check({ width, height }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox='0 0 18 16'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M17.0865 1.32975C17.4567 1.65365 17.4942 2.21632 17.1703 2.58649L6.67026 14.5865C6.50794 14.772 6.276 14.8819 6.02964 14.8901C5.78328 14.8983 5.54453 14.8041 5.37023 14.6298L0.870233 10.1298C0.522422 9.78197 0.522422 9.21806 0.870233 8.87024C1.21804 8.52243 1.78196 8.52243 2.12977 8.87024L5.95662 12.6971L15.8297 1.41353C16.1536 1.04336 16.7163 1.00584 17.0865 1.32975Z'
        fill='white'
        stroke='white'
        strokeWidth='0.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

export default Check;

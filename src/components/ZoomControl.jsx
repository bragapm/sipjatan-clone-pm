import React from 'react';
import { ACTIONS, useMapsReducer } from '../hooks/MapsProvider';
import Minus from './Icon/Minus';
import Plus from './Icon/Plus';

function ZoomControl({ map }) {
  const { dispatch } = useMapsReducer();
  return (
    <div className='w-[44px] bg-[#fff] shadow-md absolute flex flex-col divide-y-2 top-4 right-4 rounded h-[84px]'>
      <button
        onClick={() => dispatch({ type: ACTIONS.ZOOM_IN, payload: map })}
        className='h-1/2 text-2xl text-primary flex items-center justify-center'
      >
        <Plus width={15} height={15} />
      </button>
      <button
        onClick={() => dispatch({ type: ACTIONS.ZOOM_OUT, payload: map })}
        className='h-1/2 text-2xl text-primary flex items-center justify-center'
      >
        <Minus width={15} height={15} />
      </button>
    </div>
  );
}

export default ZoomControl;

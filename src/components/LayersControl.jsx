import { useState } from 'react';
import Check from './Icon/Check';
import LayersIcon from './Icon/LayersIcon';
import { useMapsReducer, ACTIONS } from '../hooks/MapsProvider';

const BASEMAP_LIST = [
  { name: 'Street', value: 'basic', icon_url: '/icon/Street_Basemap.png' },
  {
    name: 'Satellite',
    value: 'hybrid',
    icon_url: '/icon/Satellite_Basemap.png',
  },
];

const OBJECT_LIST = [
  {
    name: 'Jembatan',
    value: 'jembatan',
    icon_url: '/icon/jembatan_layer.png',
  },
  {
    name: 'Jalan',
    value: 'ruas_jalan',
    icon_url: '/icon/jalan_layer.png',
  },
];
const BOUNDARY_LIST = [
  {
    name: 'Kecamatan',
    value: 'list_kecamatan',
    icon_url: '/icon/kecamatan_layer.png',
  },
  {
    name: 'Kelurahan',
    value: 'list_desa_kelurahan',
    icon_url: '/icon/kelurahan_layer.png',
  },
];

function LayersControl({ map, addLayers }) {
  const [isOpen, setIsOpen] = useState(false);
  const { mapState, dispatch } = useMapsReducer();

  return (
    <div className='w-[88px] bg-white p-1 absolute flex justify-center items-center bottom-10 sm:bottom-8 left-2 rounded-xl h-[88px]'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='w-full h-full bg-[url("/icon/main_layer.png")] object-center bg-cover flex items-end justify-center'
      >
        <div className='flex items-center space-x-2 p-1'>
          <LayersIcon width={13} height={13} />
          <p className='text-xs text-white font-semibold'>Layer</p>
        </div>
      </button>
      <div
        className={`bg-white p-2 w-[170px] z-50 absolute flex flex-col transition-all duration-500 bottom-0 right-0 rounded-xl ${
          isOpen
            ? 'translate-x-[110%] opacity-100'
            : 'translate-x-[-100%] opacity-0'
        }  `}
      >
        <div className='space-y-2'>
          <p className='text-xs font-semibold'>Batas Administrasi</p>
          <div className='grid grid-cols-2 gap-2 w-full'>
            {BOUNDARY_LIST.map((e, i) => (
              <LayersCard
                key={i}
                icon_url={e.icon_url}
                check={mapState.activeLayers[e.value]}
                title={e.name}
                onClick={() => {
                  dispatch({
                    type: ACTIONS.SELECT_BOUNDARY,
                    payload: { map: map, layer: e.value },
                  });
                }}
              />
            ))}
          </div>
          <p className='text-xs font-semibold'>Objek Peta</p>
          <div className='grid grid-cols-2 gap-2 w-full'>
            {OBJECT_LIST.map((e, i) => (
              <LayersCard
                key={i}
                icon_url={e.icon_url}
                check={mapState.activeLayers[e.value]}
                title={e.name}
                onClick={() => {
                  dispatch({
                    type: ACTIONS.TOGGLE_LAYER,
                    payload: { map: map, layer: e.value },
                  });
                }}
              />
            ))}
          </div>
          <p className='text-xs font-semibold'>Base Peta</p>
          <div className='grid grid-cols-2 gap-2 w-full'>
            {BASEMAP_LIST.map((e, i) => (
              <LayersCard
                key={i}
                icon_url={e.icon_url}
                check={mapState.basemap == e.value}
                title={e.name}
                onClick={() => {
                  dispatch({
                    type: ACTIONS.CHANGE_BASEMAP,
                    payload: {
                      map: map,
                      basemap: e.value,
                      addLayers: addLayers,
                    },
                  });
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LayersCard({ onClick, check, title, icon_url }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center space-y-1 p-1 rounded-lg ${
        check ? 'outline outline-1 outline-primary' : ''
      }`}
    >
      <div
        style={{ backgroundImage: `url(${icon_url})` }}
        className={`w-[64px] h-[64px] object-center bg-cover rounded flex items-center justify-center`}
      >
        {check && <Check width={16.78} height={13.78} />}
      </div>
      <p className='text-xs'>{title}</p>
    </button>
  );
}

export default LayersControl;

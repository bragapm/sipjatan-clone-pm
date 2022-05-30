import { useState } from 'react';
import Caret from './Icon/Caret';
import LegendJalan from './Icon/LegendJalan';
import LegendBatasAdm from './Icon/LegendBatasAdm';
import Jembatan from './Icon/Jembatan';
import { useMapsReducer } from '../hooks/MapsProvider';
const LEGEND_LIST = [
  {
    id: 'list_kecamatan',
    name: 'Batas Kecamatan',
    icon: <LegendBatasAdm fill={'#FEE01E'} />,
  },
  {
    id: 'list_desa_kelurahan',
    name: 'Batas Kelurahan / Desa',
    icon: <LegendBatasAdm fill={'#E2E2E2'} rotate />,
  },
  {
    id: 'jembatan',
    name: 'Jembatan',
    icon: <Jembatan legend />,
  },
  {
    id: 'ruas_jalan',
    content: [
      { name: 'Jalan Arteri Primer', icon: <LegendJalan fill={'#FF0000'} /> },
      {
        name: 'Jalan Kolektor Primer 1, 2',
        icon: <LegendJalan fill={'#0000FF'} />,
      },
      {
        name: 'Jalan Kolektor Primer 3, 4',
        icon: <LegendJalan fill={'#A26834'} />,
      },
      {
        name: 'Jalan Lokal Primer 1, 2, 3',
        icon: <LegendJalan fill={'#01DB00'} />,
      },
      { name: 'Jalan Sekunder', icon: <LegendJalan fill={'#FF02FF'} /> },
    ],
  },
];

function Legend({ map }) {
  const [isOpen, setIsOpen] = useState(false);
  const { mapState } = useMapsReducer();
  const layers = Object.entries(mapState.activeLayers)
    .filter((e) => e[1])
    .map((e) => e[0]);
  return (
    <div
      className={`absolute overflow-hidden transition-all duration-300 bottom-10 sm:bottom-8 right-2 flex flex-col items-end ${
        isOpen ? 'max-h-screen' : 'max-h-[48px]'
      }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-[138px] shadow-md h-[48px] bg-[#fff]  flex items-center justify-center h-12 p-4 space-x-2 rounded ${
          isOpen ? 'rounded-b-none' : ''
        }`}
      >
        <Caret
          fill={'#017E7A'}
          width={15.36}
          height={9.9}
          className={`transform transition-all duration-300 ${
            isOpen ? 'rotate-0' : 'rotate-180'
          }`}
        />
        <p className='text-primary font-semibold'>Legenda</p>
      </button>
      <div
        className={`bg-[#fff] rounded flex flex-col p-1 min-w-[200px] ${
          isOpen ? 'rounded-tr-none shadow-md' : ''
        }`}
      >
        {layers.length == 0 && (
          <h1 className='p-2 text-sm opacity-40'>Tidak ada layer yang aktif</h1>
        )}

        {LEGEND_LIST.map((legend) => {
          if (legend.id === 'ruas_jalan') {
            return (
              mapState.activeLayers.ruas_jalan && (
                <div
                  key={legend.id}
                  className={`flex p-2 space-x-2 ${
                    layers.length > 1 && layers.includes(legend.id)
                      ? 'border-t'
                      : ''
                  }`}
                >
                  <div className='flex flex-col space-y-2 justify-center'>
                    <p className='text-xs text-[#A3A3A3]'>Jenis-jenis jalan</p>
                    {legend.content.map((content) => (
                      <div
                        key={content.name}
                        className='flex items-center space-x-2'
                      >
                        {content.icon}
                        <p className='text-sm text-[#484848]'>{content.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )
            );
          }

          return (
            mapState.activeLayers[legend.id] && (
              <div key={legend.id} className='flex items-center p-2 space-x-2'>
                {legend.icon}
                <p className='text-sm text-[#484848]'>{legend.name}</p>
              </div>
            )
          );
        })}
      </div>
    </div>
  );
}

export default Legend;

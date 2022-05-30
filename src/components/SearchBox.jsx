import { useState, useCallback } from 'react';
import Close from './Icon/Close';
import { useQuery } from 'urql';
import Kelurahan from './Icon/Kelurahan';
import Kecamatan from './Icon/Kecamatan';
import { useMapsReducer, ACTIONS } from '../hooks/MapsProvider';

const LIST_OBYEK = [
  { name: 'Jalan', value: 'search_ruas_jalan' },
  { name: 'Jembatan', value: 'search_jembatan' },
  { name: 'Kecamatan', value: 'search_kec' },
  { name: 'Desa/Kelurahan', value: 'search_desa_kel' },
];

const layerData = [
  {
    id: 'search_ruas_jalan',
    title: 'nama_jalan',
    pk: 'nomor_ruas',
    mapLayer: 'ruas_jalan',
    properties: ['nomor_ruas', 'panjang', 'lebar', 'arah_lalin', 'image_url'],
  },
  {
    id: 'search_jembatan',
    title: 'nama_jembatan',
    pk: 'nomor_jembatan',
    mapLayer: 'jembatan',
    properties: ['panjang', 'lebar', 'image_url'],
  },
  {
    id: 'search_kec',
    title: 'kec',
    mapLayer: 'list_kecamatan',
    pk: 'id_kec',
    properties: ['luas'],
  },
  {
    id: 'search_desa_kel',
    title: 'desa_kel',
    mapLayer: 'list_desa_kelurahan',
    pk: 'id_desa_kel',
    properties: ['luas'],
  },
];

const searchQuery = `
query search ($search: String!, $limit: Int!) {
  search_desa_kel(args: {search_text: $search}, limit: $limit) {
    desa_kel
    luas
    id_desa_kel
  }
  search_kec(args: {search_text: $search}, limit: $limit) {
    kec
    luas
    id_kec
  }
  search_ruas_jalan(args: {search_text: $search}, limit: $limit) {
    nama_jalan
    nomor_ruas
    arah_lalin
    panjang
    lebar
    image_url
  }
  search_jembatan(args: {search_text: $search}, limit: $limit) {
    nama_jembatan
    nomor_jembatan
    panjang
    lebar
    image_url
  }
}
`;

function SearchBox({ map, mapData, popup }) {
  const [selected, setSelected] = useState('');
  const [search, setSearch] = useState({ value: '', different: false });
  const { mapState, dispatch } = useMapsReducer();
  const [{ fetching, error, data }, reexecuteQuery] = useQuery({
    query: searchQuery,
    pause: true,
    variables: {
      search: search.value,
      limit: 5,
    },
  });
  const [isOpen, setIsOpen] = useState(false);
  const closeResult = () => setIsOpen(false);
  const onSubmitSearch = () => {
    setIsOpen(true);
    if (!search.value || !search.different) return;
    reexecuteQuery();
    setSearch({ ...search, different: false });
  };

  const onClick = (id, mapLayer) => {
    const fieldName = layerData.find((e) => e.mapLayer == mapLayer);
    if (!mapState.activeLayers[mapLayer]) {
      if (mapLayer == 'jembatan' || mapLayer == 'ruas_jalan') {
        dispatch({
          type: ACTIONS.TOGGLE_LAYER,
          payload: { map: map, layer: mapLayer },
        });
      } else {
        dispatch({
          type: ACTIONS.SELECT_BOUNDARY,
          payload: { map: map, layer: mapLayer },
        });
      }
    }
    const feature = mapData[mapLayer].find((e) => e[fieldName.pk] === id);
    dispatch({
      type: ACTIONS.ZOOM_TO,
      payload: { map, feature, layer: mapLayer, popup },
    });
  };

  return (
    <div
      className={`search-box rounded-xl w-[200px] sm:w-auto shadow-md border-[#DDDDDD] border-2 bg-[#fff] absolute top-4 left-5 flex flex-col transition-all duration-500`}
    >
      <div className='flex flex-col space-y-3 px-3 pt-3 pb-4 '>
        <p className='text-xs sm:text-sm'>Cari Berdasarkan Jenis Obyek</p>
        <div className='flex space-x-1 items-center'>
          {LIST_OBYEK.map((obyek) => (
            <button
              key={obyek.name}
              onClick={() =>
                setSelected(obyek.value !== selected ? obyek.value : '')
              }
              className={`border-primary border rounded-full px-4 hidden sm:block h-8 ${
                selected === obyek.value ? 'bg-[#017E7A33]' : 'bg-white'
              }`}
            >
              <p className='text-primary text-xs'>{obyek.name}</p>
            </button>
          ))}
          <select
            className='border-primary border rounded py-1 px-4 block sm:hidden text-sm text-primary text-center focus:outline-none'
            id='search-object'
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            <option value={''}>-Pilih Obyek-</option>
            {LIST_OBYEK.map((obyek) => (
              <option
                key={obyek.value}
                className='text-center'
                value={obyek.value}
              >
                {obyek.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div
        className={`border-t-2 w-full transition-all duration-500 ${
          selected ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0'
        }`}
      >
        <div className='flex w-full p-3 '>
          <div className='border rounded-lg w-full flex items-center relative'>
            <input
              placeholder={`Cari suatu obyek...`}
              type='text'
              className='rounded-lg w-full p-2 focus:outline-0'
              value={search.value}
              onChange={(e) =>
                setSearch({ value: e.target.value, different: true })
              }
              onKeyUp={(e) => {
                if (e.code == 'Enter') return onSubmitSearch();
              }}
            />

            <button className='px-3' onClick={onSubmitSearch}>
              <img src='/icon/Search.png' />
            </button>
          </div>
        </div>
      </div>
      <SearchResults
        isOpen={isOpen}
        closeResult={closeResult}
        data={data}
        fetching={fetching}
        layer={selected}
        onClick={onClick}
      />
    </div>
  );
}

function SearchResults({
  isOpen,
  closeResult,
  data,
  layer,
  fetching,
  onClick,
}) {
  const fieldName = layerData.find((e) => e.id == layer);

  return (
    <div
      className={`search-result transition-all duration-300 ${
        isOpen && layer ? 'active' : ''
      }`}
    >
      <div className='p-4 flex justify-between'>
        <p className='font-[Heebo] text-black-4 font-semibold'>
          Hasil Pencarian
        </p>
        <button onClick={() => closeResult()}>
          <Close />
        </button>
      </div>
      <div className='border-t-2' />
      {layer && (
        <div className='results grid grid-cols-1 gap-4 p-3 max-h-[260px] overflow-y-auto'>
          {data ? data[layer]?.length == 0 && <ResultNotFound /> : null}
          {data &&
            data[layer].map((e, i) => {
              return (
                <Result
                  onClick={onClick}
                  key={i}
                  layer={layer}
                  name={e[fieldName.title]}
                  id={e[fieldName.pk]}
                  mapLayer={fieldName.mapLayer}
                  properties={fieldName.properties.reduce((acc, field) => {
                    return Object.assign(acc, { [field]: e[field] });
                  }, {})}
                />
              );
            })}
          {fetching && <h1>Loading</h1>}
        </div>
      )}
    </div>
  );
}

function Result({ layer, name, properties, onClick, id, mapLayer }) {
  if (layer == 'search_desa_kel' || layer == 'search_kec')
    return (
      <div
        onClick={() => onClick(id, mapLayer)}
        className='flex flex-col border shadow-sm rounded-md p-3 space-y-2 cursor-pointer'
      >
        <div className='flex space-x-4 items-center'>
          {layer == 'search_kec' ? <Kecamatan /> : <Kelurahan />}
          <p className='text-primary'>
            {layer == 'search_kec' ? 'Kecamatan' : 'Kelurahan/ Desa'}
          </p>
        </div>
        <div className='flex space-x-4 items-center'>
          <h2 className='font-semibold text-sm'>{name}</h2>
          <p>•</p>
          <p className='text-xs'>
            Luas {layer == 'search_kec' ? 'kecamatan' : 'kelurahan'}{' '}
            {properties.luas.toFixed(2)} km²
          </p>
        </div>
      </div>
    );
  return (
    <div
      onClick={() => onClick(id, mapLayer)}
      className='grid grid-cols-1 lg:grid-cols-2 gap-4 border rounded-md p-3 shadow-md cursor-pointer'
    >
      <img
        src={
          properties?.image_url?.length
            ? properties.image_url[0]
            : layer == 'search_jembatan'
            ? '/img/Jembatan.png'
            : '/img/Jalan.png'
        }
        alt='gambar'
        className='w-full aspect-video rounded-md object-cover object-center self-center'
      />
      <div className='flex flex-col space-y-4'>
        <h3 className='font-semibold text-sm text-black-4'>{name}</h3>
        {layer == 'search_ruas_jalan' && (
          <p className='text-xs font-light text-black-70'>
            No. Ruas {properties.nomor_ruas}
          </p>
        )}
        <div className='text-xs font-light text-black-70 inline-flex space-x-2'>
          {properties.panjang ? <p> Panjang {properties.panjang} Km</p> : null}
          {properties.panjang ? properties.lebar && <p>•</p> : null}
          {properties.lebar ? <p>Lebar {properties.lebar} M</p> : null}
        </div>
      </div>
    </div>
  );
}

function ResultNotFound() {
  return (
    <div className='flex flex-col items-center justify-center'>
      <img src='/img/NotFound.png' alt='' className='h-40' />
      <h3 className='font-[Heebo] font-medium text-lg text-black-4'>
        Data Tidak Ada
      </h3>
      <p className='font-medium text-sm text-center text-black-3'>
        Maaf, data yang Anda cari tidak Ada. Silahkan anda cari dengan kata
        kunci lain
      </p>
    </div>
  );
}
export default SearchBox;

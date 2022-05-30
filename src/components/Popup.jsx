import Jalan from './Icon/Jalan';
import Jembatan from './Icon/Jembatan';
import Kecamatan from './Icon/Kecamatan';
import Kelurahan from './Icon/Kelurahan';
function Popup({ layerName, properties }) {
  if (layerName == 'jembatan' || layerName == 'ruas_jalan')
    return (
      <div className='flex flex-col space-y-3'>
        <img
          src={
            Array.isArray(properties.image_url)
              ? properties.image_url[0]
              : layerName == 'jembatan'
              ? '/img/Jembatan.png'
              : '/img/Jalan.png'
          }
          alt=''
        />
        <div className='flex space-x-3'>
          {layerName == 'ruas_jalan' ? <Jalan /> : <Jembatan />}
          <h1 className='text-primary font-medium text-[12px]'>
            {layerName == 'ruas_jalan' ? 'Jalan' : 'Jembatan'}
          </h1>
        </div>
        <div className='space-y-2'>
          {layerName == 'ruas_jalan' ? (
            <JalanContent properties={properties} />
          ) : (
            <JembatanContent properties={properties} />
          )}
        </div>
      </div>
    );
  return (
    <div className='flex flex-col rounded-md px-4 py-2 space-y-2 cursor-pointer'>
      <div className='flex space-x-4 items-center'>
        {layerName == 'list_kecamatan' ? <Kecamatan /> : <Kelurahan />}
        <p className='text-primary'>
          {layerName == 'list_kecamatan' ? 'Kecamatan' : 'Kelurahan/ Desa'}
        </p>
      </div>
      <h2 className='font-semibold text-sm'>
        {layerName == 'list_kecamatan'
          ? `Kec. ${properties.kec}`
          : `Kel. ${properties.desa_kel}`}
      </h2>
      <p className='text-xs'>
        Luas {layerName == 'list_kecamatan' ? 'kecamatan' : 'kelurahan'}{' '}
        {properties.luas.toFixed(2)} km²
      </p>
    </div>
  );
}

function JembatanContent({ properties }) {
  return (
    <>
      <h1 className='text-[#484848] font-semibold text-[16px] font-[Heebo]'>
        {properties.nama_jembatan}
      </h1>
      <p className='text-[10px] text-[#4B4B4B]'>
        Panjang {properties.panjang} km • Lebar {properties.lebar} km
      </p>
    </>
  );
}
function JalanContent({ properties }) {
  return (
    <>
      <h1 className='text-[#484848] font-semibold text-[16px] font-[Heebo]'>
        {properties.nama_jalan}
      </h1>
      <p className='text-[10px] text-[#4B4B4B]'>
        No. ruas {properties.nomor_ruas}
        {properties.arah_lalin > 0 ? `, ${properties.arah_lalin}` : ''}
      </p>
      {properties.panjang > 0 && properties.lebar > 0 && (
        <p className='text-[10px] text-[#4B4B4B]'>
          {properties.panjang ? `Panjang ${properties.panjang} km` : ''}
          {properties.lebar > 0 ? `• Lebar ${properties.lebar} km` : ''}
        </p>
      )}
    </>
  );
}

export default Popup;

import React from 'react';

function Nav() {
  return (
    <div className='flex h-16 px-2 lg:px-4 bg-[#fff] justify-between items-center shadow-md'>
      <div className='flex space-x-4 lg:space-x-12 items-center'>
        <div className='flex space-x-5 items-center'>
          <img
            src='/img/sedang_1561429188_PEMKAB-BANDUNG 1.png'
            className='min-w-[51.73px] h-[48px]'
          />
          <div className='hidden md:block border-l-2 border-primary h-[40px] opacity-80' />
          <img
            src='/img/LOGO BANDUNG BEDAS SINGLE 1.png'
            className='w-[41.04px] h-[48px] hidden md:block'
          />
        </div>
        <div className='max-w-[348px] text-xs sm:text-sm lg:text-base text-primary font-[Heebo]'>
          <h1 className='font-bold'>SIPJATAN KABUPATEN BANDUNG</h1>
          <h4 className='hidden sm:block'>
            Sistem Informasi Pengelolaan Jalan & Jembatan
          </h4>
        </div>
      </div>

      <button className='bg-primary w-[66px] h-[34px] lg:w-[96px] lg:h-[44px] max-w-[96px] max-h-[44px] text-white rounded-lg text-xs md:text-sm lg:text-md'>
        Masuk
      </button>
    </div>
  );
}

export default Nav;

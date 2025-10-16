import Link from 'next/link';
import React from 'react'

const Cover = () => {
  return (
    <div className="bg-gray-900">
      <div className="grid grid-cols-1 lg:grid-cols-2 text-white py-20 gap-12 mx-10 xl:mx-15 2xl:mx-46">

        {/* Left Content */}
        <div className="flex flex-col justify-center">
          <div className="space-y-3 text-4xl md:text-5xl lg:text-6xl font-bold">
            <h1>Discoverr</h1>
            <h1 className="text-blue-400">Premium Quality</h1>
            <h1>Products</h1>
          </div>
          <p className="max-w-lg my-8 text-gray-300">
            Explore our curated collection of verified products from trusted brands.
            Quality guaranteed, satisfaction delivered.
          </p>
          <div className='flex gap-4'>

            <Link
              href="shop"
              className="bg-blue-500 px-6 py-2 text-white rounded-2xl text-center w-fit cursor-pointer hover:bg-blue-600 transition"
            >
              Shop Now
            </Link>
            <Link
              href="shop"
              className="bg-white px-6 py-2 text-black hover:text-white rounded-2xl text-center w-3xs cursor-pointer hover:bg-blue-500 transition"
            >
              PlaceHolder
            </Link>
          </div>
          <div className='my-9  border-t-1 py-9 border-gray-700'>
            <div className='grid grid-cols-3 max-w-lg'>
              <div><h1 className='text-blue-400 text-3xl font-semibold'>10K+</h1><p className='text-sm text-gray-400'>Happy Customers</p></div>
              <div><h1 className='text-blue-400 text-3xl font-semibold'>500+</h1><p className='text-sm text-gray-400'>Products</p></div>
              <div><h1 className='text-blue-400 text-3xl font-semibold'>99%</h1><p className='text-sm text-gray-400'>Satisfaction</p></div>
            </div>
          </div>

        </div>

        {/* Right Image */}
        <div className="flex items-center">
          <img
            src="https://images.unsplash.com/photo-1705909773420-8d7af2a343f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjB3b3Jrc3BhY2UlMjBtaW5pbWFsfGVufDF8fHx8MTc1ODEwMjEwNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="cover"
            className="w-full max-w-5xl aspect-[16/11] object-cover rounded-2xl shadow-amber-50 shadow-md"
          />
        </div>
      </div>
    </div>
  );
}

export default Cover;

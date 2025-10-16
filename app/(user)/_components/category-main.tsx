'use client'

import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

const CategoriesMain = () => {
  const [Categories, setCategories] = useState([]);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const API = `${API_BASE_URL}/api/categories`;

  // Fetch Categories
  const getCategoryData = async () => {
    try {
      const res = await axios.get(API);
      setCategories(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategoryData();
  }, []);

  return (
    <div className="bg-gray-50">
      <div className="mb-20 mx-10 xl:mx-15 2xl:mx-46 pt-17">
        {/* Section Heading */}
        <div className="flex items-center flex-col gap-4 mb-8">
          <h1 className="text-center font-bold text-4xl tracking-wide">
            Shop by Categories
          </h1>
          <p className="text-center max-w-2xl text-gray-800">
            Discover our carefully curated categories featuring the best
            products from verified sellers worldwide.
          </p>
        </div>

        {/* Custom Layout Grid */}
        <div className="grid md:grid-cols-2 md:grid-rows-4 grid-cols-1 gap-6 h-[700px] pt-3">
          {/* left col  */}
          <div className="flex flex-col row-span-4 gap-6 ">
            {Categories.slice(0, 2).map((item: any) => (
              <Link
                href={`/category-products/${item._id}`}
                key={item._id}
                className="relative flex-1 rounded-2xl overflow-hidden hover:scale-105 shadow-md hover:shadow-xl transition-all duration-500 group"
              >
                {/* Image */}
                {item.image ? (
                  <div>
                    <img
                      src={`${API_BASE_URL}${item.image}`}
                      alt={item.category}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute left-5 top-5 flex px-2 py-1 rounded-2xl items-center justify-center bg-blue-600 text-white">
                      <span className="font-md text-xs">Featured</span>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500">
                    <span className="font-semibold text-xl">No Image</span>
                  </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                {/* Category Title */}
                <div className="absolute bottom-4 w-full text-white px-6 py-2 flex justify-between items-center  rounded-lg">
                  <div className="flex flex-col gap-1">
                    <h1 className="text-white font-semibold text-lg sm:text-xl capitalize tracking-wide text-center">
                      {item.category}
                    </h1>
                    <p className="text-sm text-gray-300">
                      {item.productCount} Products
                    </p>
                  </div>
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-arrow-right w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                    >
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {/* right col  */}

          <div className="grid gap-6 lg:grid-cols-2 lg:row-span-2 grid-cols-1 row-span-4">
            {Categories.slice(2, 4).map((item: any) => (
              <Link
                href={`/category-products/${item._id}`}
                key={item._id}
                className="relative flex-1 rounded-2xl hover:scale-110 overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 group"
              >
                {/* Image */}
                {item.image ? (
                  <img
                    src={`${API_BASE_URL}${item.image}`}
                    alt={item.category}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500">
                    <span className="font-semibold text-xl">No Image</span>
                  </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                {/* Category Title */}
                <div className="absolute bottom-4 w-full text-white px-6 py-2 flex justify-between items-center  rounded-lg">
                  <div className="flex flex-col gap-1">
                    <h1 className="text-white font-semibold text-lg sm:text-xl capitalize tracking-wide text-center">
                      {item.category}
                    </h1>
                    <p className="text-sm text-gray-300">
                      {item.productCount} Products
                    </p>
                  </div>
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-arrow-right w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                    >
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-center pb-20">
        <Link href={"/category"}>
          <button className="bg-gray-900 text-white py-3 px-10 rounded-xl cursor-pointer">
            <span>View All Categories</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-arrow-right w-4 h-4 inline mx-2"
            >
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
            {" "}
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CategoriesMain;

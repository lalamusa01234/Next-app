"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

interface ICategory {
  _id: string;
  category: string;
  image?: string;
}

const Category = () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [Categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const API = `${API_BASE_URL}/api/categories`;

  // Fetch Categories
  const getCategoryData = async () => {
    try {
      setLoading(true);
      const res = await axios.get<ICategory[]>(API);
      setCategories(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategoryData();
  }, []);

  if (loading) {
    // ✅ Full-page spinner while loading
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="my-20 mx-10 xl:mx-15 2xl:mx-46">
      <h1 className="text-center p-5 font-semibold text-4xl pb-10">Categories</h1>

      {Categories.length > 0 ? (
        <div className="grid grid-cols-12 justify-items-center gap-6 mx-auto">
          {Categories.map((item) => {
            const hasImage = !!item.image;
            return (
              <div
                key={item._id}
                className="col-span-12 sm:col-span-6 md:col-span-4 relative h-80 w-full rounded-2xl overflow-hidden shadow-md hover:shadow-xl group transition-all duration-500"
              >
                {/* Image or placeholder */}
                {hasImage ? (
                  <img
                    src={`${API_BASE_URL}${item.image}`}
                    alt={item.category}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-500 font-bold text-2xl">No Image</span>
                  </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                {/* Clickable overlay */}
                <Link href={`/category-products/${item._id}`}>
                  <div className="absolute inset-0"></div>
                </Link>

                {/* Title */}
                <h1 className="absolute bottom-5 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 backdrop-blur-sm text-white font-semibold text-lg sm:text-xl uppercase tracking-wide rounded-lg">
                  {item.category}
                </h1>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-500">No categories found.</p>
      )}
    </div>
  );
};

export default Category;

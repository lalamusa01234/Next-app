'use client'

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addData } from "@/features/itemSlice";
import axios from "axios";
import { toast } from "react-toastify";
import Link from "next/link";


const ShopMain = () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const user = useSelector((state: any) => state.user.user);
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const dispatch = useDispatch();

  const PRODUCTS_API = `${API_BASE_URL}/api/products`;
  const WISHLIST_API = `${API_BASE_URL}/api/wishlist`;

  // Fetch products
  const getProducts = async () => {
    try {
      const res = await axios.get(PRODUCTS_API);
      let items = res.data.data || res.data.products || [];
      if (!Array.isArray(items)) items = [];
      setProducts(items);
      console.log(items);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  };


  // Fetch wishlist
  const getWishlist = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await axios.get(WISHLIST_API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist(res.data.products);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  // Add to cart
  const addToCart = (product: any) => {
    const selectedOptions = product.attributes?.length
      ? product.attributes.map((attr: any) => ({
          name: attr.name,
          value: attr.options[0],
        }))
      : [];
    dispatch(addData({ ...product, selectedOptions }));
  };

  // Toggle wishlist
  const toggleWishlist = async (productId: any) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to manage wishlist");
      return;
    }

    try {
      const exists = wishlist.find((w: any) => w?.product?._id === productId);
      if (exists) {
        setWishlist((prev) => prev.filter((w: any) => w?.product?._id !== productId));
        await axios.delete(`${WISHLIST_API}/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.info("Removed from wishlist 🤍", { autoClose: 2000 });
      } else {
        const res = await axios.post(
          WISHLIST_API,
          { productId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setWishlist(res.data.products || []);
        toast.success("Added to wishlist ❤️", { autoClose: 2000 });
      }
    } catch (error) {
      toast.error("Error updating wishlist");
      console.error(error);
      getWishlist();
    }
  };

  // Initial load
  useEffect(() => {
    getProducts();
    if (user && localStorage.getItem("token")) {
      getWishlist();
    }
  }, [user]);

  const displayedProducts = products.slice(0, visibleCount);

  return (
    <div id="shop" className="my-8 mx-10 xl:mx-15 2xl:mx-46">
      {/* Header */}
      <div className="my-8 flex justify-between items-center">
        <div className="flex flex-col gap-3">
          <h1 className="font-bold text-4xl">Featured Products</h1>
          <p className="max-w-lg">
            Discover our handpicked selection of premium products with verified
            quality and customer satisfaction.
          </p>
        </div>
       <Link href={"/shop"}> <button className="border py-1 px-3 rounded-lg hover:bg-gray-900 hover:text-white cursor-pointer">
          View All Products
        </button></Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {displayedProducts.map((item: any) => (
          <div
            key={item._id}
            className="group relative bg-white hover:-translate-y-1 rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            {/* Product Card */}
            <Link href={`/product-detail/${item._id}`} className="block group relative">
              {/* Wishlist */}
              <div
                onClick={(e) => {
                  e.preventDefault();
                  toggleWishlist(item._id);
                }}
                className="absolute top-3 right-3 z-20 bg-white/70 backdrop-blur-sm shadow-md rounded-full p-2 w-9 h-9 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                {wishlist.some((w: any) => w?.product?._id === item._id) ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="red"
                    stroke="red"
                    strokeWidth="2"
                    width="22"
                    height="22"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="black"
                    strokeWidth="2"
                    width="22"
                    height="22"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                )}
              </div>

              {/* Image */}
              <div className="w-full h-64 bg-gray-50 overflow-hidden relative">
                {/* SALE Badge */}
                {item?.discountValue > 0 && (
                  <div className="absolute top-4 left-4 bg-red-500 z-20 text-white px-2 rounded-lg text-sm font-bold shadow-lg">
                    {item?.discountType === "percentage"
                      ? `-${item?.discountValue}%`
                      : `-${item?.discountValue} Flat`}
                  </div>
                )}
                <img
                  src={`${API_BASE_URL}${
                    Array.isArray(item.image) && item.image.length > 0
                      ? item.image[0]
                      : "/placeholder.jpg"
                  }`}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Quick Add */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    addToCart(item);
                  }}
                  className="flex justify-center gap-4 items-center absolute bottom-3 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm font-medium py-2 mx-auto rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-gray-700 cursor-pointer w-[88%]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="8" cy="21" r="1"></circle>
                    <circle cx="19" cy="21" r="1"></circle>
                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
                  </svg>
                  <span>Quick Add</span>
                </button>
              </div>
            </Link>

            {/* Content */}
            <div className="p-5 text-left">
              {/* Reviews */}
              <div className="flex items-center space-x-1 mt-1">
                <span className="text-yellow-500 text-sm">★</span>
                <span className="text-sm text-gray-700">
                  {item?.avgRating ? Number(item.avgRating).toFixed(1) : "0.0"}
                </span>
                <span className="text-xs text-gray-500 ml-1">
                  ({item?.totalReviews ?? 0})
                </span>
              </div>

              <h3 className="text-lg mt-1 font-semibold text-gray-800 truncate group-hover:text-blue-500">
                {item.name}
              </h3>

              {/* Price */}
              <p className="text-md font-bold text-gray-900 mt-2">
                ${(Number(item?.finalPrice ?? item?.price ?? 0)).toFixed(2)}
                {item?.price &&
                  item?.finalPrice !== undefined &&
                  Number(item?.price) !== Number(item?.finalPrice) && (
                    <span className="text-sm ml-2 font-medium text-gray-400 line-through">
                      ${(Number(item?.price ?? 0)).toFixed(2)}
                    </span>
                  )}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      {visibleCount && visibleCount < products?.length && (
        <div className="flex justify-center my-13">
          <button
            onClick={() => setVisibleCount((prev) => prev + 6)}
            className="border border-black py-2 px-6 rounded-lg hover:bg-gray-900 hover:text-white cursor-pointer"
          >
            Load More Products
          </button>
        </div>
      )}
    </div>
  );
};

export default ShopMain;

'use client'

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { addData } from "@/features/itemSlice";
import Link from "next/link";

const Shop = ({ categoryId, limit, hideCategory, excludeId }: any) => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const user = useSelector((state: any) => state.user.user);
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [category, setCategory] = useState<any>(null);
  const dispatch = useDispatch();

  const PRODUCTS_API = `${API_BASE_URL}/api/products`;
  const WISHLIST_API = `${API_BASE_URL}/api/wishlist`;
  const CATEGORY_API = `${API_BASE_URL}/api/categories`;
  const DEFAULT_LIMIT = 8;

  // const getImageUrl = (img) => (img.startsWith("http") ? img : `http://localhost:3000${img}`);

  // Fetch products
  const getProducts = async () => {
    try {
      const url = categoryId
        ? `${PRODUCTS_API}/category/${categoryId}`
        : PRODUCTS_API;
      const res = await axios.get(url);

      let items = res.data.data || res.data.products || [];

      if (excludeId) {
        items = items.filter((p: any) => p._id !== excludeId);
      }

      if (!Array.isArray(items)) {
        items = [];
      }

      setProducts(items);

     
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  };

  // Fetch category info
  const getCategory = async () => {
    if (!categoryId) return;
    try {
      const res = await axios.get(`${CATEGORY_API}/${categoryId}`);
      setCategory(res.data);
    } catch (error) {
      console.error("Error fetching category:", error);
    }
  };

  // Fetch wishlist
  const getWishlist = async () => {
    try {
      const token = localStorage.getItem("token");
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

  // Fetch data on mount / categoryId/user change
  useEffect(() => {
    const fetchData = async () => {
      await getProducts();
      await getCategory();
      if (user && localStorage.getItem("token")) {
        await getWishlist();
      } else {
        setWishlist([]);
      }
    };
    fetchData();
  }, [categoryId, user]);

  // Determine displayed products
  let displayedProducts;
  if (limit === undefined) {
    displayedProducts = !categoryId ? products.slice(0, DEFAULT_LIMIT) : products;
  } else if (limit === 0 || limit === null) {
    displayedProducts = products;
  } else {
    displayedProducts = products.slice(0, limit);
  }

  return (
    <div id="shop" className="py-8">
      {!hideCategory && (
        <h3 className="text-center text-[#232323] text-4xl font-semibold mb-14">
          {categoryId ? `${category?.category || "Category"} Products` : "Products"}
        </h3>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {displayedProducts.map((item: any) => (
          <div
            key={item._id}
            className="group relative bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            {/* Wishlist */}
            <div
              onClick={() => toggleWishlist(item._id)}
              className="absolute top-3 right-3 z-10 bg-white/50 backdrop-blur-sm shadow-md text-red-500 rounded-full p-2 w-9 h-9 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
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
            <Link href={`/product-detail/${item._id}`} className="block">
              <div className="w-full h-64 bg-gray-50 overflow-hidden">
                <img
                  src={`${API_BASE_URL}${(Array.isArray(item.image) && item.image.length > 0) ? item.image[0] : "/placeholder.jpg"}`}
                  //  src={getImageUrl((Array.isArray(item.image) ? item.image[0] : item.image) ?? "/placeholder.jpg")}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </Link>

            {/* Content */}
            <div className="p-5 text-left">
              <h3 className="text-lg font-md text-gray-800 truncate">{item.name}</h3>

              {/* Reviews */}
              <div className="flex items-center space-x-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-sm ${i < Math.round(Number(item?.avgRating ?? 0)) ? "text-yellow-500" : "text-gray-300"}`}
                  >
                    ★
                  </span>
                ))}
                <span className="text-xs text-gray-500 ml-1">({item?.totalReviews ?? 0})</span>
              </div>

              {/* Price */}
              <p className="text-sm font-medium text-gray-900 mt-2">
                ${(Number(item?.finalPrice ?? item?.price ?? 0)).toFixed(2)}
                {item?.price &&
                  item?.finalPrice !== undefined &&
                  Number(item?.price) !== Number(item?.finalPrice) && (
                    <span className="text-sm ml-2 text-gray-400 line-through">
                      ${(Number(item?.price ?? 0)).toFixed(2)}
                    </span>
                  )}
              </p>

              <button
                onClick={() => addToCart(item)}
                className="mt-4 w-full bg-gray-900 text-white font-medium py-2 rounded-xl hover:bg-gray-700 transition-colors cursor-pointer"
              >
                Add To Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;

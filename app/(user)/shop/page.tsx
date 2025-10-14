"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addData } from "../../../features/itemSlice";
import axios from "axios";
import { toast } from "react-toastify";
import Link from "next/link";

// --------------------
// Types
// --------------------
interface AttributeOption {
  name: string;
  options: string[];
}

interface Product {
  _id: string;
  name: string;
  image: string[] | string;
  attributes?: AttributeOption[];
  avgRating?: number;
  totalReviews?: number;
  price?: number;
  finalPrice?: number;
  isNew?: boolean;
  discount?: number;
  description?: string;
}

interface WishlistItem {
  product: Product;
}

interface Category {
  _id: string;
  category: string;
  productCount?: number;
}

interface RootState {
  user: {
    user: { id: string; name: string } | null;
  };
}

const ShopPage: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const [products, setProducts] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const itemsPerPage = 6; // you decide
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const dispatch = useDispatch();

  const PRODUCTS_API = "http://localhost:3000/api/products";
  const WISHLIST_API = "http://localhost:3000/api/wishlist";
  const CATEGORIES_API = "http://localhost:3000/api/categories";

  // --------------------
  // Debounce Hook (inline)
  // --------------------
  function useDebounce<T>(value: T, delay: number): T {
    const [debounced, setDebounced] = useState<T>(value);
    useEffect(() => {
      const handler = setTimeout(() => setDebounced(value), delay);
      return () => clearTimeout(handler);
    }, [value, delay]);

    return debounced;
  }

  const debouncedSearch = useDebounce(searchTerm, 1000);
  const debouncedMinPrice = useDebounce(minPrice, 1000);
  const debouncedMaxPrice = useDebounce(maxPrice, 1000);

  // --------------------
  // Fetch products
  // --------------------
  const getProducts = async (categoryId?: string | null, page: number = 1) => {
    try {
      let url = categoryId
        ? `${PRODUCTS_API}/category/${categoryId}?page=${page}&limit=${itemsPerPage}`
        : `${PRODUCTS_API}?page=${page}&limit=${itemsPerPage}`;

      // Add filters
      const params = new URLSearchParams();
      if (debouncedSearch) params.append("search", debouncedSearch);
      if (sortBy) params.append("sortBy", sortBy);
      if (debouncedMinPrice !== undefined)
        params.append("minPrice", debouncedMinPrice.toString());
      if (debouncedMaxPrice !== undefined)
        params.append("maxPrice", debouncedMaxPrice.toString());

      const res = await axios.get(url, { params });
      let items: Product[] = res.data.products || [];

      setProducts(items);
      setTotalProducts(res.data.totalProducts || items.length);
      setTotalPages(res.data.totalPages || 1);
      setCurrentPage(res.data.currentPage || page);
    } catch (error) {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // --------------------
  // Fetch categories
  // --------------------
  const getCategories = async () => {
    try {
      const res = await axios.get(CATEGORIES_API);
      console.log("Categories API response:", res.data);
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // --------------------
  // Fetch wishlist
  // --------------------
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

  // --------------------
  // Add to cart
  // --------------------
  const addToCart = (product: Product) => {
    const selectedOptions = product.attributes?.length
      ? product.attributes.map((attr) => ({
          name: attr.name,
          value: attr.options[0],
        }))
      : [];

    dispatch(addData({ ...product, selectedOptions }));
  };

  // --------------------
  // Toggle wishlist
  // --------------------
  const toggleWishlist = async (productId: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to manage wishlist");
      return;
    }

    try {
      const exists = wishlist.find((w) => w?.product?._id === productId);
      if (exists) {
        setWishlist((prev) =>
          prev.filter((w) => w?.product?._id !== productId)
        );
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
      getWishlist();
    }
  };

  useEffect(() => {
    setLoading(true);
    getProducts(selectedCategory, currentPage);

    if (user && localStorage.getItem("token")) {
      getWishlist();
    } else {
      setWishlist([]);
    }
    getCategories();
  }, [
    selectedCategory,
    user,
    currentPage,
    sortBy,
    debouncedSearch,
    debouncedMinPrice,
    debouncedMaxPrice,
  ]);

  return (
    <div>
      <div className="pb-8 max-w-7xl mx-auto px-4 mt-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Shop by Categories
          </h1>
          <p className="text-gray-600">
            Discover our complete collection of verified products
          </p>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && getProducts(selectedCategory, 1)
            }
            className="border border-gray-300 rounded-lg bg-gray-100 px-4 py-2 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-gray-900 w-85"
          />
          <svg
            className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
      <div className="bg-gray-50 min-h-screen border-t-1 border-gray-100">
        <div className="max-w-7xl mx-auto px-4 mt-7">
          {/* Header */}
          {/* <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shop Categories</h1>
          <p className="text-gray-600">Discover our complete collection of verified products</p>
        </div> */}

          <div className="flex gap-6">
            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0 bg-white max-h-210 border border-gray-200 rounded-2xl">
              {/* Categories */}
              <div className="bg-white rounded-lg  p-4 mb-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">
                  Categories
                </h3>
                <ul className="space-y-2 overflow-y-auto max-h-65 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  <li
                    className={`cursor-pointer px-4 py-2.5 rounded-lg transition ${
                      !selectedCategory
                        ? "bg-gray-900 text-white font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setSelectedCategory(null)}
                  >
                    <div className="flex justify-between items-center">
                      <span>All Products</span>
                      <span
                        className={`text-sm ${
                          !selectedCategory ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        {totalProducts}
                      </span>
                    </div>
                  </li>
                  {categories.map((cat) => (
                    <li
                      key={cat._id}
                      className={`cursor-pointer px-4 py-2.5 rounded-lg transition ${
                        selectedCategory === cat._id
                          ? "bg-gray-900 text-white font-medium"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => setSelectedCategory(cat._id)}
                    >
                      <div className="flex justify-between items-center">
                        <span>{cat.category}</span>
                        <span
                          className={`text-sm ${
                            selectedCategory === cat._id
                              ? "text-gray-300"
                              : "text-gray-500"
                          }`}
                        >
                          {cat.productCount}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Filter */}
              <div className="rounded-lg  p-4 mb-6">
                <h4 className="font-semibold mb-4 text-gray-900">
                  Price Range
                </h4>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice || ""}
                      onChange={(e) => setMinPrice(Number(e.target.value))}
                      className="w-1/2 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice || ""}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-1/2 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                  </div>
                  {/* <button
                    onClick={() => {
                      setCurrentPage(1);
                      getProducts(selectedCategory, 1);
                    }}
                    className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition font-medium"
                  >
                    Apply
                  </button> */}
                </div>
              </div>

              {/* Rating Filter */}
              <div className=" rounded-lg  p-4">
                <h4 className="font-semibold mb-4 text-gray-900">Rating</h4>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div
                      key={star}
                      className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900 py-1"
                    >
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={
                              i < star ? "text-yellow-400" : "text-gray-300"
                            }
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span>& up</span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
              {/* Filters Bar */}
              <div className=" rounded-lg  flex justify-between items-center">
                <div className="text-gray-600 text-sm">
                  Showing{" "}
                  <span className="font-semibold text-gray-900">
                    {products.length}
                  </span>{" "}
                  products
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setCurrentPage(1); // triggers useEffect
                    }}
                    className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  >
                    <option value="priceAsc">Price: Low to High</option>
                    <option value="priceDesc">Price: High to Low</option>
                    <option value="newest">Newest</option>
                  </select>

                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 border border-gray-300 cursor-pointer rounded-lg hover:bg-gray-700 hover:text-white ${
                      viewMode === "list" ? "bg-gray-900 text-white" : ""
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 border border-gray-300 cursor-pointer rounded-lg hover:bg-gray-700 hover:text-white ${
                      viewMode === "grid" ? "bg-gray-900 text-white" : ""
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center min-h-[400px]">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-gray-900"></div>
                </div>
              ) : products.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                  <p className="text-gray-500">No products found.</p>
                </div>
              ) : (
                <>
                  {/* Products Grid */}
                  <div
                    className={`grid ${
                      viewMode === "grid"
                        ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                        : "grid-cols-1"
                    } gap-6 mt-4`}
                  >
                    {products.map((item) => {
                      const discountPercentage =
                        item.discount ||
                        (item.price && item.finalPrice
                          ? Math.round(
                              ((item.price - item.finalPrice) / item.price) *
                                100
                            )
                          : 0);

                      return (
                        <div
                          key={item._id}
                          className={`group relative bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col ${
                            viewMode === "list"
                              ? "lg:flex-row lg:items-start"
                              : ""
                          }`}
                        >
                          {/* Wishlist */}
                          <div
                            onClick={() => toggleWishlist(item._id)}
                            className="absolute top-3 right-3 z-10 bg-white/50 backdrop-blur-sm shadow-md text-red-500 rounded-full p-2 w-9 h-9 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                          >
                            {wishlist.some(
                              (w) => w?.product?._id === item._id
                            ) ? (
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

                          {/* Image Container */}
                          <div
                            className={`relative overflow-hidden bg-gray-100 ${
                              viewMode === "list"
                                ? "w-full lg:w-1/3 flex-shrink-0"
                                : "w-full"
                            }`}
                          >
                            <Link href={`/product-detail/${item._id}`}>
                              <div className="aspect-[4/3] w-full">
                                <img
                                  src={`http://localhost:3000${
                                    Array.isArray(item.image) &&
                                    item.image.length > 0
                                      ? item.image[0]
                                      : "/placeholder.jpg"
                                  }`}
                                  alt={item.name}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                              </div>
                            </Link>

                            {/* Badges */}
                            {discountPercentage > 0 && (
                              <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded">
                                -{discountPercentage}%
                              </div>
                            )}
                          </div>

                          {/* Product Info */}
                          <div
                            className={`p-4 ${
                              viewMode === "list" ? "w-full lg:w-2/3" : "w-full"
                            }`}
                          >
                            {/* Rating */}
                            <div className="flex items-center gap-1 mb-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <span
                                    key={i}
                                    className={`text-sm ${
                                      i <
                                      Math.round(Number(item?.avgRating ?? 0))
                                        ? "text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                              <span className="text-xs text-gray-500">
                                {item?.avgRating?.toFixed(1) || "0.0"} (
                                {item?.totalReviews ?? 0})
                              </span>
                            </div>

                            {/* Product Name */}
                            <Link href={`/product-detail/${item._id}`}>
                              <h3 className="text-base font-semibold text-gray-900 mb-2 hover:text-gray-700 transition line-clamp-2">
                                {item.name}
                              </h3>
                            </Link>
                            {viewMode === "list" && item.description
                              ? item.description.length > 150
                                ? item.description.slice(0, 150) + "..."
                                : item.description
                              : ""}
                            {/* Price */}
                            <div
                              className={`flex items-baseline gap-2 mb-4 ${
                                viewMode === "list" ? "mt-4" : "mt-0"
                              }`}
                            >
                              <span className="text-xl font-bold text-gray-900">
                                $
                                {Number(
                                  item?.finalPrice ?? item?.price ?? 0
                                ).toFixed(2)}
                              </span>
                              {item?.price &&
                                item?.finalPrice !== undefined &&
                                Number(item?.price) !==
                                  Number(item?.finalPrice) && (
                                  <span className="text-sm text-gray-400 line-through">
                                    ${Number(item?.price ?? 0).toFixed(2)}
                                  </span>
                                )}
                            </div>

                            {/* Add to Cart Button */}
                            <button
                              onClick={() => addToCart(item)}
                              className={`bg-gray-900 text-white font-medium py-2.5 rounded-lg hover:bg-gray-800 transition flex items-center justify-center gap-2 ${
                                viewMode === "list"
                                  ? "w-1/4 flex-shrink-0 mt-6 ml-auto"
                                  : "w-full"
                              }`}
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                              </svg>
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pagination */}
                  <div className="flex justify-center items-center gap-2 my-8">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => p - 1)}
                      className={`px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium ${
                        currentPage === 1
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium ${
                            currentPage === page
                              ? "bg-gray-900 text-white"
                              : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}

                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => p + 1)}
                      className={`px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium ${
                        currentPage === totalPages
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;

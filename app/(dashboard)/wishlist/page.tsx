"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addData } from "@/features/itemSlice";
import Link from "next/link";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string[];
  avgRating?: number;
  totalReviews?: number;
  finalPrice?: any;
  attributes?: any[];
}

interface WishlistItem {
  product: Product | null;
}

interface WishlistData {
  products: WishlistItem[];
}

const Wishlist = () => {
  const [wishlist, setWishlist] = useState<WishlistData | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const deleteWl = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/api/wishlist/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist((prev: any) => ({
        ...prev,
        products: prev.products.filter((item: any) => item.product && item.product._id !== id),
      }));
      toast.info("Removed from wishlist 🤍");
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove item ❌");
    }
  };

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${API_BASE_URL}/api/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!data || !data.products) {
        setWishlist({ products: [] });
      } else {
        // Extract product IDs from wishlist
        const productIds = data.products.map((item: any) => item.product?._id).filter(Boolean);
        if (productIds.length > 0) {
          // Fetch full product details from /api/products
          const productsResponse = await axios.get(`${API_BASE_URL}/api/products`, {
            params: { ids: productIds.join(',') }, // Assuming /api/products supports filtering by IDs
          });
          const productsWithRatings = productsResponse.data.products || [];
          // Map to match WishlistItem structure
          setWishlist({ products: productsWithRatings.map((p: Product) => ({ product: p })) });
        } else {
          setWishlist({ products: [] });
        }
      }
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        setWishlist({ products: [] });
      } else {
        console.error(error);
        toast.error("Failed to load wishlist ❌");
      }
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    const selectedOptions = product.attributes?.length
      ? product.attributes.map((attr: any) => ({
          name: attr.name,
          value: attr.options[0],
        }))
      : [];
    dispatch(addData({ ...product, selectedOptions }));
    toast.success("Added to cart! 🛒");
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  if (loading) {
    return <p className="p-6 text-gray-500">Loading wishlist...</p>;
  }

  if (!wishlist || wishlist.products.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">My Wishlist</h2>
        <p className="text-gray-500">Your wishlist is empty.</p>
      </div>
    );
  }

  const uniqueProducts: WishlistItem[] = [
    ...new Map(
      (wishlist.products || [])
        .filter((item) => item.product)
        .map((item) => [item.product!._id, item])
    ).values(),
  ];

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold mb-8">My Wishlist</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {uniqueProducts.map((item) => {
          const product = item.product!;
          const isOnSale = product.finalPrice && product.price && product.finalPrice < product.price;

          return (
            <div
              key={product._id}
              className="group relative bg-white rounded-2xl ring ring-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {isOnSale && (
                <span className="absolute top-3 left-3 z-10 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                  -{Math.round(((product.price - product.finalPrice) / product.price) * 100)}%
                </span>
              )}
              <Link href={`/product-detail/${product._id}`}><div className="w-full h-64 bg-gray-50 overflow-hidden">
                <img
                  src={`${API_BASE_URL}${product.image[0]}`}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div></Link>
              <div className="p-5 text-left">
                {/* Reviews */}
                <div className="flex items-center space-x-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-sm ${
                        i < Math.round(Number(product?.avgRating ?? 0))
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                  <span className="text-xs text-gray-500 ml-1">
                    ({product?.totalReviews ?? 0})
                  </span>
                </div>
                <h3 className="text-lg mt-1 font-semibold text-gray-800 truncate group-hover:text-blue-500">
                  {product.name}
                </h3>
                {/* Price */}
                <p className="text-md font-bold text-gray-900 mt-2">
                  ${isOnSale ? product.finalPrice?.toFixed(2) : product.price.toFixed(2)}
                  {isOnSale && (
                    <span className="text-sm ml-2 font-medium text-gray-400 line-through">
                      ${product.price.toFixed(2)}
                    </span>
                  )}
                </p>
                <div className="flex gap-2">
            
                <button
                  onClick={() => addToCart(product)}
                  className="mt-2 w-full bg-gray-900 text-white font-medium py-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  Add to Cart
                </button>
                    <button
                  onClick={() => deleteWl(product._id)}
                  className="mt-2 bg-white border border-red-500 text-red-500 font-medium p-3 rounded-lg hover:bg-red-700 transition-colors cursor-pointer hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash2 lucide-trash-2 w-4 h-4 " aria-hidden="true"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 flex justify-between items-center">
        <span>Total Items: {uniqueProducts.length}</span>
        <span>Total Value: ${uniqueProducts.reduce((sum, item) => sum + (item.product?.finalPrice || item.product?.price || 0), 0).toFixed(2)}</span>
      </div>
    </div>
  );
};

export default Wishlist;
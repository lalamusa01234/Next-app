"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { bulkUpdateData } from "../../../../features/itemSlice";
import Shop from "../../_components/shop";


// Types
interface Variation {
  _id: string;
  name: string;
  price: number;
  finalPrice?: number;
  discountValue?: number;
  discountType?: "percentage" | "flat";
  quantity?: number;
}

interface Category {
  _id: string;
  category: string;
}

interface Review {
  _id: string;
  rating: number;
  comment: string;
  user?: {
    fname: string;
    lname: string;
  };
  verified?: boolean;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  finalPrice?: number;
  discountValue?: number;
  discountType?: "percentage" | "flat";
  image?: string[];
  category?: Category;
  variations?: Variation[];
  quantity?: number;
  reviews?: Review[];
}

interface WishlistItem {
  product: Product;
}

interface PageDetailProps {
  productId: string;
}

const PageDetail = ({ productId }: PageDetailProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [product, setProduct] = useState<Product | null>(null);
  const [catProduct, setCatProduct] = useState<Product[] | null>(null);
  const [categoryId, setCategoryId] = useState<string>("");
  const [categoryName, setCategoryName] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newRating, setNewRating] = useState<number>(0);
  const [newComment, setNewComment] = useState<string>("");
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);
  const [selectedVariationIndex, setSelectedVariationIndex] = useState<number>(0); // -1 = Standard
  const [lessProducts, setLessProducts] = useState<boolean>(false);


const isVariationSelected = selectedVariationIndex >= 0 && product?.variations?.[selectedVariationIndex];
const selectedVariation = isVariationSelected ? product.variations![selectedVariationIndex] : null;

const finalPrice = selectedVariation?.finalPrice ?? product?.finalPrice ?? 0;
const originalPrice = selectedVariation?.price ?? product?.price ?? 0;
const discountValue = selectedVariation?.discountValue ?? product?.discountValue ?? 0;
const discountType = selectedVariation?.discountType ?? product?.discountType ?? "";

  const API = `${API_BASE_URL}/api/products`;
  const CATEGORY_API = `${API_BASE_URL}/api/products/category`;
  const WISHLIST_API = `${API_BASE_URL}/api/wishlist`;
  const REVIEW_API = `${API_BASE_URL}/api/review`;

const id = productId

  // Fetch product
  const fetchProduct = async () => {
    try {
      const res = await axios.get<{ product: Product }>(`${API}/${id}`);
      const fetched = res.data.product;
      setProduct(fetched);
      setReviews(fetched.reviews || []);
      const cat = fetched.category;
      if (cat) {
        setCategoryId(cat._id);
        setCategoryName(cat.category);
      }
      if (fetched.image?.length) setSelectedImage(`${API_BASE_URL}${fetched.image[0]}`);
      setSelectedVariationIndex(fetched.variations?.length ? 0 : -1);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load product");
    }
  };

  const fetchCategoryProducts = async (catId: string) => {
    if (!catId) return;
    try {
      const res = await axios.get<{ products: Product[] }>(`${CATEGORY_API}/${catId}`);
      setCatProduct(res.data.products || []);
      setLessProducts((res.data.products?.length || 0) < 2);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load products of category");
    }
  };

  const getWishlist = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await axios.get<{ products: WishlistItem[] }>(WISHLIST_API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist(res.data.products || []);
    } catch (err) {
      console.error(err);
    }
  };

  const getCartItem = () => {
    if (!product) return null;
    const isVariationSelected = selectedVariationIndex >= 0;
    const selectedVariation = isVariationSelected ? product.variations?.[selectedVariationIndex] : null;
    const price = selectedVariation?.finalPrice ?? selectedVariation?.price ?? product.finalPrice ?? product.price ?? 0;

    return {
      _id: product._id,
      name: product.name,
      image: product.image?.map((img) => `${img}`) || [],
      price,
      finalPrice: price,
      originalPrice: selectedVariation?.price ?? product.price ?? 0,
      discountValue: isVariationSelected ? selectedVariation?.discountValue ?? 0 : product.discountValue ?? 0,
      discountType: isVariationSelected ? selectedVariation?.discountType ?? "" : product.discountType ?? "",
      stock: selectedVariation?.quantity ?? product.quantity ?? 0,
      quantity,
      selectedOptions: isVariationSelected ? [{ name: "Variation", value: selectedVariation?.name }] : [{ name: "Standard", value: "Default" }],
    };
  };

  const handleAddToCart = () => {
    const item = getCartItem();
    if (!item) return;
    dispatch(bulkUpdateData(item));
    toast.success(`Added ${quantity} item(s) to cart 🛒`, { autoClose: 2000, toastId: "cart-toast" });
    setQuantity(1);
  };

  const handleCheckout = () => {
    const item = getCartItem();
    if (!item) return;
    dispatch(bulkUpdateData(item));
    router.push("/checkout");
  };

  const toggleWishlist = async () => {
    if (!user) {
      toast.error("Please login to manage wishlist");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const exists = wishlist.find((w) => w?.product?._id === product?._id);
      if (exists) {
        setWishlist((prev) => prev.filter((w) => w?.product?._id !== product?._id));
        await axios.delete(`${WISHLIST_API}/${product?._id}`, { headers: { Authorization: `Bearer ${token}` } });
        toast.info("Removed from wishlist 🤍");
      } else {
        const res = await axios.post(WISHLIST_API, { productId: product?._id }, { headers: { Authorization: `Bearer ${token}` } });
        setWishlist(res.data.products || []);
        toast.success("Added to wishlist ❤️");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating wishlist");
      getWishlist();
    }
  };

  const submitReview = async () => {
    if (!user) {
      toast.error("Please login to submit a review");
      return;
    }
    if (!newRating || !newComment.trim()) {
      toast.error("Please provide rating and comment");
      return;
    }
    try {
      setSubmittingReview(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(`${REVIEW_API}/product/${id}`, { rating: newRating, comment: newComment }, { headers: { Authorization: `Bearer ${token}` } });
      const newReview: Review = res.data;
      setReviews((prev) => [...prev, newReview]);
      setNewRating(0);
      setNewComment("");
      toast.success("Review submitted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const averageRating = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

  useEffect(() => {
    if (!id) return;
    fetchProduct();
    if (user) getWishlist();
    else setWishlist([]);
  }, [id, user]);

  useEffect(() => {
    if (categoryId) fetchCategoryProducts(categoryId);
  }, [categoryId]);

  if (!product) return <div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="mx-10 xl:mx-15 2xl:mx-46">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Images */}
            <div className="p-8 lg:p-12 bg-gradient-to-br from-gray-50 to-white">
              <div className="relative mb-6 group">
                <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-lg">
                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      alt={product.name}
                      className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div>No Product</div>
                  )}
                </div>
                {(discountValue > 0) && (
  <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
    SALE{" "}
    {discountType === "percentage"
      ? `-${discountValue}%`
      : `-${discountValue} Flat`}
  </div>
)}
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3 mt-4">
                {product.image?.map((img, index) => (
                  <img
                    key={index}
                    src={`${API_BASE_URL}${img}`}
                    alt={`${product.name} ${index}`}
                    onClick={() =>
                      setSelectedImage(`${API_BASE_URL}${img}`)
                    }
                    className={`w-20 h-20 object-cover rounded-lg border cursor-pointer transition ${selectedImage === `${API_BASE_URL}${img}`
                      ? "border-gray-800"
                      : "border-gray-300"
                      }`}
                  />
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="p-8 lg:p-12">
              <Link href={`/category-products/${categoryId}`}>
                <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full inline-block mb-4">
                  {categoryName || "Uncategorized"}
                </span>
              </Link>
              <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900">
                {product.name}
              </h1>

              {/* Average Rating */}
              <div className="flex items-center space-x-1 mt-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-sm ${i < Math.round(averageRating)
                      ? "text-yellow-500"
                      : "text-gray-300"
                      }`}
                  >
                    ★
                  </span>
                ))}
                <span className="text-xs text-gray-500 ml-1">
                  ({averageRating})
                </span>
              </div>

              {/* Variations Only */}
             {product.variations?.length ? (
  <div className="mb-4">
    <h3 className="font-semibold mb-2">Select Option:</h3>
    <div className="flex gap-2 flex-wrap">
      {product.variations.map((v, idx) => (
        <button
          key={v._id}
          onClick={() => setSelectedVariationIndex(idx)}
          className={`px-4 py-2 rounded-lg border ${
            selectedVariationIndex === idx
              ? "bg-gray-800 text-white border-gray-800"
              : "bg-white text-gray-800 border-gray-300"
          }`}
        >
          {v.name} - ${ (v.finalPrice ?? v.price).toFixed(2) }
        </button>
      ))}
    </div>
  </div>
) : null}

              <div className="flex items-center gap-4 mb-6">
                {/* If discount is applied, show original price with line-through */}


                {/* Final Price */}
               <span className="text-3xl font-semibold text-gray-900">
  ${finalPrice.toFixed(2)}
</span>

{originalPrice > finalPrice && (
  <span className="text-xl text-gray-500 line-through">
    ${originalPrice.toFixed(2)}
  </span>
)}
              </div>

              <p className="text-gray-600 mb-6">{product.description}</p>

              {/* Quantity Selector */}
              <div className="mb-8 flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-4 py-2">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  +
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 px-6 py-4 cursor-pointer bg-gray-700 text-white font-semibold rounded-3xl hover:bg-gray-900"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleCheckout}
                  className="flex-1 px-6 py-4 cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-3xl"
                >
                  Buy Now
                </button>
              </div>

              {/* Wishlist Button */}
              <button
                onClick={toggleWishlist}
                className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition"
              >
                {wishlist.some((w) => w?.product?._id === product._id) ? (
                  <span>Remove from Wishlist ❤️</span>
                ) : (
                  <span>Add to Wishlist 🤍</span>
                )}
              </button>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="px-8 lg:px-12 py-10 border-t border-gray-100">
            <h2 className="text-3xl font-semibold mb-6">Customer Reviews</h2>

            {user && (
              <div className="mb-10 bg-white shadow-md rounded-2xl p-6 border border-gray-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Leave a Review
                </h3>

                {/* Star Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-3xl cursor-pointer transition-colors duration-200 ${i < newRating ? "text-yellow-400" : "text-gray-200"
                        } hover:text-yellow-500`}
                      onClick={() => setNewRating(i + 1)}
                    >
                      ★
                    </span>
                  ))}
                </div>

                {/* Review Textarea */}
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write your review..."
                  className="w-full border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition rounded-xl p-3 mb-4 text-gray-700 bg-gray-50"
                  rows={4}
                />

                {/* Submit Button */}
                <button
                  onClick={submitReview}
                  disabled={submittingReview}
                  className="px-5 py-2.5 bg-gray-600 hover:bg-gray-800 cursor-pointer disabled:bg-gray-300 text-white font-medium rounded-2xl shadow-sm transition"
                >
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            )}

            <div className="space-y-6">
              {reviews.length > 0 ? (
                reviews.map((review, idx) => (
                  <div key={idx} className="border-b border-gray-300 pb-4">
                    <div className="flex items-center gap-2">
                      {/* Stars */}
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-sm ${i < review.rating ? "text-yellow-500" : "text-gray-300"
                            }`}
                        >
                          ★
                        </span>
                      ))}

                      {/* Reviewer Name */}
                      <span className="text-gray-500 text-sm ml-2">
                        {review.user
                          ? `${review.user.fname} ${review.user.lname}`
                          : "Anonymous"}
                      </span>

                      {/* ✅ Verified Badge */}
                      {review.verified && (
                        <span className="ml-2 px-2 py-0.5 text-xs rounded bg-green-100 text-green-700">
                          Verified Purchase
                        </span>
                      )}
                    </div>

                    {/* Review Text */}
                    <p className="text-gray-700 mt-1">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No reviews yet. Be the first!</p>
              )}
            </div>

          </div>


           {/* Related Products */}
          {categoryId && !lessProducts &&(
            <div className="mx-10 mt-10">
              <h2 className="text-3xl pb-9 font-semibold">Related Products</h2>
              <Shop
                categoryId={categoryId}
                limit={4}
                excludeId={product._id}
                hideCategory={true}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PageDetail

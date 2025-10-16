"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaSearch, FaFilter, FaSearchLocation } from "react-icons/fa";
import { useRouter } from "next/navigation"; 

// Interfaces
interface Product {
  product: string;
  name: string;
  image: string;
  reviewed: boolean;
  quantity?: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  createdAt: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "return_requested";
  paymentMethod: string;
  total: number;
  products: Product[];
}

interface OrderStats {
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  totalAmount: number;
}

// const useDebounce = (value: string, delay: number) => {
//   const [debouncedValue, setDebouncedValue] = useState(value);

//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedValue(value);
//     }, delay);

//     return () => {
//       clearTimeout(handler);
//     };
//   }, [value, delay]);

//   return debouncedValue;
// };

const UserOrders = () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  // const debouncedSearchQuery = useDebounce(searchQuery, 1000);
  const [status, setStatus] = useState("All Orders");
  const [showPopup, setShowPopup] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [currentOrderIdx, setCurrentOrderIdx] = useState(0);
  const [currentProductIdx, setCurrentProductIdx] = useState(0);
  const [comment, setComment] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [orderStats, setOrderStats] = useState<OrderStats>({
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    totalAmount: 0,
  });

  const API = `${API_BASE_URL}/api/orders/user`;
  const orderStatsAPI = `${API_BASE_URL}/api/orders/user/stats`;

  // Fetch Orders with Filters and Search
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const params: { status?: string; search?: string } = {};
      if (status !== "All Orders") params.status = status.toLowerCase();
      if (searchQuery) params.search = searchQuery;

      const res = await axios.get(API, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
        const filtered = res.data.filter(
      (order: any) => order?.status !== "return_approved"
    );
      setOrders(filtered);
    } catch (error) {
      console.log("Error fetching user orders:", error);
    }
  };

  const getOrderStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(orderStatsAPI, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrderStats(res.data);
    } catch (error) {
      console.error("Error fetching order stats:", error);
    }
  };

  const handleExport = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${API_BASE_URL}/api/orders/user/export`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob", // important for file download
        }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "my_orders.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast.error("Failed to export orders");
      console.error("Export error:", error);
    }
  };

  // New function to cancel order
  const cancelOrder = async (orderId: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_BASE_URL}/api/orders/${orderId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Order cancelled successfully");
      fetchOrders(); // Refresh orders
    } catch (error) {
      toast.error("Failed to cancel order");
      console.error("Cancel error:", error);
    }
  };

  // New function to confirm delivery
  const confirmDelivery = async (orderId: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_BASE_URL}/api/orders/${orderId}/confirm-delivery`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Delivery confirmed successfully");
      fetchOrders(); // Refresh orders
    } catch (error) {
      toast.error("Failed to confirm delivery");
      console.error("Confirm delivery error:", error);
    }
  };

  // New function to initiate return
  const initiateReturn = async (orderId: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_BASE_URL}/api/orders/${orderId}/return`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Return initiated successfully");
      fetchOrders(); // Refresh orders
    } catch (error) {
      toast.error("Failed to initiate return");
      console.error("Initiate return error:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
    getOrderStats();
  }, [status /* debouncedSearchQuery*/]); // Re-fetch when status or searchQuery changes

  // Open popup only for delivered + unreviewed products
  useEffect(() => {
    const deliveredOrders = orders.filter((o) => o.status === "delivered");

    for (let oIdx = 0; oIdx < deliveredOrders.length; oIdx++) {
      const order = deliveredOrders[oIdx];
      const pIdx = order.products.findIndex((p) => !p.reviewed);

      if (pIdx !== -1) {
        setCurrentOrderIdx(oIdx);
        setCurrentProductIdx(pIdx);
        setShowPopup(true);
        return;
      }
    }

    setShowPopup(false);
  }, [orders]);

  // Submit Review
  const submitReview = async () => {
    try {
      const deliveredOrders = orders.filter((o) => o.status === "delivered");
      const order = deliveredOrders[currentOrderIdx];
      const product = order.products[currentProductIdx];

      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/api/review/product/${product.product}`,
        { rating: newRating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`Review submitted for ${product.name}`);

      setComment("");
      setNewRating(0);

      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o._id === order._id
            ? {
                ...o,
                products: o.products.map((p) =>
                  p.product === product.product ? { ...p, reviewed: true } : p
                ),
              }
            : o
        )
      );
    } catch (err) {
      toast.error("Error submitting review");
    }
  };

  return (
    <div className="p-10 max-w-6xl mx-auto">
      {/* Cards */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-semibold">My Orders</h2>
          <p>Track and manage your order history</p>
        </div>
        <div className="px-3 py-1 ring flex items-center rounded-lg hover:bg-gray-800 hover:text-white cursor-pointer">
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
            className="lucide inline lucide-download w-4 h-4 mr-2"
            aria-hidden="true"
          >
            <path d="M12 15V3"></path>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <path d="m7 10 5 5 5-5"></path>
          </svg>
          <span onClick={handleExport}>Export</span>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-6">
        <div className="bg-yellow-50 text-yellow-600 p-4 rounded-lg text-center">
          <div className="text-xl font-bold">{orderStats.pending}</div>
          <div className="text-sm">Pending</div>
        </div>
        <div className="bg-green-50 text-green-600 p-4 rounded-lg text-center">
          <div className="text-xl font-bold">{orderStats.processing}</div>
          <div className="text-sm">Processing</div>
        </div>
        <div className="bg-blue-50 text-blue-600 p-4 rounded-lg text-center">
          <div className="text-xl font-bold">{orderStats.shipped}</div>
          <div className="text-sm">Shipped</div>
        </div>
        <div className="bg-green-100 text-green-800 p-4 rounded-lg text-center">
          <div className="text-xl font-bold">{orderStats.delivered}</div>
          <div className="text-sm">Delivered</div>
        </div>
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
          <div className="text-xl font-bold">{orderStats.cancelled}</div>
          <div className="text-sm">Cancelled</div>
        </div>
        <div className="bg-purple-50 text-purple-600 p-4 rounded-lg text-center">
          <div className="text-xl font-bold">
            ${orderStats.totalAmount?.toFixed(2) || 0}
          </div>
          <div className="text-sm">Total Spent</div>
        </div>
      </div>

      <div className="flex items-center gap-3 p-6 ring rounded-lg ring-gray-200 my-10">
        {/* Search Input */}
        <div className="flex items-center flex-1 bg-gray-100 rounded-lg px-3">
          <input
            type="text"
            placeholder="Search orders or products..."
            className="flex-1 bg-transparent py-2 px-2 outline-none text-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                fetchOrders();
              }
            }}
          />
          <FaSearchLocation className="text-gray-400" />
        </div>

        {/* Dropdown */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded-lg px-3 py-2 text-gray-700 focus:outline-none border-gray-200 focus:ring-2 focus:ring-blue-500"
        >
          <option>All Orders</option>
          <option>Pending</option>
          <option>Processing</option>
          <option>Shipped</option>
          <option>Delivered</option>
          <option>Cancelled</option>
        </select>

        {/* More Filters Button */}
        <button className="flex items-center gap-2 border border-gray-200 cursor-pointer rounded-lg px-6 py-1.5 hover:bg-gray-100">
          <span onClick={fetchOrders}>Search</span>
        </button>
      </div>

      {orders.map((order, index) => (
        <div className="ring ring-gray-200 rounded-lg p-5 my-5" key={order._id}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-5">
              <div className="p-3 bg-gray-800 rounded-lg">
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
                  className="lucide lucide-package w-6 h-6 text-white"
                  aria-hidden="true"
                >
                  <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"></path>
                  <path d="M12 22V12"></path>
                  <polyline points="3.29 7 12 12 20.71 7"></polyline>
                  <path d="m7.5 4.27 9 5.15"></path>
                </svg>
              </div>
              <div>
                <p className="font-semibold">#{order.orderNumber}</p>
                <p className="text-sm">
                  Ordered on {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="text-right flex items-center gap-4">
              <div>
                <p className="font-semibold">${order.total.toFixed(2)}</p>
                <p className="text-sm">{order.products.length} items</p>
              </div>
              <div>
                <h1
                  className={`w-23 text-center px-3 text-sm rounded-lg capitalize ${
                    order.status === "pending"
                      ? "text-yellow-600 bg-yellow-50"
                      : order.status === "processing"
                      ? "text-blue-600 bg-blue-50"
                      : order.status === "shipped"
                      ? "text-green-600 bg-green-50"
                      : order.status === "delivered"
                      ? "text-green-800 bg-green-100"
                      : order.status === "cancelled"
                      ? "text-red-600 bg-red-50"
                      : order.status === "return_requested"
                      ? "text-orange-600 bg-orange-50"
                      : ""
                  }`}
                >
                  {order.status.replace("_", " ")}
                </h1>
              </div>
              <div
                className="text-sm cursor-pointer hover:bg-gray-100 py-1 px-2 rounded-lg"
                onClick={() =>
                  setExpandedOrderId(expandedOrderId === order._id ? null : order._id)
                }
              >
                <span>
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
                    className="lucide inline lucide-eye w-4 h-4 mr-1"
                    aria-hidden="true"
                  >
                    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </span>{" "}
                View
              </div>
            </div>
          </div>
          {expandedOrderId === order._id && (
            <div className="mt-7 pt-5 border-t border-gray-200  ">
              <div className="flex items-center justify-between mb-7">
              <div className="font-semibold mb-2">Order Items</div>
               {/* Action Buttons based on status */}
              <div className=" flex gap-3">
                {order.status === "pending" && (
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded-lg"
                    onClick={() => cancelOrder(order._id)}
                  >
                    Cancel Order
                  </button>
                )}
                {order.status === "shipped" && (
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded-lg"
                    onClick={() => confirmDelivery(order._id)}
                  >
                    Confirm Delivered
                  </button>
                )}
                {order.status === "delivered" && (
                  <button
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg"
                    onClick={() => initiateReturn(order._id)}
                  >
                    Initiate Return
                  </button>
                )}
                {order.status && (
                  <button
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg"
                    onClick={() => router.push(`/orders/${order._id}`)}
                  >
                    OrderDetails
                  </button>
                )}
              </div>
              </div>
              {order.products.map((product, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-3 bg-gray-100 my-3 rounded-lg"
                >
                  <div className="flex gap-4 items-center">
                    <div>
                      <img
                        src={`${API_BASE_URL}${product.image}`}
                        className="h-17 w-17 object-cover bg-white rounded-lg"
                        alt=""
                      />
                    </div>
                    <div>
                      <div className="font-semibold">{product.name}</div>
                      <div className="text-gray-600">Quantity: {product.quantity}</div>
                    </div>
                  </div>
                  <div className="font-semibold">${order.total.toFixed(2)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Review Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            {(() => {
              const deliveredOrders = orders.filter(
                (o) => o.status === "delivered"
              );
              const order = deliveredOrders[currentOrderIdx];
              const product = order.products[currentProductIdx];

              return (
                <>
                  <h2 className="text-xl font-bold mb-3">
                    Review: {product.name}
                  </h2>
                  <img
                    src={`${API_BASE_URL}${product.image}`}
                    alt={product.name}
                    className="w-20 h-20 object-cover mb-3 rounded"
                  />

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating
                    </label>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-3xl cursor-pointer transition-colors duration-200 ${
                            i < newRating ? "text-yellow-400" : "text-gray-200"
                          } hover:text-yellow-500`}
                          onClick={() => setNewRating(i + 1)}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>

                  <textarea
                    className="w-full border p-2 mt-3 rounded"
                    placeholder="Write your review..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />

                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      className="px-4 py-2 bg-gray-300 rounded"
                      onClick={() => setShowPopup(false)}
                    >
                      Skip
                    </button>
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded"
                      onClick={submitReview}
                    >
                      Submit
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrders;
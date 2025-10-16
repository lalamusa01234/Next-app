"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface Product {
  _id?: string;
  name: string;
  image: string;
  quantity: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  total: number;
  products: Product[];
}

const ReturnOrdersPage = () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [returns, setReturns] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReturns = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/api/orders/user/returns`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReturns(res.data);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to fetch return orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading return orders...</div>;

  return (
    <div className="p-10 mx-auto">
      <h1 className="text-3xl font-semibold mb-2">My Returns</h1>
      <p className="text-gray-600 mb-8">
        Track the progress of your returned items
      </p>

      {returns.length === 0 ? (
        <div className="text-center text-gray-500">No return orders yet.</div>
      ) : (
        returns.map((order) => (
          <div
            key={order._id}
            className="border border-gray-200 rounded-xl p-6 mb-6 shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="font-semibold text-lg">
                  Order #{order.orderNumber}
                </h2>
                <p className="text-gray-500 text-sm">
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              <span
                className={`capitalize px-4 py-1.5 rounded-lg text-sm font-medium ${
                  order.status === "return_requested"
                    ? "bg-yellow-100 text-yellow-700"
                    : order.status === "return_processing"
                    ? "bg-blue-100 text-blue-700"
                    : order.status === "return_approved"
                    ? "bg-green-100 text-green-700"
                    : order.status === "return_rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {order.status.replace("_", " ")}
              </span>
            </div>

            <div>
              {order.products.map((product, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center bg-gray-50 rounded-lg p-3 mb-3"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={`${API_BASE_URL}${product.image}`}
                      alt={product.name}
                      className="w-16 h-16 rounded-lg object-cover bg-white"
                    />
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-gray-600 text-sm">
                        Quantity: {product.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 font-semibold">${order.total.toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 text-right">
              <button
                onClick={() => (window.location.href = `/orders/${order._id}`)}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
              >
                View Details
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ReturnOrdersPage;

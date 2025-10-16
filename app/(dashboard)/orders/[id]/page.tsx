"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface Product {
  product: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  total: number;
    address: string;
    city: string;
    country: string;
    zip: string;
  paymentMethod: string;
  products: Product[];
}

interface Log {
  previousStatus: string;
  newStatus: string;
  changedBy?: { name: string };
  createdAt: string;
}

const OrderDetailsPage = () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrderDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrder(res.data.order);
      setLogs(res.data.logs || []);
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast.error("Failed to fetch order details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchOrderDetails();
  }, [id]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!order) return <div className="p-10 text-center">Order not found.</div>;

  return (
    <div className="p-10 max-w-5xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="mb-6 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
      >
        ← Back to Orders
      </button>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-semibold">Order Details</h1>
          <p className="text-gray-600">Order #{order.orderNumber}</p>
        </div>
        <span
          className={`px-4 py-2 rounded-lg capitalize text-sm font-medium ${
            order.status === "pending"
              ? "bg-yellow-100 text-yellow-700"
              : order.status === "processing"
              ? "bg-blue-100 text-blue-700"
              : order.status === "shipped"
              ? "bg-green-100 text-green-700"
              : order.status === "delivered"
              ? "bg-emerald-100 text-emerald-700"
              : order.status === "cancelled"
              ? "bg-red-100 text-red-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {order.status}
        </span>
      </div>

      {/* Order Info */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="font-semibold text-lg mb-4">Shipping Address</h2>
          <p>{order?.address}</p>
          <p>
            {order?.city}, {order?.country}
          </p>
          <p>ZIP: {order?.zip}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="font-semibold text-lg mb-4">Payment Info</h2>
          <p>Method: {order.paymentMethod}</p>
          <p>Total: ${order.total.toFixed(2)}</p>
          <p>Placed: {new Date(order.createdAt).toLocaleString()}</p>
        </div>
      </div>

      {/* Products */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-10">
        <h2 className="font-semibold text-lg mb-4">Ordered Products</h2>
        {order.products.map((product, i) => (
          <div
            key={i}
            className="flex justify-between items-center border-b border-gray-100 py-3"
          >
            <div className="flex items-center gap-4">
              <img
                src={`${API_BASE_URL}${product.image}`}
                alt={product.name}
                className="h-16 w-16 object-cover rounded-lg"
              />
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-gray-600">
                  Qty: {product.quantity} × ${product.price}
                </p>
              </div>
            </div>
            <p className="font-semibold">
              ${(product.quantity * product.price).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {/* Status Logs */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="font-semibold text-lg mb-4">Status History</h2>
        {logs.length === 0 ? (
          <p className="text-gray-500">No status changes yet.</p>
        ) : (
          <div className="relative border-l border-gray-200 ml-2 pl-4">
            {logs.map((log, i) => (
              <div key={i} className="mb-4 relative">

                <p className="text-sm">
                  <span className="capitalize font-medium">
                    {log.previousStatus}
                  </span>{" "}
                  →{" "}
                  <span className="capitalize text-blue-600 font-semibold">
                    {log.newStatus}
                  </span>
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(log.createdAt).toLocaleString()} by{" "}
                  {log.changedBy?.name || "System"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailsPage;

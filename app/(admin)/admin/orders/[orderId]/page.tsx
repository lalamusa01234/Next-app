"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";

// --------------------
// Types
// --------------------
interface Variation {
  name: string;
  value: string;
}

interface Product {
  _id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variation?: Variation[];
}

interface Order {
  _id: string;
  orderNumber: string;
  fname: string;
  lname: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  zip: string;
  notes?: string;
  billingMethod: string;
  paymentMethod: string;
  status: string;
  createdAt: string;
  products: Product[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  order : any;
  logs : any;
}

const OrderDetails = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [data, setData] = useState<Order | null>(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [updating, setUpdating] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  

  const getOrderById = async (id: string) => {
    try {
      const res = await axios.get<Order>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${id}`
      );
      setData(res.data.order);
      setLogs(res.data.logs || []);
      setSelectedStatus(res.data.status);
    } catch (error) {
      console.error("Error fetching order by ID", error);
    }
  };

  const updateStatus = async () => {
    if (!orderId) return;
    try {
      setUpdating(true);
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}/status`,
        { status: selectedStatus }
      );
      setData((prev) => (prev ? { ...prev, status: selectedStatus } : prev));
      toast.success("Status Changed!");
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    if (orderId) getOrderById(orderId);
  }, [orderId]);

  if (!data) return <p className="p-6">Loading order details...</p>;

  // ✅ helper for dynamic badge classes
  const getStatusClasses = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "processing":
        return "bg-blue-100 text-blue-700";
      case "shipped":
        return "bg-purple-100 text-purple-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      default:
        return "bg-red-100 text-red-700";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Order #{data.orderNumber}</h1>
        <Link href="/admin/orders">
          <button className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700">
            Back
          </button>
        </Link>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-xl shadow-md p-5">
            <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
            <p className="text-gray-700">
              <span className="font-medium">Name:</span> {data.fname} {data.lname}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Email:</span> {data.email}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Phone:</span> {data.phone}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Address:</span> {data.address}, {data.city}, {data.country}, {data.zip}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Note:</span> {data.notes}
            </p>
          </div>

          {/* Products */}
          <div className="bg-white rounded-xl shadow-md p-5">
            <h2 className="text-lg font-semibold mb-4">Products</h2>
            <div className="divide-y divide-gray-300">
              {data.products?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}${item.image}`}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md border"
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>

                  {item.variation && item.variation.length > 0 && (
                    <div className="mt-2 text-sm text-gray-700">
                      <ul className="list-disc ml-6">
                        {item.variation.map((v, i) => (
                          <li key={i}>
                            {v.name}: <span className="font-medium">{v.value}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <p className="font-semibold">${item.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>


        {/* Right section (order summary) */}
        <div className="space-y-6">
          {/* Order Info */}
          <div className="bg-white rounded-xl shadow-md p-5 space-y-3">
            <div className="flex justify-between">
              <h2 className="text-lg font-semibold">Order Information</h2>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClasses(
                  data.status
                )}`}
              >
                {data.status}
              </span>
            </div>
            <p>
              <span className="font-medium">Billing:</span> {data.billingMethod}
            </p>
            <p>
              <span className="font-medium">Payment:</span> {data.paymentMethod}
            </p>
            <p>
              <span className="font-medium">Notes:</span> {data.notes || "None"}
            </p>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="font-medium">Status:</span>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="border border-gray-300 rounded-lg px-2 py-1 text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="return_requested">return_requested</option>
                  <option value="return_approved">return_approved</option>
                  <option value="return_rejected">return_rejected</option>
                </select>
              </div>
              <button
                onClick={updateStatus}
                disabled={updating}
                className="px-2.5 cursor-pointer py-1.5 bg-gray-700 text-white text-sm rounded-2xl hover:bg-gray-900 disabled:opacity-50"
              >
                {updating ? "Updating..." : "Update"}
              </button>
            </div>

            <p className="text-sm text-gray-500">
              Ordered At: {new Date(data.createdAt).toLocaleString()}
            </p>
          </div>
                  {/* ✅ Order Status History */}
<div className="bg-white rounded-xl shadow-md p-5">
  <h2 className="text-lg font-semibold mb-3">Status History</h2>
  {logs.length === 0 ? (
    <p className="text-gray-500 text-sm">No status changes yet.</p>
  ) : (
    <div className="relative border-l border-gray-200 ml-2 pl-4">
      {logs.map((log, i) => (
        <div key={i} className="mb-4 relative">
          <p className="text-sm">
            <span className="capitalize font-medium">{log.previousStatus}</span> →{" "}
            <span className="capitalize text-blue-600 font-semibold">{log.newStatus}</span>
          </p>
          <p className="text-xs text-gray-500">
            {new Date(log.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  )}
</div>


          {/* Totals */}
          <div className="bg-white rounded-xl shadow-md p-5">
            <h2 className="text-lg font-semibold mb-3">Order Summary</h2>
            <div className="space-y-2 text-gray-700">
              <p className="flex justify-between">
                <span>Subtotal:</span> <span>${data.subtotal}</span>
              </p>
              <p className="flex justify-between">
                <span>Tax:</span> <span>${data.tax}</span>
              </p>
              <p className="flex justify-between">
                <span>Shipping:</span> <span>${data.shippingCost}</span>
              </p>
              <hr />
              <p className="flex justify-between text-lg font-bold">
                <span>Total:</span> <span>${data.total}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;

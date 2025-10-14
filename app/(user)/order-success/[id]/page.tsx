"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";

// Define TypeScript interfaces for the order and product data
interface Product {
  image: string | string[];
  name: string;
  selectedOptions?: { name: string; value: string }[];
  quantity: number;
  price: number;
}

interface Order {
  orderNumber: string;
  createdAt: string;
  status: string;
  paymentMethod: string;
  billingMethod: string;
  fname: string;
  lname: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  zip: string;
  shipAddress?: string;
  shipCity?: string;
  shipCountry?: string;
  shipZip?: string;
  products?: Product[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  notes?: string;
}

const OrderSuccess: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);



 
  const API = "http://localhost:3000/api/orders";

  useEffect(() => {
  const fetchOrder = async () => {
    try {
      const res = await axios.get(`${API}/track/${id}`);
      console.log("API response:", res.data);
      setOrder(res.data);
    } catch (err) {
      console.error("Failed to fetch order:", err);
    } finally {
      setLoading(false);
    }
  };

  if (id) {
    fetchOrder();
  }
}, [id]);

  if (loading) return <p className="text-center mt-20">Loading...</p>;

  if (!order) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-bold text-red-600">Order not found</h2>
        <Link href="/" className="text-purple-600 underline">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-6 mx-15">
      <div className="bg-white shadow-md rounded-xl p-8 w-full">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Thank you for your purchase!</h1>
          <p className="mt-2 text-gray-600">
            Your order has been placed successfully.
          </p>
        </div>

        {/* Order Info */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Order Details</h2>
            <p>
              <span className="font-medium">Order Number:</span>{" "}
              {order.orderNumber}
            </p>
            <p>
              <span className="font-medium">Placed On:</span>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>
            <p>
              <span className="font-medium">Status:</span> {order.status}
            </p>
            <p>
              <span className="font-medium">Payment:</span>{" "}
              {order.paymentMethod}
            </p>
            <p>
              <span className="font-medium">Shipping:</span>{" "}
              {order.billingMethod}
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Customer Info</h2>
            <p>
              {order.fname} {order.lname}
            </p>
            <p>{order.email}</p>
            <p>{order.phone}</p>
            <p>
              <span className="font-medium">Billing Address:</span>
              <br />
              {order.address}, {order.city}, {order.country} {order.zip}
            </p>
            {order.shipAddress && (
              <p>
                <span className="font-medium">Shipping Address:</span>
                <br />
                {order.shipAddress}, {order.shipCity}, {order.shipCountry}{" "}
                {order.shipZip}
              </p>
            )}
          </div>
        </div>

        {/* Products */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-3">Products</h2>
          <div className="divide-y divide-gray-300">
            {order.products?.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <img
                    src={
                      Array.isArray(item.image)
                        ? `http://localhost:3000${item.image[0]}`
                        : `http://localhost:3000${item.image}`
                    }
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md border"
                  />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    {item.selectedOptions &&
                      item.selectedOptions.length > 0 && (
                        <p className="text-sm text-gray-500">
                          {item.selectedOptions
                            .map((opt) => `${opt.name}: ${opt.value}`)
                            .join(", ")}
                        </p>
                      )}
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="font-semibold">${item.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-3">Order Summary</h2>
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>${order.shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total Paid:</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {order.notes && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Notes</h2>
            <p className="text-gray-700">{order.notes}</p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/tracking"
            className="px-5 py-2 bg-gray-800 text-white rounded-lg hover:bg-purple-700"
          >
            Track Order
          </Link>
          <Link
            href="/shop"
            className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;

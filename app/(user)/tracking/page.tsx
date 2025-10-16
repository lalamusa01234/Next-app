"use client"
import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

interface TruckIconProps {
  className?: string;
}

const TruckIcon: React.FC<TruckIconProps> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.5" y="7" width="11" height="7.5" rx="1.2" />
      <path d="M13.5 8.5h3.9c.4 0 .8.2 1 .6l2.3 3.7c.2.3.3.6.3 1v2.7c0 .7-.6 1.3-1.3 1.3H18" />
      <path d="M13.5 10.5h3" />
      <circle cx="7" cy="18" r="1.9" />
      <circle cx="17" cy="18" r="1.9" />
      <path d="M8.9 18h6.2" />
    </g>
  </svg>
);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const steps = ["pending", "processing", "shipped", "delivered"] as const;

interface StatusStepsProps {
  currentStatus: typeof steps[number];
}

const StatusSteps: React.FC<StatusStepsProps> = ({ currentStatus }) => {
  const currentIndex = steps.indexOf(currentStatus);
  return (
    <div className="flex items-center justify-between mt-6">
      {steps.map((step, index) => {
        const isCompleted = index <= currentIndex;
        return (
          <div key={step} className="flex-1 flex items-center">
            <div className="relative flex flex-col items-center text-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${isCompleted
                    ? "bg-purple-600 border-purple-600 text-white"
                    : "bg-gray-200 border-gray-300 text-gray-500"
                  }`}
              >
                {index + 1}
              </div>
              <span
                className={`mt-2 text-sm font-medium ${isCompleted ? "text-purple-600" : "text-gray-400"
                  }`}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 ${index < currentIndex ? "bg-purple-600" : "bg-gray-300"
                  }`}
              ></div>
            )}
          </div>
        );
      })}
    </div>
  );
};

interface Product {
  image: string[];
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  status: string;
  orderNumber: string;
  createdAt: string;
  paymentMethod: string;
  billingMethod: string; // Note: This might be a typo in original code; assuming it's intended
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

interface FormData {
  orderNumber: string;
}

const Tracking: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const API = `${API_BASE_URL}/api/orders`;

  const onSubmit = async (data: FormData) => {
    setError("");
    setLoading(true);
    setOrder(null);
    try {
      const res = await axios.get<Order>(`${API}/track/${data.orderNumber}`);
      setOrder(res.data);
    } catch (err) {
      console.error(err);
      setError("Order not found. Please check your Order Number again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen mx-10 xl:mx-15 2xl:mx-46">
      <main className="flex-1 py-6 w-full">
        <h1 className="text-2xl font-bold mb-6">Track Your Order</h1>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Enter Order Number"
            {...register("orderNumber", { required: "Order Number is required" })}
            className="flex-1 border border-gray-300 px-4 py-2 rounded-lg focus:ring focus:ring-purple-200"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? "Searching..." : "Track"}
          </button>
        </form>

        {errors.orderNumber && <p className="text-red-600 mb-2">{errors.orderNumber.message}</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}

        {!order && !loading && !error && (
          <div className="text-center text-gray-500 mt-12">
            <TruckIcon className="mx-auto h-20 w-20 text-gray-300" />
            <p className="mt-4">Enter your order number above to track your package.</p>
          </div>
        )}

        {order && (
          <div className="bg-white shadow-md rounded-xl p-6 space-y-8">
            {order.status === "cancelled" ? (
              <div className="mt-6 text-red-600 font-semibold">This order was cancelled.</div>
            ) : (
              <StatusSteps currentStatus={order.status as typeof steps[number]} />
            )}

            {/* Order Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Order Details</h2>
                <p><span className="font-medium">Order #:</span> {order.orderNumber}</p>
                <p><span className="font-medium">Placed On:</span> {new Date(order.createdAt).toLocaleString()}</p>
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  <span className={`px-2 py-1 rounded-lg text-sm ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </p>
                <p><span className="font-medium">Payment:</span> {order.paymentMethod}</p>
                <p><span className="font-medium">Shipping:</span> {order.billingMethod}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Customer Info</h2>
                <p>{order.fname} {order.lname}</p>
                <p>{order.email}</p>
                <p>{order.phone}</p>
                <p><span className="font-medium">Billing Address:</span><br />
                  {order.address}, {order.city}, {order.country} {order.zip}
                </p>
                {order.shipAddress && (
                  <p><span className="font-medium">Shipping Address:</span><br />
                    {order.shipAddress}, {order.shipCity}, {order.shipCountry} {order.shipZip}
                  </p>
                )}
              </div>
            </div>

            {/* Products */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Products</h3>
              <div className="divide-y divide-gray-300">
                {order.products?.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          Array.isArray(item.image) && item.image.length > 0
                            ? `${API_BASE_URL}${item.image[0]}`
                            : `${API_BASE_URL}${item.image}`
                        }
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md border"
                      />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-semibold">${item.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Order Summary</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between"><span>Subtotal:</span><span>${order.subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Tax:</span><span>${order.tax.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Shipping:</span><span>${order.shippingCost.toFixed(2)}</span></div>
                <div className="flex justify-between font-bold text-lg border-t pt-2"><span>Total:</span><span>${order.total.toFixed(2)}</span></div>
              </div>
            </div>

            {/* Notes */}
            {order.notes && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Notes</h3>
                <p className="text-gray-700">{order.notes}</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Tracking;
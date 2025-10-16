"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { FaShoppingBag, FaUndoAlt, FaUser } from "react-icons/fa";
import Link from "next/link";


interface Product {
  product: string;
  name: string;
  image: string;
  reviewed: boolean;
}

interface Order {
  _id: string;
  orderNumber: string;
  createdAt: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
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
  return_requested: number,
  return_approved: number,
  return_rejected: number,
  totalAmount: number;
}

const Dashboard = () => {

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const user = useSelector((state : any) => state.user.user);
    const [orders, setOrders] = useState<Order[]>([]);
     const [orderStats, setOrderStats] = useState<OrderStats>({
        pending: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
        return_requested: 0,
        return_approved: 0,
        return_rejected: 0,
        totalAmount: 0,
      });
      const totalReturns =
  (orderStats.return_requested || 0) +
  (orderStats.return_approved || 0) +
  (orderStats.return_rejected || 0);
    
      const API = `${API_BASE_URL}/api/orders/user`;
      const orderStatsAPI = `${API_BASE_URL}/api/orders/user/stats`;

       // Fetch Orders
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
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


  useEffect(() => {
    fetchOrders();
    getOrderStats();
  }, []);

  if (!user) return <p>Loading your data...</p>;

  // Dashboard card data
  const cards = [
    {
      id:0,
      title: "Orders",
      icon: <div className="bg-blue-500 p-3 rounded-lg"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-package w-6 h-6 text-white" aria-hidden="true"><path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"></path><path d="M12 22V12"></path><polyline points="3.29 7 12 12 20.71 7"></polyline><path d="m7.5 4.27 9 5.15"></path></svg></div>,
      description: "View your orders and their status",
      link: "orders",
      stat: `${orders.length} items`,
    },
    {
      id:1,
      title: "Returns",
      icon: <div className="bg-orange-500 p-3 rounded-lg"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-rotate-ccw w-6 h-6 text-white" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg></div>,
      description: "Track or initiate product returns",
      link: "return",
      stat:`${totalReturns} items`,
    },
    {
      id:2,
      title: "Profile",
      icon: <div className="bg-green-500 p-3 rounded-lg"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user w-6 h-6 text-white" aria-hidden="true"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></div>,
      description: "Edit your personal information",
      link: "profile",
    },
   
  ];

  return (
    <div className="p-10">
      <div className="p-8 mb-8 bg-gray-900 rounded-xl shadow-md text-left text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user.fname}!</h1>
        <p className="text-gray-300"><strong>Email:</strong> {user.email}</p>
        <p className="text-gray-300"><strong>Username:</strong> {user.username}</p>
        <p className="text-gray-300"><strong>Phone:</strong> {user.phone}</p>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {cards.map((card, index) => (
          <Link href={card.link} key={card.id}><div
            
            className="flex  gap-3 p-6 h-full  bg-white rounded-lg ring-1 ring-gray-200 hover:shadow-lg transition-shadow duration-200"
          >
            <div className=" text-blue-500">{card.icon}</div>
            <div className="">
              <div>
            <h2 className="text-xl font-semibold ">{card.title}</h2>
            <p className="text-gray-600 text-sm mb-2">{card.description}</p>
            </div>
            <div className=" font-semibold text-xl">{card.stat}</div>
            </div>
          
          </div></Link>
        ))}
      </div>
      <div className="ring ring-gray-200 p-6 rounded-lg">
  <h2 className="font-semibold mb-7 text-xl">Recent Orders</h2>
  {orders.length === 0 ? (
    <h1>No Orders found</h1>
  ) : (
    <div>
      {orders.slice(0,3).map((order, index) => (
        <div key={order._id} className="flex justify-between items-center p-3 bg-gray-100 my-5 rounded-lg">
          
          <div className="flex items-center gap-5">
            <div className="p-3 bg-gray-800 rounded-lg"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shopping-bag w-5 h-5 text-white" aria-hidden="true"><path d="M16 10a4 4 0 0 1-8 0"></path><path d="M3.103 6.034h17.794"></path><path d="M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z"></path></svg></div>
            <div>
            <p className="font-semibold">#{order.orderNumber}</p>
            <p className="text-sm text-gray-500">
              {new Date(order.createdAt).toLocaleDateString()} • {order.products.length} items
            </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold">${order.total.toFixed(2)}</p>
            <p
              className={`text-sm capitalize ${
                order.status === "delivered"
                  ? "text-green-600"
                  : order.status === "processing"
                  ? "text-orange-600"
                  : "text-yellow-600"
              }`}
            >
              {order.status}
            </p>
          </div>
        </div>
      ))}
    </div>
  )}
</div>
<div className="text-center mt-8 text-blue-600 font-semibold text-lg"><h2><span className="text-2xl mr-1">←</span> Back to Home</h2></div>
    </div>
  );
};

export default Dashboard;

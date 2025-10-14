"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import OrderTable from "./_components/OrderTable";
import { useRouter } from "next/navigation";


interface OrderStats {
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  totalRevenue: number;
}




// Define the order type
interface Order {
  _id: string;
  status: "pending" | "processing" | "shipped" | "cancelled" | "delivered";
  total: number;
  createdAt: string;
  updatedAt: string;
  // Add more fields if your API has them
}

const Ordersdata: React.FC = () => {
     const router = useRouter();
  // const navigate = useNavigate();
  const [data, setData] = useState<Order[]>([]);
const orderStatsAPI = "http://localhost:3000/api/orders/stats";
    // Status counts
  const [orderStats, setOrderStats] = useState<OrderStats>({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    totalRevenue: 0,
  });

  const API = "http://localhost:3000/api/orders";

  // Fetch orders
  const getOrdersData = async () => {
    try {
      const res = await axios.get<Order[]>(API);
      setData(res.data);
      console.log("order", res);
    } catch (error) {
      console.log(error);
    }
  };

  const getOrderStats = async () => {
  try {
    const res = await axios.get<OrderStats>(orderStatsAPI);
    setOrderStats(res.data);
  } catch (error) {
    console.error("Error fetching order stats:", error);
  }
};



  useEffect(() => {
    getOrdersData();
    getOrderStats();
  }, []);

  // Total calculation
  const tot =
    data && data.length > 0
      ? data.reduce((acc, val) => acc + val.total, 0)
      : 0;

  const handleRowClick = (id: string) => {
    router.push(`/admin/order/${id}`);
  };

  return (
    <div className="overflow-x-auto p-4 mt-3">
      {/* Header */}
      <div className="flex justify-between bg-white rounded-t-2xl px-7 pt-7">
        <div className="mx-2 self-start">
          <h1 className="font-semibold text-2xl">Orders</h1>
          <h3 className="text-gray-400 text-sm font-medium mt-1.5">
            ${tot.toFixed(2)} Total
          </h3>
        </div>

        {/* Status Counters */}
        <div className="gap-4 hidden lg:flex">
          <div className="border-r-1 pr-5 border-gray-200 text-purple-600">
            <div className="text-2xl font-medium text-center">
              {orderStats.processing || 0}
            </div>
            <div className="text-center">Processing</div>
          </div>
          <div className="text-yellow-600 border-r-1 border-gray-200 pr-5 mx-2">
            <div className="text-2xl font-medium text-center">
              {orderStats.pending || 0}
            </div>
            <div className="text-center">Pending</div>
          </div>
          <div className="border-r-1 pr-5 border-gray-200 text-red-600">
            <div className="text-2xl font-medium text-center">
              {orderStats.cancelled || 0}
            </div>
            <div className="text-center">Cancelled</div>
          </div>
          <div className="border-r-1 pr-5 border-gray-200 text-blue-600">
            <div className="text-2xl font-medium text-center">
              {orderStats.shipped || 0}
            </div>
            <div className="text-center">Shipped</div>
          </div>
          <div className="border-gray-200 text-green-600">
            <div className="text-2xl font-medium text-center">
              {orderStats.delivered || 0}
            </div>
            <div className="text-center">Delivered</div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <OrderTable />
    </div>
  );
};

export default Ordersdata;

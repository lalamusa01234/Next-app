"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
// import Ordertable from "./orders/_components/Ordertable";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import OrderTable from "./orders/_components/OrderTable";


interface OrderProduct {
  product: string;
  name: string;
  price: number;
  quantity: number;
}

// Order type
interface Order {
  _id: string;
  products: OrderProduct[];
  total: number;
  status: string;
}

// User type
interface User {
  _id: string;
  name: string;
  email: string;
}

// Product type
interface Product {
  _id: string;
  name: string;
  price: number;
}

// Top product response
interface TopProduct {
  _id: string;
  name: string;
  totalSold: number;
}

// Order stats response
interface OrderStats {
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  totalRevenue: number;
}

// Monthly sales response
interface MonthlySales {
  month: string;
  revenue: number;
}

const AdminDb = () => {
const [data, setData] = useState<Order[]>([]);
const [userdata, setUserdata] = useState<User[]>([]);
const [productData, setProductData] = useState<{ totalProducts: number }>({ totalProducts: 0 });
const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
const [orderStats, setOrderStats] = useState<OrderStats>({
  total: 0,
  pending: 0,
  processing: 0,
  shipped: 0,
  delivered: 0,
  cancelled: 0,
  totalRevenue: 0,
});
const [monthlySales, setMonthlySales] = useState<MonthlySales[]>([]);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


  const productsAPI = `${API_BASE_URL}/api/products`;
  const usersAPI = `${API_BASE_URL}/api/users`;
  const orderAPI = `${API_BASE_URL}/api/orders`;
  const topProductsAPI = `${API_BASE_URL}/api/orders/top-products`;
  const orderStatsAPI = `${API_BASE_URL}/api/orders/stats`;
  const monthSalesAPI = `${API_BASE_URL}/api/orders/monthly-sales`;


  const getProductsData = async () => {
  try {
    const res = await axios.get<{ totalProducts: number }>(productsAPI);
    setProductData(res.data);
  } catch (error) {
    console.log(error);
  }
};

const getUsersData = async () => {
  try {
    const res = await axios.get<User[]>(usersAPI);
    setUserdata(res.data);
  } catch (error) {
    console.log(error);
  }
};

const getOrdersData = async () => {
  try {
    const res = await axios.get<Order[]>(orderAPI);
    setData(res.data);
  } catch (error) {
    console.log(error);
  }
};

const getTopProducts = async () => {
  try {
    const res = await axios.get<TopProduct[]>(topProductsAPI);
    setTopProducts(res.data);
  } catch (error) {
    console.error("Error fetching top products:", error);
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

const getMonthlySales = async () => {
  try {
    const res = await axios.get<MonthlySales[]>(monthSalesAPI);
    setMonthlySales(res.data);
  } catch (err) {
    console.error("Error fetching monthly sales:", err);
  }
};




  const statusData = [
    { name: "Pending", value: orderStats.pending || 0 },
    { name: "Processing", value: orderStats.processing || 0 },
    { name: "Shipped", value: orderStats.shipped || 0 },
    { name: "Delivered", value: orderStats.delivered || 0 },
    { name: "Cancelled", value: orderStats.cancelled || 0 },
  ];
  const COLORS = ["#FACC15", "#3B82F6", "#10B981", "#EF4444", "#AC2774"];

  // 🔹 Top Products (example: sort by total sales)
  const productSales: Record<string, { name: string; quantity: number; revenue: number }> = {};

  data.forEach((order) => {
    order.products.forEach((p) => {
      // only count if it has product + name
      if (p.product && p.name) {
        if (!productSales[p.product]) {
          productSales[p.product] = {
            name: p.name,
            quantity: 0,
            revenue: 0,
          };
        }
        productSales[p.product].quantity += p.quantity || 0;
        productSales[p.product].revenue += (p.price || 0) * (p.quantity || 0);
      }
    });
  });


  useEffect(() => {
    getOrdersData();
    getUsersData();
    getProductsData();
    getTopProducts();
    getOrderStats();
    getMonthlySales();
  }, []);

  // Total Revenue
  const totalRevenue = data.reduce((acc, order) => acc + order.total, 0);


  const totalUsers = userdata.length;
  const totalProducts = productData.totalProducts;

  return (
    <div className="p-5">
      <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>

      <div className="flex flex-wrap  gap-4 mb-6 mr-2">
        {/* Total Orders */}
        <div className="h-30 flex-1 bg-white text-black p-5 rounded-xl shadow-lg flex items-center gap-4 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <div className="p-3 rounded-full bg-gradient-to-tr from-blue-500 to-blue-700">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none"
              xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 4h8l1 2h3a1 1 0 0 1 1 1v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a1 1 0 0 1 1-1h3l1-2Z" />
              <path d="M9 12h6" />
              <path d="M9 16h6" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-400">Total Orders</h2>
            <p className="text-2xl font-medium">{orderStats.total}</p>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="h-30 flex-1 bg-white text-black p-5 rounded-xl shadow-lg flex items-center gap-4 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <div className="p-3 rounded-full bg-gradient-to-tr from-green-500 to-green-700">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none"
              xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1v22" />
              <path d="M17 5a4 4 0 0 0-4-2H9a4 4 0 0 0 0 8h6a4 4 0 0 1 0 8h-2a4 4 0 0 1-4-2" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-400">Total Revenue</h2>
            <p className="text-2xl font-medium">${orderStats.totalRevenue ? orderStats.totalRevenue.toFixed(2) : "0.00"}</p>
          </div>
        </div>

        {/* Total Users */}
        <div className="h-30 flex-1 bg-white text-black p-5 rounded-xl shadow-lg flex items-center gap-4 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <div className="p-3 rounded-full bg-gradient-to-tr from-purple-500 to-purple-700">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none"
              xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-400">Total Users</h2>
            <p className="text-2xl font-medium">{totalUsers || 0}</p>
          </div>
        </div>

        {/* Total Product */}
        <div className="h-30 flex-1 bg-white text-black p-5 rounded-xl shadow-lg flex items-center gap-4 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <div className="p-3 rounded-full bg-gradient-to-tr from-orange-500 to-orange-700">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none"
              xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7 12 3l9 4-9 4-9-4Z" />
              <path d="M3 7v10l9 4 9-4V7" />
              <path d="M12 11v10" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-400">Total Product</h2>
            <p className="text-2xl font-medium">{totalProducts || 0}</p>
          </div>
        </div>
      </div>





      {/* 🔹 Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-10 mr-2">
        {/* Revenue Trend */}
        <div className="bg-white p-5 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Revenue Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlySales}>
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders by Status */}
        <div className="bg-white p-5 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Orders by Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 🔹 Top Products */}
      <div className="bg-white p-5 rounded-xl shadow-lg mr-2">
        <h2 className="text-xl font-semibold mb-4">Top Selling Products</h2>
        <ul className="divide-y divide-gray-200">
          {topProducts.map((p, i) => (
            <li key={p._id || i} className="flex justify-between py-2">
              <span>{p.name}</span>
              <span className="font-medium">{p.totalSold || 0} sold</span>
            </li>
          ))}
        </ul>
      </div>
      {/* table section  */}
      <div className="mr-2">
        <div className="flex justify-between bg-white rounded-t-2xl px-7 pt-7 mt-10">
          <div className="mx-2">
            <h1 className="font-semibold text-2xl my-1">Latest Orders</h1>
            <h3 className="font-semibold text-sm text-gray-400">
              {data.length} Total{" "}
            </h3>
          </div>
          <div className="flex gap-4">
            <div className="border-r-1 pr-5 border-gray-200 text-green-600">
              <div className="text-2xl font-medium text-center">
                {orderStats.delivered || 0}
              </div>
              <div className="text-center">Done</div>
            </div>
            <div className="text-yellow-600 mx-2">
              <div className="text-2xl font-medium text-center">
                {orderStats.pending || 0}
              </div>
              <div className="text-center">Pending</div>
            </div>
          </div>

        </div>


        {/* Orders Table */}
        <div className="">
          {/* <Ordertable /> */}
          <OrderTable />
        </div>

      </div>
    </div>
  );
};

export default AdminDb;

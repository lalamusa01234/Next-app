"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";


interface Subscriber {
  _id: string;
  email: string;
  createdAt: string;
}



const SubscribersTable = () => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const API = `${API_BASE_URL}/api/newsletter`;

  const getSubscribers = async () => {
    try {
      const res = await axios.get(API);
      setSubscribers(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id : string) => {
    try {
      await axios.delete(`${API}/${id}`);
      setSubscribers(subscribers.filter((s) => s._id !== id));
      toast.success("Subscriber deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete subscriber!");
    }
  };

  useEffect(() => {
    getSubscribers();
  }, []);

  return (

        <div className="overflow-x-auto p-4 mt-3">
      {/* Header */}
      <div className="bg-white rounded-t-2xl px-7 pt-7 flex justify-between items-center">
        <h1 className="font-semibold text-2xl">Subscribers</h1>
        <h3 className="text-gray-500 text-sm font-medium">
          {subscribers.length} Total
        </h3>
      </div>
      <div className="p-4 w-full bg-white rounded-2xl rounded-t-none overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="text-left text-sm uppercase border-y border-gray-100 text-gray-600">
            <th className="py-3 px-6">#</th>
            <th className="py-3 px-6">Email</th>
            <th className="py-3 px-6">Date</th>
            <th className="py-3 px-6 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {subscribers.map((s, ind) => (
            <tr key={s._id} className="hover:bg-gray-50">
              <td className="py-3 px-6">{ind + 1}</td>
              <td className="py-3 px-6">{s.email}</td>
              <td className="py-3 px-6">
                {new Date(s.createdAt).toLocaleDateString()}
              </td>
              <td className="py-3 px-9 text-right">
                <button
                  onClick={() => handleDelete(s._id)}
                  className="bg-red-600 hover:bg-white text-white hover:text-red-600 p-2 rounded-full"
                >
                  <FaTrash size={14} />
                </button>
              </td>
            </tr>
          ))}
          {subscribers.length === 0 && (
            <tr>
              <td colSpan={4} className="py-6 text-center text-gray-500">
                No subscribers found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default SubscribersTable;
